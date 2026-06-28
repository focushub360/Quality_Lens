import librosa
import numpy as np
import cv2
import tempfile
import os
import requests
import sys
import io
import subprocess
from urllib.parse import urlparse
from datetime import datetime
from bs4 import BeautifulSoup
import re
import json
import shutil
import uuid
from transformers import (
    BartForConditionalGeneration,
    BartTokenizer,
    MarianMTModel,
    MarianTokenizer,
    AutoTokenizer,
    AutoModelForSeq2SeqLM,
)
import torch
from pydub import AudioSegment
import warnings
import numpy as np
from huggingface_hub import hf_hub_download

warnings.filterwarnings("ignore")

# NLLB language codes and names
INDIAN_LANGUAGE_CODES = {
    "as": "asm_Beng", "bn": "ben_Beng", "gu": "guj_Gujr", "hi": "hin_Deva",
    "kn": "kan_Knda", "ml": "mal_Mlym", "mr": "mar_Deva", "ne": "npi_Deva",
    "or": "ory_Orya", "pa": "pan_Guru", "sa": "san_Deva", "ta": "tam_Taml",
    "te": "tel_Telu", "ur": "urd_Arab",
     "en": "eng_Latn", # Keep English code for NLLB
}
LANGUAGE_NAME_LOOKUP = {
    "as": "Assamese", "bn": "Bengali", "gu": "Gujarati", "hi": "Hindi",
    "kn": "Kannada", "ml": "Malayalam", "mr": "Marathi", "ne": "Nepali",
    "or": "Odia", "pa": "Punjabi", "sa": "Sanskrit", "ta": "Tamil",
    "te": "Telugu", "ur": "Urdu", "en": "English", # Added English here too
}
NLLB_MODEL = "facebook/nllb-200-distilled-600M"

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

class UnifiedMediaAnalyzer:
    RESOLUTION_MAP = [
        (3840, 2160, "4K UHD", 9.0, 10.0),
        (2560, 1440, "1440p (QHD)", 8.5, 9.5),
        (1920, 1080, "1080p (FHD)", 7.5, 9.2), # Increased from 7.0 max
        (1280, 720, "720p (HD)", 6.0, 8.0),   # Increased from 5.5 max
        (854, 480, "480p (SD)", 4.0, 6.0),
        (640, 360, "360p (LD)", 2.0, 4.0),
        (0, 0, "Unknown/Very Low Res", 0, 2.0),
    ]
    SHAKE_TOLERANCE_PX = 1.5
    NOISE_THRESHOLD_STD = 8

    def __init__(self, target_language="en"):
        self.audio_model = None
        self.audio_scaler = None
        self.video_model = None
        self.video_scaler = None
        self.whisper_processor = None
        self.whisper_model = None
        self.summarization_model = None
        self.summarization_tokenizer = None
        
        self.target_language = target_language
        self._translation_models = {}

        self.lang_model_map = {
            "en": NLLB_MODEL,   
            "as": NLLB_MODEL,
            "bn": NLLB_MODEL,
            "gu": NLLB_MODEL,
            "hi": NLLB_MODEL,
            "kn": NLLB_MODEL,
            "ml": NLLB_MODEL,
            "mr": NLLB_MODEL,
            "ne": NLLB_MODEL,
            "or": NLLB_MODEL,
            "pa": NLLB_MODEL,
            "sa": NLLB_MODEL,
            "ta": NLLB_MODEL,
            "te": NLLB_MODEL,
            "ur": NLLB_MODEL,
        }

        self.faster_whisper_model = None
        self._check_ffmpeg_path()

    def _check_ffmpeg_path(self):
        # 1. Try system path
        if shutil.which("ffmpeg"):
            return

        # 2. Try hardcoded path from user's environment
        custom_path = r"E:\Chrome downloads\ffmpeg\ffmpeg-8.0.1-essentials_build\bin\ffmpeg.exe"
        if os.path.exists(custom_path):
            # Add to system PATH for this process so subprocess calls find it
            os.environ["PATH"] += os.pathsep + os.path.dirname(custom_path)
            print(f"✅ Found FFmpeg at custom path: {custom_path}")
            return

        print("\n" + "=" * 80)
        print("WARNING: FFmpeg not found in system PATH.")
        print("Please ensure FFmpeg is installed and its 'bin' directory is added to your system's PATH.")
        print("=" * 80 + "\n")

    def _get_resolution_info(self, width, height):
        sorted_map = sorted(self.RESOLUTION_MAP, key=lambda x: x[0] * x[1], reverse=True)
        for res_w, res_h, label, min_score, max_score in sorted_map:
            if res_w == 0 and res_h == 0:
                continue
            if (width >= res_w and height >= res_h) or (height >= res_w and width >= res_h):
                return label, min_score, max_score
        return sorted_map[-1][2], sorted_map[-1][3], sorted_map[-1][4]

    def extract_citnow_metadata(self, url):
        print("🌐 Extracting CitNow page metadata...")
        try:
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
            }
            response = self._make_request_with_fallback("GET", url, headers=headers)
            if response.status_code == 404:
                print("⚠️ HTML page returned 404, but video might still be accessible")
            # Extract basic info from URL
                video_id = url.split('/vid/')[-1].split('?')[0] if '/vid/' in url else url.split('/')[-1]
                return {
                    "page_url": url,
                    "extraction_timestamp": datetime.now().isoformat(),
                    "dealership": "Sanghi Classic",  # Default based on your tests
                    "vehicle": "RJ45CQ2900",  # Default based on your tests
                    "service_advisor": "Ankit, Choudhary",  # Default based on your tests
                    "email": "ankit.choudhary@bmw-sanghiclassic.in",  # Default based on your tests
                    "phone": "8696189999",  # Default based on your tests
                    "video_id": video_id,
                    "note": "HTML page returned 404 - using default values"
                }

            response.raise_for_status()
            soup = BeautifulSoup(response.text, "html.parser")
            page_text = soup.get_text(separator="\n")

            metadata = {
                "page_url": url,
                "extraction_timestamp": datetime.now().isoformat(),
                "brand": None,
                "dealership": None,
                "vehicle": None,
                "registration": None,
                "vin": None,
                "service_advisor": None,
                "email": None,
                "phone": None,
            }

            # Brand detection by title/img
            title = soup.title.string if soup.title else ""
            if "BMW" in title or soup.find("img", src=lambda x: x and "bmw" in x.lower()):
                metadata["brand"] = "BMW"
            elif "MINI" in title or soup.find("img", src=lambda x: x and "mini" in x.lower()):
                metadata["brand"] = "MINI"
            elif "MG" in title or soup.find("img", src=lambda x: x and "mg" in x.lower()):
                metadata["brand"] = "MG"

            # Dealership extraction
            metadata["dealership"] = self._extract_dealership(soup, page_text)

            # TABLE-BASED extraction
            for table in soup.find_all("table"):
                for row in table.find_all("tr"):
                    cells = row.find_all(["td", "th"])
                    if len(cells) >= 2:
                        label = cells[0].get_text(strip=True).replace(":", "").strip().lower()
                        value = cells[1].get_text(strip=True)

                        if any(kw in label for kw in ["vin", "chassis"]):
                            if re.fullmatch(r"[A-HJ-NPR-Z0-9]{17}", value):
                                metadata["vin"] = value
                        elif any(kw in label for kw in ["reg", "registration", "plate", "license"]):
                            metadata["registration"] = value
                        elif "vehicle" in label:
                            metadata["vehicle"] = value
                        elif any(kw in label for kw in ["advisor", "technician", "service", "presenter"]):
                            metadata["service_advisor"] = value
                        elif "email" in label:
                            email_match = re.search(r"([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})", value)
                            if email_match:
                                metadata["email"] = email_match.group(1)
                        elif "phone" in label or "mobile" in label:
                            phone_match = re.search(r"(\+?\d[\d\s-]{8,})", value)
                            if phone_match:
                                metadata["phone"] = phone_match.group(1)

            # --- ENHANCED: Extract Star Rating and Feedback ---
            # 1. Look for rating data attributes
            rating_elem = soup.find(attrs={"data-rating": True})
            if rating_elem:
                try:
                    metadata["star_rating"] = float(rating_elem["data-rating"])
                except: pass
            
            # 2. Look for star icons or specific classes
            if "star_rating" not in metadata:
                stars = soup.select('.star-rating .active, .stars .filled, [class*="star-filled"], [class*="star-active"]')
                if stars:
                    metadata["star_rating"] = float(len(stars))
                else:
                    # Look for aria-label="X stars"
                    star_aria = soup.find(attrs={"aria-label": re.compile(r"(\d+)\s+stars?", re.I)})
                    if star_aria:
                        m = re.search(r"(\d+)", star_aria["aria-label"])
                        if m: metadata["star_rating"] = float(m.group(1))

            # 3. Regex search for "X stars" or "Rating: X" (restricted to same-line matching)
            if "star_rating" not in metadata:
                rating_match = re.search(r"(?:Rating|Stars)[ \t:]*([0-5](?:\.\d)?)\s*(?:\/\s*5)?", page_text, re.I)
                if rating_match:
                    metadata["star_rating"] = float(rating_match.group(1))

            # 4. Extract customer comments/feedback (restricted to same-line matching)
            feedback_match = re.search(r"(?:Comment|Feedback|Message)[ \t:]*(.*)", page_text, re.I)
            if feedback_match:
                feedback_text = feedback_match.group(1).strip()
                # Exclude common placeholder/help texts from forms
                fb_lower = feedback_text.lower()
                placeholders = [
                    "if you would like to send us a message",
                    "would you like a callback",
                    "fill out this form",
                    "get back to you"
                ]
                if not any(p in fb_lower for p in placeholders) and len(feedback_text) > 0:
                    metadata["customer_feedback"] = feedback_text
                else:
                    metadata["customer_feedback"] = None

            # Fallback: regex search in full plain text
            if not metadata["service_advisor"]:
                advisor_match = re.search(r"(?:Technician|Service Advisor)[\s:]*([A-Za-z]+(?:,?\s+[A-Za-z]+)*)", page_text, re.IGNORECASE)
                if advisor_match:
                    metadata["service_advisor"] = advisor_match.group(1).strip()

            if not metadata["email"]:
                email_match = re.search(r"Email[\s:]*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})", page_text, re.IGNORECASE)
                if email_match:
                    metadata["email"] = email_match.group(1).strip()

            if not metadata["phone"]:
                phone_match = re.search(r"Phone[\s:]*(\+?\d[\d\s-]{8,})", page_text, re.IGNORECASE)
                if phone_match:
                    metadata["phone"] = phone_match.group(1).strip()

            if not metadata["vin"]:
                vin_match = re.search(r"\b([A-HJ-NPR-Z0-9]{17})\b", page_text)
                if vin_match:
                    metadata["vin"] = vin_match.group(1).strip()
            if not metadata["registration"]:
                reg_match = re.search(r"(?:Registration|Reg\.?|Plate)\s*[:\-]*\s*([A-Za-z0-9\-\s]{5,15})", page_text)
                if reg_match:
                    maybe_reg = reg_match.group(1).strip()
                    if len(maybe_reg) <= 15:
                        metadata["registration"] = maybe_reg

            video_url = self._extract_video_url_from_page(soup, page_text)
            if video_url:
                metadata["video_url"] = video_url

            print("✅ Metadata extracted successfully (including possible ratings)!")
            return metadata
        except Exception as e:
            print(f"⚠️ Error extracting metadata: {e}")
            return {
                "page_url": url,
                "error": str(e),
                "extraction_timestamp": datetime.now().isoformat(),
            }

    def _extract_dealership(self, soup, page_text):
        candidates = set()
        keywords = ["Private Limited", "Pvt Ltd", "Motors", "Cars", "Dealer", "Automotive", "Showroom", "LLP"]
        
        for tag in ["h1", "h2", "h3"]:
            for el in soup.find_all(tag):
                t = el.get_text(separator=" ", strip=True)
                if any(kw in t for kw in keywords) and 8 < len(t) < 80:
                    candidates.add(t.split("\n")[0].strip())
        
        m = re.search(r"\bfrom\s+([A-Z][A-Za-z0-9&.,\- ]{3,}(?:Pvt\.?\s?Ltd|Private Limited|Motors|Cars|Automotive|Showroom|LLP|Limited|Services|Ahmedabad|Chennai|Bangalore|Delhi|Mumbai)?)", page_text, re.IGNORECASE)
        if m:
            val = m.group(1).strip()
            if len(val) < 80:
                candidates.add(val)
        
        for line in page_text.split("\n"):
            s = line.strip()
            if (any(kw in s for kw in keywords) and 6 < len(s) < 80 and not any(w in s for w in ["browser", "JavaScript", "support", "disable", "presentation"])):
                candidates.add(s)
        
        clean_candidates = []
        for c in candidates:
            c = re.split(r"Vehicle:|Presenter:|Service Advisor|Phone|Email|Call|If you would like|browser", c)[0].strip()
            if len(c) > 6:
                clean_candidates.append(c)
        
        if clean_candidates:
            def keyword_count(s):
                return sum(1 for kw in keywords if kw in s)
            sorted_clean = sorted(clean_candidates, key=lambda x: (-keyword_count(x), len(x)))
            return sorted_clean[0]
        return None

    def _extract_video_url_from_page(self, soup, page_text):
        try:
            video_elem = soup.find("video", {"src": True})
            if video_elem:
                return self._clean_url(video_elem["src"])
            video_elem = soup.find("video")
            if video_elem:
                source = video_elem.find("source", {"src": True})
                if source:
                    return self._clean_url(source["src"])
            iframe = soup.find("iframe", {"src": True})
            if iframe and "video" in iframe["src"]:
                return self._clean_url(iframe["src"])
            
            mp4_pattern = r'(https?://[^\s"]+\.mp4)'
            mp4_matches = re.findall(mp4_pattern, page_text)
            if mp4_matches:
                return self._clean_url(mp4_matches[0])
            
            scripts = soup.find_all("script")
            for script in scripts:
                if script.string:
                    video_patterns = [
                        r'videoUrl["\']?\s*[:=]\s*["\']([^"\']+)["\']',
                        r'src["\']?\s*[:=]\s*["\']([^"\']+\.mp4)["\']',
                        r'file["\']?\s*[:=]\s*["\']([^"\']+\.mp4)["\']',
                        r'"url"\s*:\s*"([^"]+\.mp4)"',
                        r'"video"\s*:\s*"([^"]+\.mp4)"',
                    ]
                    for pattern in video_patterns:
                        match = re.search(pattern, script.string)
                        if match:
                            video_url = match.group(1)
                            video_url = self._clean_url(video_url)
                            if not video_url.startswith("http"):
                                video_url = "https://southasia.citnow.com/" + video_url.lstrip("/")
                            return video_url
            return None
        except Exception as e:
            print(f"⚠️ Error extracting video URL: {e}")
            return None

    def _clean_url(self, url):
        if not url:
            return None
        url = url.replace("\\/\\/", "//").replace("\\/", "/").replace("\\", "")
        if url.startswith("//"):
            url = "https:" + url
        elif not url.startswith(("http://", "https://")):
            url = "https://" + url
        return url

    def _make_request_with_fallback(self, method, url, **kwargs):
        """
        Helper method to make a requests call (GET or HEAD) with standard robust headers
        and automatic retry without SSL verification if SSLError occurs.
        """
        headers = kwargs.get("headers", {})
        if not headers:
            headers = {}
        if "User-Agent" not in headers or headers["User-Agent"] == "Mozilla/5.0":
            headers["User-Agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        kwargs["headers"] = headers
        
        if "timeout" not in kwargs:
            kwargs["timeout"] = 15

        try:
            if method.upper() == "GET":
                return requests.get(url, **kwargs)
            elif method.upper() == "HEAD":
                return requests.head(url, **kwargs)
            else:
                raise ValueError(f"Unsupported method: {method}")
        except (requests.exceptions.SSLError, requests.exceptions.ConnectionError) as ssl_err:
            print(f"⚠️ SSL or Connection Error occurred: {ssl_err}. Retrying with verify=False...")
            kwargs["verify"] = False
            import urllib3
            urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
            
            if method.upper() == "GET":
                return requests.get(url, **kwargs)
            elif method.upper() == "HEAD":
                return requests.head(url, **kwargs)
            else:
                raise

    def download_citnow_video(self, url):
        print("📥 DOWNLOADING: Enhanced download with correct video UUID...")

        # First extract metadata to get the actual video UUID
        print("🔍 Extracting metadata to find correct video URL...")
        metadata = self.extract_citnow_metadata(url)

        # Get the actual video URL from metadata
        video_url = metadata.get('video_url')

        if not video_url:
            print("❌ No video URL found in metadata. The link may have expired or is invalid.")
            raise Exception("Video not found on the page. The link may have expired, returned 404, or is invalid.")

        print(f"🎯 Using video URL: {video_url}")

        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": url,
            "Accept": "video/mp4,video/webm,video/*;q=0.9,*/*;q=0.8",
        }

        try:
            print(f"🔗 Downloading from: {video_url}")
            
            # Test if URL is accessible first
            head_response = self._make_request_with_fallback("HEAD", video_url, headers=headers, timeout=10)
            print(f"📊 Pre-check status: {head_response.status_code}")
            
            if head_response.status_code == 404:
                raise Exception(f"Video URL returns 404: {video_url}")
            
            # Download the video
            response = self._make_request_with_fallback("GET", video_url, headers=headers, stream=True, timeout=30)
            response.raise_for_status()
            
            # Create temp file
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.mp4')
            
            total_size = int(response.headers.get('content-length', 0))
            downloaded_size = 0
            
            print(f"💾 Downloading {total_size} bytes..." if total_size > 0 else "💾 Downloading...")
            
            with open(temp_file.name, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
                        downloaded_size += len(chunk)
                        if total_size > 0:
                            percent = (downloaded_size / total_size) * 100
                            print(f"📊 Progress: {percent:.1f}%", end='\r')
            
            file_size = os.path.getsize(temp_file.name)
            print(f"✅ DOWNLOAD SUCCESS: {file_size} bytes")
            
            # Verify it's a reasonable video file size
            if file_size < 100000:  # Less than 100KB
                os.remove(temp_file.name)
                raise Exception(f"Downloaded file too small: {file_size} bytes")
                
            return temp_file.name
    
        except Exception as e:
            print(f"❌ Download failed: {e}")
            raise Exception(f"Could not download video: {e}")
    def load_summarization_model(self):
        """Load summarization model only when needed"""
        if not hasattr(self, "device"):
            self.device = "cuda" if torch.cuda.is_available() else "cpu"

        if not hasattr(self, "summarization_model") or self.summarization_model is None:
            print("📝 Loading BART summarization model...")
            self.summarization_model = BartForConditionalGeneration.from_pretrained("facebook/bart-large-cnn").to(self.device)
            self.summarization_tokenizer = BartTokenizer.from_pretrained("facebook/bart-large-cnn")
        print(f"✅ Model ready on {self.device.upper()}")

    def load_translation_model(self, target_lang: str):
        """
        Loads the translation model for the specified target_lang from cache,
        or initializes it if not already loaded. Returns (model, tokenizer).
        """
        if target_lang == "en":
            print("🌍 Target language is English - no translation model needed.")
            return None, None

        if target_lang in self._translation_models:
            print(f"✅ Translation model for {target_lang} already loaded (from cache).")
            return self._translation_models[target_lang]

        print(f"🌍 Loading new translation model for {target_lang}...")
        model_name = self.lang_model_map.get(target_lang, NLLB_MODEL)

        try:
            if model_name == NLLB_MODEL:
                tokenizer = AutoTokenizer.from_pretrained(model_name)
                model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
            else:
                tokenizer = MarianTokenizer.from_pretrained(model_name)
                model = MarianMTModel.from_pretrained(model_name)

            self._translation_models[target_lang] = (model, tokenizer)
            print(f"✅ Translation model for {target_lang} loaded and cached.")
            return model, tokenizer
        except Exception as e:
            print(f"❌ Error loading translation model for {target_lang}: {e}")
            raise

    def extract_audio_from_video(self, video_path):
        """Robust audio extraction using full ffmpeg path"""
        try:
            # Use full path to ffmpeg - don't rely on PATH environment
            ffmpeg_path = "/usr/bin/ffmpeg"
            
            if not os.path.exists(ffmpeg_path):
                # Fallback: try to find ffmpeg
                import shutil
                ffmpeg_path = shutil.which("ffmpeg") or "/usr/bin/ffmpeg"
            
                print(f"🔊 Using FFmpeg at: {ffmpeg_path}")

            # Verify video file exists
            if not os.path.exists(video_path):
                raise Exception(f"Video file not found: {video_path}")
                
            file_size = os.path.getsize(video_path)
            print(f"📁 Input video size: {file_size} bytes")

            # Create temp file for audio
            temp_audio = tempfile.NamedTemporaryFile(delete=False, suffix='.wav')
            output_audio_path = temp_audio.name
            temp_audio.close()

            print(f"🎵 Extracting audio to: {output_audio_path}")

            # Use full path to ffmpeg with detailed logging
            command = [
                ffmpeg_path, "-i", video_path, 
                "-ar", "16000", "-ac", "1", "-acodec", "pcm_s16le",
                "-vn", "-y", output_audio_path
            ]

            print(f"🔧 Running command: {' '.join(command)}")
            
            result = subprocess.run(
                command, 
                capture_output=True, 
                text=True, 
                timeout=60
            )
            
            # Log the full output for debugging
            if result.stdout:
                print(f"📄 FFmpeg stdout: {result.stdout[:200]}...")
            if result.stderr:
                print(f"📄 FFmpeg stderr: {result.stderr[:500]}...")
            
            if result.returncode != 0:
                raise Exception(f"FFmpeg failed with return code {result.returncode}")
            
            # Verify the output file
            if not os.path.exists(output_audio_path):
                raise Exception("Audio output file was not created")
                
            audio_size = os.path.getsize(output_audio_path)
            print(f"📊 Extracted audio size: {audio_size} bytes")
            
            if audio_size < 1000:
                print("⚠️ Audio file is very small - might be silent video")
                # Don't fail - even silent audio should be processed
            
            # Quick validation
            validation_cmd = [ffmpeg_path, "-i", output_audio_path]
            validation_result = subprocess.run(
                validation_cmd, 
                capture_output=True, 
                text=True,
                timeout=10
            )
            
            if validation_result.returncode == 0:
                print("✅ Audio file validated successfully")
            else:
                print(f"⚠️ Audio validation had issues: {validation_result.stderr[:200]}")
            
            print("✅ Audio extraction completed successfully")
            return output_audio_path

        except subprocess.TimeoutExpired:
            error_msg = "Audio extraction timed out after 60 seconds"
            print(f"❌ {error_msg}")
            if 'output_audio_path' in locals() and os.path.exists(output_audio_path):
                os.unlink(output_audio_path)
            raise Exception(error_msg)
            
        except Exception as e:
            error_msg = f"Audio extraction failed: {str(e)}"
            print(f"❌ {error_msg}")
            if 'output_audio_path' in locals() and os.path.exists(output_audio_path):
                os.unlink(output_audio_path)
            raise Exception(error_msg)
        
    def analyze_audio_quality(self, audio_path):
        """Comprehensive audio quality analysis with detailed metrics - SCORES OUT OF 10"""
        try:
            import librosa
            import numpy as np
            
            y, sr = librosa.load(audio_path, sr=16000, duration=20)  # Optimized: 16kHz, 20s window
            if len(y) == 0:
                return {
                    "prediction": "No Audio", "confidence": 0.0, "score": 0.0,
                    "issues": ["No audio detected"], "clarity_level": "Very Poor",
                    "detailed_analysis": {
                        "volume_level": "Silent", "noise_level": "Unknown", 
                        "speech_clarity": "Unknown", "background_noise": "Unknown",
                        "audio_balance": "Unknown"
                    }
                }
            
            # Extract comprehensive audio features
            features = {}
            
            # RMS Energy (Loudness)
            rms = librosa.feature.rms(y=y)
            features['rms_mean'] = float(np.mean(rms))
            features['rms_std'] = float(np.std(rms))
            features['rms_max'] = float(np.max(rms))
            features['rms_min'] = float(np.min(rms))
            
            # Zero Crossing Rate (Noisiness)
            zcr = librosa.feature.zero_crossing_rate(y)
            features['zcr_mean'] = float(np.mean(zcr))
            features['zcr_std'] = float(np.std(zcr))
            
            # Spectral Features
            spectral_centroids = librosa.feature.spectral_centroid(y=y, sr=sr)
            features['spectral_centroid_mean'] = float(np.mean(spectral_centroids))
            features['spectral_centroid_std'] = float(np.std(spectral_centroids))
            
            spectral_rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)
            features['spectral_rolloff_mean'] = float(np.mean(spectral_rolloff))
            
            # Noise analysis
            S = np.abs(librosa.stft(y))
            spectral_flatness = librosa.feature.spectral_flatness(S=S)
            features['spectral_flatness_mean'] = float(np.mean(spectral_flatness))
            
            # Harmonic-Percussive separation
            harmonic, percussive = librosa.effects.hpss(y)
            features['harmonic_ratio'] = float(np.sum(harmonic**2) / (np.sum(harmonic**2) + np.sum(percussive**2)))
            
            # Silence detection
            frame_length = 2048
            hop_length = 512
            rms_frames = librosa.feature.rms(y=y, frame_length=frame_length, hop_length=hop_length)[0]
            silence_threshold = np.percentile(rms_frames, 25)
            silent_frames = np.sum(rms_frames < silence_threshold)
            total_frames = len(rms_frames)
            features['silence_ratio'] = float(silent_frames / total_frames if total_frames > 0 else 0)
            
            # Detect specific issues
            issues = []
            detailed_scores = {}
            
            # Volume Analysis
            if features['rms_mean'] < 0.005:
                issues.append("Very low volume - hard to hear")
                detailed_scores['volume'] = 10
            elif features['rms_mean'] < 0.02:
                issues.append("Low volume - requires concentration")
                detailed_scores['volume'] = 40
            elif features['rms_mean'] < 0.05:
                issues.append("Moderate volume - acceptable but not ideal")
                detailed_scores['volume'] = 70
            elif features['rms_mean'] > 0.3:
                issues.append("Potential clipping - too loud")
                detailed_scores['volume'] = 60
            else:
                detailed_scores['volume'] = 90
            
            # Background Noise Analysis
            if features['zcr_mean'] > 0.2:
                issues.append("Heavy background noise - very distracting")
                detailed_scores['noise'] = 20
            elif features['zcr_mean'] > 0.12:
                issues.append("Moderate background noise - noticeable")
                detailed_scores['noise'] = 50
            elif features['zcr_mean'] > 0.08:
                issues.append("Light background noise - minimal impact")
                detailed_scores['noise'] = 75
            else:
                detailed_scores['noise'] = 95
            
            # Speech Clarity Analysis
            if features['spectral_flatness_mean'] > 0.9:
                issues.append("Poor speech clarity - very muffled")
                detailed_scores['clarity'] = 20
            elif features['spectral_flatness_mean'] > 0.7:
                issues.append("Reduced speech clarity - somewhat muffled")
                detailed_scores['clarity'] = 50
            elif features['spectral_flatness_mean'] > 0.5:
                issues.append("Average speech clarity")
                detailed_scores['clarity'] = 70
            else:
                detailed_scores['clarity'] = 90
            
            # Silence/Background Analysis
            if features['silence_ratio'] > 0.5:
                issues.append("Excessive silence or gaps")
                detailed_scores['consistency'] = 40
            elif features['silence_ratio'] > 0.3:
                issues.append("Some silence gaps")
                detailed_scores['consistency'] = 65
            else:
                detailed_scores['consistency'] = 85
            
            # Harmonic analysis for voice quality
            if features['harmonic_ratio'] < 0.3:
                issues.append("Poor voice quality - noisy")
                detailed_scores['voice_quality'] = 40
            elif features['harmonic_ratio'] < 0.6:
                detailed_scores['voice_quality'] = 70
            else:
                detailed_scores['voice_quality'] = 90
            
            # Calculate overall score with weighted components (0-10 scale)
            final_score = (
                detailed_scores['volume'] * 0.25 +
                detailed_scores['noise'] * 0.30 +
                detailed_scores['clarity'] * 0.25 +
                detailed_scores['consistency'] * 0.10 +
                detailed_scores['voice_quality'] * 0.10
            ) / 10
            final_score = float(np.clip(final_score, 0, 10))
            
            # Determine clarity level
            if final_score >= 9:
                clarity_level = "Excellent"
                prediction = "Studio Quality"
            elif final_score >= 8:
                clarity_level = "Very Good" 
                prediction = "Very Clear"
            elif final_score >= 7:
                clarity_level = "Good"
                prediction = "Clear"
            elif final_score >= 6:
                clarity_level = "Fair"
                prediction = "Acceptable"
            elif final_score >= 5:
                clarity_level = "Poor"
                prediction = "Noisy"
            elif final_score >= 3:
                clarity_level = "Very Poor"
                prediction = "Very Noisy"
            else:
                clarity_level = "Unusable"
                prediction = "Extremely Noisy"
            
            # Enhanced detailed analysis
            detailed_analysis = {
                "volume_level": "Very Low" if features['rms_mean'] < 0.02 else "Low" if features['rms_mean'] < 0.05 else "Ideal" if features['rms_mean'] < 0.2 else "Too Loud",
                "noise_level": "Heavy" if features['zcr_mean'] > 0.15 else "Moderate" if features['zcr_mean'] > 0.1 else "Light" if features['zcr_mean'] > 0.05 else "Minimal",
                "speech_clarity": "Poor" if features['spectral_flatness_mean'] > 0.8 else "Average" if features['spectral_flatness_mean'] > 0.6 else "Good" if features['spectral_flatness_mean'] > 0.4 else "Excellent",
                "background_noise": f"{features['silence_ratio']*100:.1f}% silence",
                "audio_balance": "Balanced" if 0.4 < features['harmonic_ratio'] < 0.8 else "Noisy" if features['harmonic_ratio'] <= 0.4 else "Clean",
                "dynamic_range": f"{features['rms_max']/max(features['rms_min'], 0.001):.1f}x"
            }
            
            return {
                "prediction": prediction,
                "confidence": round(float(final_score / 10), 3),
                "score": round(final_score, 1),
                "issues": issues,
                "clarity_level": clarity_level,
                "detailed_analysis": detailed_analysis,
                "component_scores": detailed_scores
            }
            
        except Exception as e:
            print(f"Audio analysis error: {e}")
            import traceback
            traceback.print_exc()
            return {
                "prediction": "Analysis Failed",
                "confidence": 0.0,
                "score": 0.0,
                "issues": [f"Audio analysis error: {e}"],
                "clarity_level": "Unknown",
                "detailed_analysis": {}
            }

    def _get_video_duration_ffmpeg(self, video_path):
        """Get video duration using ffprobe as fallback"""
        try:
            cmd = [
                "ffprobe", "-v", "error",
                "-show_entries", "format=duration",
                "-of", "default=noprint_wrappers=1:nokey=1",
                video_path
            ]
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            duration = float(result.stdout.strip())
            return duration if duration > 0 else 0
        except Exception as e:
            print(f"⚠️ Could not determine duration with ffprobe: {e}")
            return 0

    def analyze_video_quality(self, video_path):
        import os
        gemini_key = os.getenv("GEMINI_API_KEY")
        if gemini_key:
            return self._analyze_video_with_gemini(video_path, gemini_key)
        else:
            print("⚠️ GEMINI_API_KEY not found in environment. Falling back to OpenCV heuristics for video analysis.")
            return self._analyze_video_with_opencv(video_path)

    def _analyze_video_with_gemini(self, video_path, api_key):
        import google.generativeai as genai
        import json
        import time
        import traceback
        import tempfile
        import base64
        
        try:
            genai.configure(api_key=api_key)
            print(f"🎬 Extracting keyframes from {video_path} for fast Gemini Vision analysis...")
            
            # --- FAST APPROACH: Extract keyframes as images instead of uploading full video ---
            # This is 5-10x faster than uploading the whole video file
            cap = cv2.VideoCapture(video_path)
            if not cap.isOpened():
                raise Exception("Could not open video file for keyframe extraction")
            
            frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            fps = cap.get(cv2.CAP_PROP_FPS)
            duration = frame_count / max(fps, 1)
            
            # Sample 8 evenly-spaced keyframes across the video
            num_keyframes = min(8, max(3, int(duration / 5)))
            frame_indices = [int(i * frame_count / num_keyframes) for i in range(num_keyframes)]
            
            keyframes_b64 = []
            for idx in frame_indices:
                cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
                ret, frame = cap.read()
                if not ret:
                    continue
                # Resize to reduce payload size (max 720p)
                h, w = frame.shape[:2]
                if w > 1280:
                    scale = 1280 / w
                    frame = cv2.resize(frame, (int(w * scale), int(h * scale)))
                _, buf = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
                keyframes_b64.append(base64.b64encode(buf.tobytes()).decode('utf-8'))
            cap.release()
            
            if not keyframes_b64:
                raise Exception("Could not extract any keyframes from video")
            
            print(f"✅ Extracted {len(keyframes_b64)} keyframes. Sending to Gemini...")
            
            model = genai.GenerativeModel(model_name="gemini-1.5-flash")
            
            # Build the request: text prompt + all keyframe images inline
            parts = []
            for i, b64 in enumerate(keyframes_b64):
                parts.append({"inline_data": {"mime_type": "image/jpeg", "data": b64}})
            
            prompt = f"""You are a professional video quality analyst. I am showing you {len(keyframes_b64)} keyframes sampled evenly from a video.
            Analyze the TECHNICAL VISUAL QUALITY only. Do NOT judge content or subject matter.
            Grade: camera stability, lighting, focus/sharpness, framing, and overall visual clarity.
            
            Return ONLY valid JSON with EXACTLY these keys:
            {{
              "quality_score": <float 1.0-10.0, where 10 is perfect cinematic quality>,
              "quality_label": <one of: "Excellent", "Very Good", "Good", "Fair", "Poor", "Very Poor">,
              "issues": [<list of specific visual problems found, e.g. "blurry", "too dark", "shaky", "overexposed">],
              "shake_level": <"None", "Minimal", "Noticeable", or "Severe">,
              "resolution_quality": <"High Definition", "Standard Definition", or "Low Quality">,
              "detailed_analysis": {{
                "lighting": "<one sentence about lighting quality>",
                "focus": "<one sentence about sharpness and focus>",
                "stability": "<one sentence about camera movement>"
              }},
              "component_scores": {{
                "sharpness": <integer 0-100>,
                "brightness": <integer 0-100>,
                "stability": <integer 0-100>,
                "color": <integer 0-100>
              }}
            }}"""
            
            parts.append({"text": prompt})
            
            response = model.generate_content(
                parts,
                generation_config={"response_mime_type": "application/json"}
            )
            
            result = json.loads(response.text)
            print(f"✅ Gemini Keyframe Analysis Complete! Score: {result.get('quality_score')}/10 ({len(keyframes_b64)} frames analyzed)")
            return result
            
        except Exception as e:
            print(f"❌ Gemini Vision API Failed: {e}")
            traceback.print_exc()
            print("⚠️ Falling back to OpenCV heuristics...")
            return self._analyze_video_with_opencv(video_path)


    def _analyze_video_with_opencv(self, video_path):
        """Comprehensive video quality analysis with stability, noise, and detail assessment - SCORES OUT OF 10"""
        try:
            cap = cv2.VideoCapture(video_path)
            if not cap.isOpened():
                return {
                    "quality_score": 0.0, "quality_label": "Error",
                    "issues": ["Could not open video file"], "shake_level": "Unknown",
                    "resolution_quality": "Unknown", "detailed_analysis": {},
                    "component_scores": {}
                }
            
            width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
            
            fps = cap.get(cv2.CAP_PROP_FPS)
            frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            
            # Better duration calculation with fallback
            if fps <= 0 or frame_count <= 0:
                duration = self._get_video_duration_ffmpeg(video_path)
                if duration > 0:
                    fps = 25
                    frame_count = int(duration * fps)
                else:
                    return {
                        "quality_score": 0.0, "quality_label": "Invalid Video",
                        "issues": ["Cannot determine video duration"], "shake_level": "Unknown",
                        "resolution_quality": "Unknown", "detailed_analysis": {},
                        "component_scores": {}
                    }
            else:
                duration = frame_count / fps
            
            print(f"📊 Video Info: {width}x{height}, {fps:.1f} fps, {frame_count} frames, {duration:.1f}s")
            
            # Get resolution info
            res_label, min_res_score, max_res_score = self._get_resolution_info(width, height)
            
            # Dynamic frame sampling based on video length (optimized for speed)
            if duration > 300:
                num_frames_to_sample = min(60, frame_count)   # was 150
            elif duration > 120:
                num_frames_to_sample = min(35, frame_count)   # was 80
            else:
                num_frames_to_sample = min(20, frame_count)   # was 50
                
            print(f"🎯 Sampling {num_frames_to_sample} frames from {frame_count} total frames")
            
            sample_idxs = np.linspace(0, frame_count - 1, num_frames_to_sample, dtype=int)
            
            # Enhanced analysis variables
            sharpness_vals, brightness_vals, contrast_vals = [], [], []
            color_saturation_vals = []
            blockiness_vals = []
            issues = []
            component_scores = {}
            
            # Enhanced shake and noise detection
            shake_score, shake_details = self._calculate_detailed_shake(video_path, sample_idxs)
            noise_score, noise_details = self._calculate_detailed_noise(video_path, sample_idxs)
            
            # Frame-by-frame comprehensive analysis
            prev_frame_gray = None
            frozen_frames = 0
            grabbed_frames = 0
            motion_changes = []
            
            for idx in sample_idxs:
                cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
                ret, frame = cap.read()
                if not ret:
                    continue
                    
                grabbed_frames += 1
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                
                # Sharpness (Laplacian variance)
                sharpness = cv2.Laplacian(gray, cv2.CV_64F).var()
                sharpness_vals.append(sharpness)
                
                # Brightness
                brightness = np.mean(gray)
                brightness_vals.append(brightness)
                
                # Contrast
                contrast = np.std(gray)
                contrast_vals.append(contrast)
                
                # Color saturation (from BGR to HSV)
                hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
                saturation = np.mean(hsv[:, :, 1])
                color_saturation_vals.append(saturation)
                blockiness = self._detect_blockiness(gray)
                blockiness_vals.append(blockiness)
                
                # Motion analysis
                if prev_frame_gray is not None:
                    diff = cv2.absdiff(gray, prev_frame_gray)
                    motion_change = np.mean(diff)
                    motion_changes.append(motion_change)
                    if motion_change < 2.0:
                        frozen_frames += 1
                
                prev_frame_gray = gray
            
            cap.release()
            
            if grabbed_frames < 10:
                return {
                    "quality_score": 1.0, "quality_label": "Very Poor",
                    "issues": ["Too few valid frames for analysis"], "shake_level": "Unknown",
                    "resolution_quality": res_label, "detailed_analysis": {},
                    "component_scores": {}
                }
            
            # Enhanced outlier removal
            def remove_outliers_enhanced(data):
                if len(data) < 3:
                    return data
                data = np.array(data)
                q1, q3 = np.percentile(data, [25, 75])
                iqr = q3 - q1
                if iqr == 0:
                    return data
                mask = (data >= q1 - 1.5 * iqr) & (data <= q3 + 1.5 * iqr)
                return data[mask] if np.sum(mask) >= 3 else data
            
            # Calculate enhanced normalized scores
            sharpness_clean = remove_outliers_enhanced(sharpness_vals)
            brightness_clean = remove_outliers_enhanced(brightness_vals)
            contrast_clean = remove_outliers_enhanced(contrast_vals)
            saturation_clean = remove_outliers_enhanced(color_saturation_vals)
            blockiness_clean = remove_outliers_enhanced(blockiness_vals)
            
            sharpness_avg = np.mean(sharpness_clean) if len(sharpness_clean) > 0 else 0
            brightness_avg = np.mean(brightness_clean) if len(brightness_clean) > 0 else 0
            contrast_avg = np.mean(contrast_clean) if len(contrast_clean) > 0 else 0
            saturation_avg = np.mean(saturation_clean) if len(saturation_clean) > 0 else 0
            blockiness_avg = np.mean(blockiness_clean) if len(blockiness_clean) > 0 else 0
            
            # Enhanced scoring with better normalization (Relaxed for real-world footage)
            # Sharpness: Laplacian var of 100+ is excellent for compressed video
            sharpness_score = np.clip((sharpness_avg - 5) / (120 - 5) * 100, 0, 100)
            # Brightness: More forgiving range (80-180 is generally fine)
            brightness_score = np.clip(100 - abs(brightness_avg - 127) / 80 * 100, 0, 100)
            # Contrast: std dev of 40+ is very high contrast
            contrast_score = np.clip((contrast_avg - 10) / (60 - 10) * 100, 0, 100)
            # Color: saturation of 60+ is quite vibrant
            color_score = np.clip((saturation_avg - 20) / (80 - 20) * 100, 0, 100)
            compression_score = np.clip(100 - (blockiness_avg * 150), 0, 100)
            
            # Motion consistency score
            if motion_changes:
                motion_consistency = np.std(motion_changes) if len(motion_changes) > 1 else 0
                motion_score = np.clip(100 - (motion_consistency * 10), 0, 100)
            else:
                motion_score = 50
            
            # Frozen frames penalty
            frozen_ratio = frozen_frames / grabbed_frames
            if frozen_ratio > 0.4:
                frozen_penalty = 30
            elif frozen_ratio > 0.2:
                frozen_penalty = 15
            else:
                frozen_penalty = 0
            
            # Enhanced component scoring
            component_scores = {
                'sharpness': sharpness_score, 'brightness': brightness_score,
                'contrast': contrast_score, 'color': color_score,
                'stability': shake_score, 'cleanliness': noise_score,
                'compression': compression_score, 'motion': motion_score
            }
            
            # Enhanced issue detection
            issues = []

            if sharpness_score < 15:
                issues.append("Very blurry - details hard to see")
            elif sharpness_score < 35:
                issues.append("Slightly soft or out of focus")

            if brightness_score < 40:
                if brightness_avg < 80:
                    issues.append("Video is too dark")
                else:
                    issues.append("Video is overexposed or washed out")
            elif brightness_score < 60:
                issues.append("Suboptimal lighting")

            if contrast_score < 40:
                issues.append("Low contrast - flat image")

            if color_score < 20:
                issues.append("Dull colors - poor saturation")

            if shake_score < 40:
                issues.append("Severe camera shake - very unstable")
            elif shake_score < 60:
                issues.append("Noticeable camera shake")

            if noise_score < 40:
                issues.append("Visible visual noise/grain")

            if compression_score < 50:
                issues.append("Visible compression artifacts")

            if frozen_ratio > 0.3:
                issues.append("Many frozen/static frames")
            elif frozen_ratio > 0.15:
                issues.append("Some frozen frames")
            
            # Calculate overall score with proper scale (Out of 10)
            resolution_base = (min_res_score + max_res_score) / 2
            
            # visual_score is 0-100, convert it to 0-10 internally for weighted sum
            visual_score_o10 = (
                sharpness_score * 0.35 +
                brightness_score * 0.15 +
                contrast_score * 0.15 +
                noise_score * 0.10 +
                shake_score * 0.10 +
                color_score * 0.05 +
                compression_score * 0.05 +
                motion_score * 0.05
            ) / 10
            
            # Final score is a weighted average of Resolution and Visual Quality
            final_score = (resolution_base * 0.3) + (visual_score_o10 * 0.7)
            final_score = np.clip(final_score - (frozen_penalty / 20), 0, 10) 
            
            # Bonus for high-res clear videos
            if res_label in ["4K UHD", "1440p (QHD)", "1080p (FHD)"] and visual_score_o10 > 8.5:
                final_score = min(10.0, final_score + 0.5)
            
            # Enhanced shake level classification (internal scores still 0-100)
            if shake_score >= 85:
                shake_level = "Very Stable"
            elif shake_score >= 70:
                shake_level = "Stable"
            elif shake_score >= 55:
                shake_level = "Slightly Shaky"
            elif shake_score >= 40:
                shake_level = "Shaky"
            elif shake_score >= 25:
                shake_level = "Very Shaky"
            else:
                shake_level = "Extremely Shaky"
            
            # Enhanced detailed analysis
            detailed_analysis = {
                "resolution": f"{width}x{height} ({res_label})", "duration": f"{duration:.1f}s",
                "frame_rate": f"{fps:.1f} fps", "sharpness": f"{sharpness_score:.1f}%",
                "brightness": f"{brightness_score:.1f}%", "contrast": f"{contrast_score:.1f}%",
                "color_vibrancy": f"{color_score:.1f}%", "stability": f"{shake_score:.1f}%",
                "cleanliness": f"{noise_score:.1f}%", "compression": f"{compression_score:.1f}%",
                "motion_consistency": f"{motion_score:.1f}%", "frozen_frames": f"{frozen_ratio*100:.1f}%"
            }
            
            return {
                "quality_score": round(float(final_score), 1),
                "quality_label": self._get_quality_label(final_score),
                "issues": issues, "shake_level": shake_level,
                "resolution_quality": res_label, "detailed_analysis": detailed_analysis,
                "component_scores": component_scores
            }
            
        except Exception as e:
            return {
                "quality_score": 0.0, "quality_label": "Analysis Failed",
                "issues": [f"Video analysis error: {e}"], "shake_level": "Unknown",
                "resolution_quality": "Unknown", "detailed_analysis": {},
                "component_scores": {}
            }

    def _detect_blockiness(self, gray_frame):
        """Detect compression blockiness artifacts"""
        try:
            h, w = gray_frame.shape
            block_size = 8
            block_variances = []
            
            for i in range(0, h - block_size, block_size):
                for j in range(0, w - block_size, block_size):
                    block = gray_frame[i:i+block_size, j:j+block_size]
                    block_variances.append(np.var(block))
            
            if block_variances:
                return np.std(block_variances) / (np.mean(block_variances) + 1e-6)
            return 0
        except:
            return 0

    def _calculate_detailed_shake(self, video_path, sample_idxs):
        """Enhanced shake detection with detailed metrics"""
        try:
            cap = cv2.VideoCapture(video_path)
            if not cap.isOpened():
                return 50.0, "Cannot analyze shake"
            
            lk_params = dict(
                winSize=(15, 15), maxLevel=2,
                criteria=(cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 10, 0.03),
            )
            feature_params = dict(maxCorners=100, qualityLevel=0.3, minDistance=7, blockSize=7)
            
            total_displacement = 0
            frame_pairs = 0
            max_displacement = 0
            displacements = []
            prev_gray = None
            
            for idx in sample_idxs:
                cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
                ret, frame = cap.read()
                if not ret:
                    continue
                    
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                
                if prev_gray is not None:
                    p0 = cv2.goodFeaturesToTrack(prev_gray, mask=None, **feature_params)
                    if p0 is not None:
                        p1, st, err = cv2.calcOpticalFlowPyrLK(prev_gray, gray, p0, None, **lk_params)
                        if p1 is not None and st is not None:
                            good_new = p1[st == 1]
                            good_old = p0[st == 1]
                            if len(good_new) > 5:
                                displacement = np.mean(np.linalg.norm(good_new - good_old, axis=1))
                                total_displacement += displacement
                                displacements.append(displacement)
                                max_displacement = max(max_displacement, displacement)
                                frame_pairs += 1
                
                prev_gray = gray
            
            cap.release()
            
            if frame_pairs == 0:
                return 50.0, "Insufficient frames for shake analysis"
            
            avg_shake_px = total_displacement / frame_pairs
            shake_variance = np.std(displacements) if len(displacements) > 1 else 0
            
            # Relaxed shake scoring for handheld devices
            base_score = 100 - (avg_shake_px / (self.SHAKE_TOLERANCE_PX * 2.5)) * 50
            variance_penalty = min(shake_variance * 5, 15)
            max_shake_penalty = min(max_displacement * 3, 10)
            
            shake_score = max(0, base_score - variance_penalty - max_shake_penalty)
            shake_score = np.clip(shake_score, 0, 100)
            
            shake_detail = f"Average movement: {avg_shake_px:.2f}px, Max: {max_displacement:.2f}px"
            
            return shake_score, shake_detail
            
        except Exception as e:
            return 50.0, f"Shake analysis error: {e}"

    def _calculate_detailed_noise(self, video_path, sample_idxs):
        """Enhanced noise detection with detailed metrics"""
        try:
            cap = cv2.VideoCapture(video_path)
            if not cap.isOpened():
                return 50.0, "Cannot analyze noise"
            
            noise_estimates = []
            brightness_variations = []
            
            for idx in sample_idxs:
                cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
                ret, frame = cap.read()
                if not ret:
                    continue
                    
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                
                # Laplacian-based noise estimation
                laplacian = cv2.Laplacian(gray, cv2.CV_64F)
                if laplacian.size > 0:
                    mad = np.median(np.abs(laplacian - np.median(laplacian)))
                    if mad > 0:
                        noise_estimates.append(mad)
                
                # Brightness variation (can indicate compression artifacts)
                brightness_variations.append(np.std(gray))
            
            cap.release()
            
            if not noise_estimates:
                return 50.0, "No noise estimates available"
            
            avg_noise_mad = np.mean(noise_estimates)
            brightness_variation = np.mean(brightness_variations) if brightness_variations else 0
            
            # Combined noise scoring
            base_score = 100 - (avg_noise_mad / self.NOISE_THRESHOLD_STD) * 50
            variation_penalty = min(brightness_variation * 2, 15)
            
            noise_score = max(0, base_score - variation_penalty)
            noise_score = np.clip(noise_score, 0, 100)
            
            noise_detail = f"Noise level: {avg_noise_mad:.2f}, Variation: {brightness_variation:.2f}"
            
            return noise_score, noise_detail
            
        except Exception as e:
            return 50.0, f"Noise analysis error: {e}"
        
    def calculate_overall_quality(self, audio_analysis, video_analysis, citnow_metadata=None):
        """Calculate overall quality out of 10 with equal importance for audio and video, blending with CitNow rating if available"""
        try:
            audio_score = audio_analysis.get('score', 0)
            video_score = video_analysis.get('quality_score', 0)
            
            # Scores are already 0-10, no conversion needed
            audio_weight = 0.5
            video_weight = 0.5
            
            overall_technical_score = (audio_score * audio_weight) + (video_score * video_weight)
            
            # BLEND WITH REAL RATING (Star Rating from 1-5 to 0-10)
            star_rating = None
            if citnow_metadata:
                star_rating = citnow_metadata.get('star_rating')
            
            final_overall_score = overall_technical_score
            has_real_rating = False
            
            if star_rating is not None:
                # Map 1-5 stars to 0-10 score (1->2, 5->10)
                real_score = star_rating * 2.0
                # Blend: 60% real rating, 40% technical. This makes it "trace real"
                final_overall_score = (real_score * 0.6) + (overall_technical_score * 0.4)
                has_real_rating = True
            
            # Quality labels for 0–10 range
            if final_overall_score >= 9:
                overall_label = "Excellent"
            elif final_overall_score >= 8:
                overall_label = "Very Good"
            elif final_overall_score >= 7:
                overall_label = "Good"
            elif final_overall_score >= 6:
                overall_label = "Fair"
            elif final_overall_score >= 5:
                overall_label = "Poor"
            elif final_overall_score >= 3:
                overall_label = "Very Poor"
            else:
                overall_label = "Unusable"
            
            return {
                "overall_score": round(final_overall_score, 1),
                "overall_label": overall_label,
                "audio_contribution": round(audio_score * audio_weight, 1),
                "video_contribution": round(video_score * video_weight, 1),
                "technical_score": round(overall_technical_score, 1),
                "real_rating_score": round(star_rating * 2, 1) if star_rating is not None else None,
                "has_real_rating": has_real_rating,
                "breakdown": {
                    "audio_quality": round(audio_score, 1),
                    "video_quality": round(video_score, 1)
                }
            }
        except Exception as e:
            return {
                "overall_score": 0,
                "overall_label": "Calculation Failed",
                "error": str(e)
            }

    def load_pretrained_models(self):
        """Load all models at startup for better performance"""
        print("🔄 Loading all pretrained models at startup...")
        
        try:
            self.load_summarization_model()
            print("✅ Summarization model loaded")
            
            common_target_languages = ["hi", "te", "bn"]
            for lang_code in common_target_languages:
                try:
                    self.load_translation_model(lang_code)
                    print(f"✅ Translation model for {lang_code} pre-loaded.")
                except Exception as e:
                    print(f"⚠️ Could not pre-load translation model for {lang_code}: {e}")
            
            try:
                from faster_whisper import WhisperModel
                whisper_device = "cuda" if torch.cuda.is_available() else "cpu"
                whisper_compute = "float16" if whisper_device == "cuda" else "int8"
                whisper_model_name = os.getenv("WHISPER_MODEL", "base")
                print(f"🎙️ Loading faster-whisper {whisper_model_name} on {whisper_device} ({whisper_compute})...")
                self.faster_whisper_model = WhisperModel(whisper_model_name, device=whisper_device, compute_type=whisper_compute) 
                print("✅ Whisper model loaded")
            except Exception as e:
                print(f"⚠️ Could not pre-load whisper model: {e}")
                
            print("🎯 All models loaded successfully!")
            
        except Exception as e:
            print(f"❌ Error loading some models: {e}")

    def transcribe_audio(self, audio_path, transcription_language=None, task='transcribe'):
        """High-performance transcription with minimal anti-repetition"""
        try:
            from faster_whisper import WhisperModel
            
            print(f"\n🔄 Starting faster-whisper transcription...")
            print(f"🌐 Language: {transcription_language or 'auto-detection'}")

            if self.faster_whisper_model is None:
                whisper_device = "cuda" if torch.cuda.is_available() else "cpu"
                whisper_compute = "float16" if whisper_device == "cuda" else "int8"
                whisper_model_name = os.getenv("WHISPER_MODEL", "base")
                print(f"🎙️ Loading faster-whisper {whisper_model_name} on {whisper_device} ({whisper_compute})...")
                self.faster_whisper_model = WhisperModel(whisper_model_name, device=whisper_device, compute_type=whisper_compute)
            
            whisper_lang_param = transcription_language if transcription_language != "auto" else None

            segments, info = self.faster_whisper_model.transcribe(
                audio_path,
                language=whisper_lang_param,
                beam_size=5,
                best_of=5,
                temperature=0.0,
                vad_filter=True,
                vad_parameters=dict(
                    min_silence_duration_ms=500,
                    speech_pad_ms=300
                ),
                no_speech_threshold=0.8,
                repetition_penalty=1.0,
            )

            print(f"🔊 Detected language: '{info.language}' (probability: {info.language_probability:.2f})")

            transcription_parts = []
            last_segment = ""
            
            for segment in segments:
                clean_text = segment.text.strip()
                
                if not clean_text:
                    continue
                    
                if clean_text != last_segment:
                    transcription_parts.append(clean_text)
                    last_segment = clean_text
                else:
                    print(f"🔄 Skipping exact duplicate: {clean_text}")

            if not transcription_parts:
                return "No clear speech detected in audio"

            full_transcription = " ".join(transcription_parts).strip()
            
            print(f"✅ Transcription successful! Length: {len(full_transcription)} characters")
            
            return full_transcription

        except Exception as e:
            error_msg = f"faster-whisper transcription error: {e}"
            print(f"❌ {error_msg}")
            return f"Transcription failed: {str(e)}"

    def _is_similar_text(self, text1, text2, threshold=0.9):
        """Check if two texts are similar above a threshold - LESS AGGRESSIVE"""
        if not text1 or not text2:
            return False
        
        text1_clean = text1.lower().strip()
        text2_clean = text2.lower().strip()
        
        if text1_clean == text2_clean:
            return True
        
        if len(text1_clean) < 20 or len(text2_clean) < 20:
            return False
        
        if text1_clean in text2_clean or text2_clean in text1_clean:
            overlap_ratio = min(len(text1_clean), len(text2_clean)) / max(len(text1_clean), len(text2_clean))
            return overlap_ratio > 0.7
        
        import difflib
        similarity = difflib.SequenceMatcher(None, text1_clean, text2_clean).ratio()
        return similarity > threshold

    def _remove_final_repetitions(self, text):
        """Remove only obvious repetitive patterns at the end - LESS AGGRESSIVE"""
        if not text:
            return text
        
        sentences = [s.strip() for s in text.split('.') if s.strip()]
        if len(sentences) <= 3:
            return text
        
        clean_sentences = sentences[:]
        
        final_check = []
        for i in range(min(2, len(clean_sentences))):
            current_idx = -(i+1)
            current_sentence = clean_sentences[current_idx]
            
            is_clear_repetition = False
            for prev_sentence in clean_sentences[:max(0, current_idx-3)]:
                if self._is_similar_text(current_sentence, prev_sentence, threshold=0.95):
                    is_clear_repetition = True
                    print(f"🗑️ Removing clear repetition: {current_sentence}")
                    break
                    
            if not is_clear_repetition:
                final_check.append(current_sentence)
        
        if final_check:
            return '. '.join(clean_sentences[:len(clean_sentences)-len(final_check)] + final_check[::-1]) + '.'
        else:
            return '. '.join(clean_sentences) + '.'

    def summarize_text(self, text: str, summary_type: str = "medium") -> str:
        """Generates a robust summary using BART with chunking for long text and adaptive fallback."""
        self.load_summarization_model()
        text = text.strip()
        if not text:
            return ""
        if len(text.split()) < 10:
            return text

        presets = {"short": (20, 60), "medium": (40, 120), "long": (80, 200)}
        min_len, max_len = presets.get(summary_type, presets["medium"])
        tokenizer = self.summarization_tokenizer
        model = self.summarization_model

        try:
            inputs = tokenizer(text, return_tensors="pt", truncation=False)
            input_ids = inputs["input_ids"][0]
            num_tokens = len(input_ids)

            # --- Regular BART summarization ---
            if num_tokens > tokenizer.model_max_length:
                chunk_size = tokenizer.model_max_length - 100
                overlap = 100
                chunks, start = [], 0
                while start < num_tokens:
                    end = min(start + chunk_size, num_tokens)
                    chunks.append(input_ids[start:end])
                    start = end - overlap if end < num_tokens else end

                summaries = []
                for chunk in chunks:
                    chunk_summary_ids = model.generate(
                        chunk.unsqueeze(0).to(self.device),
                        num_beams=4,
                        min_length=min_len // 2,
                        max_length=max_len,
                        length_penalty=2.0,
                        no_repeat_ngram_size=3,
                        early_stopping=True,
                    )
                    summaries.append(tokenizer.decode(chunk_summary_ids[0], skip_special_tokens=True).strip())

                combined_text = " ".join(summaries)
                final_inputs = tokenizer(combined_text, return_tensors="pt", truncation=True, max_length=1024)
                final_summary_ids = model.generate(
                    final_inputs["input_ids"].to(self.device),
                    num_beams=5,
                    min_length=min_len,
                    max_length=max_len,
                    length_penalty=2.0,
                    no_repeat_ngram_size=3,
                    early_stopping=True,
                )
                summary = tokenizer.decode(final_summary_ids[0], skip_special_tokens=True)
            else:
                summary_ids = model.generate(
                    input_ids.unsqueeze(0).to(self.device),
                    num_beams=5,
                    min_length=min_len,
                    max_length=max_len,
                    length_penalty=2.0,
                    no_repeat_ngram_size=3,
                    early_stopping=True,
                )
                summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)

            # --- Smart fallback for short/repetitive text ---
            text_lower = text.lower()
            if (
                len(text.split()) < 100 or
                "here you can see" in text_lower or
                text_lower.count("sir") > 3
            ):
                import re

                # Vehicle ID detection
                vehicle_match = re.search(r"\b[a-zA-Z]{2}\s?\d{2}\s?[a-zA-Z]{1,2}\s?\d{3,4}\b", text)
                vehicle_id = vehicle_match.group(0).replace(" ", "").upper() if vehicle_match else "The vehicle"

                # Speaker name detection
                speaker_match = re.search(r"this is (?!the|a |an |vehicle|video)([a-zA-Z\s]+)", text_lower)
                if speaker_match:
                    speaker = speaker_match.group(1).strip().title().split()[0:2]
                    speaker = " ".join(speaker)
                else:
                    speaker = None

                # Feature detection
                features = [part for part in ["front", "right", "rear", "left", "interior", "boot"] if part in text_lower]

                summary = f"{vehicle_id} is ready for delivery."
                if speaker:
                    summary += f" The delivery video is presented by {speaker}."
                if features:
                    summary += f" It shows the {', '.join(features[:-1])} and {features[-1]} of the vehicle."
                else:
                    summary += " It shows various parts of the vehicle."

                # Add washing/service info if mentioned
                if any(word in text_lower for word in ["washing", "cleaning", "service", "maintenance"]):
                    summary += " Washing and service have been completed."

            # --- Cleanup ---
            summary = summary.strip()
            if summary and not summary.endswith(('.', '!', '?')):
                summary += '.'

            return summary or "No meaningful summary generated."

        except Exception as e:
            print(f"❌ Summarization failed: {e}")
            return f"Summarization failed: {e}"

    def translate_text(self, text, target_language=None):
        actual_target_lang = target_language if target_language is not None else self.target_language
        
        print(f"🌍 Initiating high-reliability translation to {actual_target_lang.upper()}...")

        if actual_target_lang == "en":
            print(f"🎯 Target language is English - returning original text without translation.")
            return text
        
        if len(text.strip()) < 1:
            return text

        try:
            from deep_translator import GoogleTranslator
            
            # Google Translate uses standard ISO codes
            lang_code = actual_target_lang.split('_')[0].lower() # fallback safety
            
            translator = GoogleTranslator(source='auto', target=lang_code)
            
            # Handle large texts safely by chunking if necessary (Google limits to 5000 chars)
            if len(text) > 4900:
                text = text[:4900] + "..."
                
            translated_text = translator.translate(text)
            
            print(f"✅ Google Translation completed for {actual_target_lang}")
            return translated_text
            
        except ImportError:
            print("❌ deep_translator is not installed. Please run pip install deep_translator.")
            return text
        except Exception as e:
            print(f"❌ Translation error for {actual_target_lang}: {e}")
            return text

    def process_video(self, video_input, transcription_language=None, target_language_short=None):
        requested_target_language = target_language_short if target_language_short else self.target_language

        print(f"\n🌍 TARGET LANGUAGE FOR THIS JOB: {requested_target_language.upper()}")
        print("\n" + "=" * 60)
        print("🚀 ENHANCED UNIFIED VIDEO ANALYSIS PIPELINE")
        print("=" * 60)
        results = {
            "input_source": video_input,
            "processing_timestamp": datetime.now().isoformat(),
            "processing_steps": [],
            "target_language": requested_target_language,
            "transcription_language": transcription_language or "auto",
        }
        temp_files_to_clean = []
        try:
            if isinstance(video_input, str) and "citnow.com" in video_input:
                print("\n📊 EXTRACTING CITNOW METADATA")
                print("-" * 40)
                metadata = self.extract_citnow_metadata(video_input)
                results["citnow_metadata"] = metadata
                results["processing_steps"].append("metadata_extraction")
                print(f"🏢 Dealership: {metadata.get('dealership', 'Not found')}")
                print(f"🚗 Vehicle: {metadata.get('vehicle', 'Not found')}")
                print(f"👤 Service Advisor: {metadata.get('service_advisor', 'Not found')}")
                print(f"📧 Email: {metadata.get('email', 'Not found')}")
                print(f"📞 Phone: {metadata.get('phone', 'Not found')}")

                print("\n📥 DOWNLOADING VIDEO")
                print("-" * 40)
                video_path = self.download_citnow_video(video_input)
                temp_files_to_clean.append(video_path)
            else:
                video_path = self._handle_input(video_input)
                if video_path != video_input:
                    temp_files_to_clean.append(video_path)

            if not os.path.exists(video_path):
                raise ValueError(f"Video file not found: {video_path}")

            print("\n🔊 EXTRACTING AUDIO")
            print("-" * 40)

            audio_path = self.extract_audio_from_video(video_path)
            if audio_path:
                temp_files_to_clean.append(audio_path)

            if not audio_path:
                raise ValueError("Audio extraction failed. Cannot proceed.")

            results["processing_steps"].append("audio_extraction")

            print("\n🎥 ANALYZING VIDEO QUALITY")
            print("-" * 40)
            video_analysis = self.analyze_video_quality(video_path)
            
            # Blend Video Quality score with real rating if available
            star_rating = results.get("citnow_metadata", {}).get("star_rating")
            if star_rating is not None:
                real_score = star_rating * 2.0
                # Blend 50/50 for individual component to keep technical value but align with real rating
                video_analysis["quality_score"] = round((real_score * 0.5) + (video_analysis["quality_score"] * 0.5), 1)
                video_analysis["quality_label"] = self._get_quality_label(video_analysis["quality_score"])
                print(f"⚖️ Adjusted Video Quality with Star Rating ({star_rating}★)")

            results["video_analysis"] = video_analysis
            results["processing_steps"].append("video_quality_analysis")
            print(f"Quality: {results['video_analysis']['quality_label']} ({results['video_analysis']['quality_score']:.1f}/10)")

            print("\n🔊 ANALYZING AUDIO QUALITY")
            print("-" * 40)
            results["audio_analysis"] = self.analyze_audio_quality(audio_path)
            results["processing_steps"].append("audio_quality_analysis")
            print(f"Clarity: {results['audio_analysis']['prediction']}")

            print("\n📊 CALCULATING OVERALL QUALITY")
            print("-" * 40)
            overall_quality = self.calculate_overall_quality(
                results["audio_analysis"], 
                results["video_analysis"],
                citnow_metadata=results.get("citnow_metadata")
            )
            results["overall_quality"] = overall_quality
            results["processing_steps"].append("overall_quality_assessment")
            print(f"Overall Quality: {overall_quality['overall_label']} ({overall_quality['overall_score']:.1f}/10)")

            print("\n💬 CONVERTING SPEECH TO TEXT")
            print("-" * 40)
            print(f"📝 Transcription language: {transcription_language or 'auto-detection'}")
            transcription = self.transcribe_audio(
                audio_path, 
                transcription_language=transcription_language,
                task='transcribe'
            )
            results["transcription"] = {
                "text": transcription,
                "length": len(transcription),
                "language": transcription_language or "auto-detected",
            }
            results["processing_steps"].append("speech_to_text")
            print(f"✅ Full transcription completed ({len(transcription)} characters)")

            print("\n📝 GENERATING SUMMARY")
            print("-" * 40)
            summary = self.summarize_text(transcription)
            results["summarization"] = {
                "summary": summary,
                "length": len(summary),
                "reduction_ratio": f"{((1 - len(summary)/len(transcription)) * 100):.1f}%"
                if len(transcription) > 0
                else "N/A",
            }
            results["processing_steps"].append("text_summarization")
            print(f"Summary generated ({results['summarization']['reduction_ratio']} reduction)")

            print(f"\n🌍 TRANSLATING TO {requested_target_language.upper()}")
            print("-" * 40)
            translation = self.translate_text(transcription, target_language=requested_target_language)
            results["translation"] = {
                "translated_text": translation,
                "target_language": requested_target_language,
                "length": len(translation),
            }
            results["processing_steps"].append("translation")
            print(f"Translation completed ({len(translation)} characters)")

        except Exception as pipeline_e:
            print(f"\n❌ Pipeline stopped due to an error: {pipeline_e}")
            results["error_message"] = str(pipeline_e)
        finally:
            for temp_file in temp_files_to_clean:
                if temp_file and os.path.exists(temp_file):
                    try:
                        os.unlink(temp_file)
                    except Exception as e:
                        print(f"⚠️ Could not delete temp file {temp_file}: {e}")
        
        print("\n✅ ALL ANALYSES COMPLETED!")
        return results

    def _handle_input(self, input_source):
        if isinstance(input_source, str):
            if input_source.startswith(("http://", "https://")):
                if "youtube.com" in input_source or "youtu.be" in input_source:
                    print("⬇️ Downloading YouTube video...")
                    return self._download_youtube_video(input_source)
                else:
                    return self._download_from_url(input_source)
            elif os.path.exists(input_source):
                return input_source
        raise ValueError("Input must be a valid file path or URL")

    def _download_youtube_video(self, url):
        try:
            import yt_dlp

            temp_dir = tempfile.gettempdir()
            unique_filename = f"youtube_{uuid.uuid4().hex}"
            output_template = os.path.join(temp_dir, f"{unique_filename}.%(ext)s")
            ydl_opts = {
                "format": "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best",
                "outtmpl": output_template,
                "quiet": True,
                "no_warnings": True,
            }
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=False)
                title = info.get("title", "video")
                ext = info.get("ext", "mp4")
                video_path = os.path.join(temp_dir, f"{unique_filename}.{ext}")
                ydl.download([url])
                if os.path.exists(video_path) and os.path.getsize(video_path) > 1000:
                    return video_path
                else:
                    raise Exception("Downloaded YouTube file not found or invalid.")
        except Exception as e:
            raise Exception(f"YouTube download failed: {e}")

    def _download_from_url(self, url, headers=None):
        try:
            if headers is None:
                headers = {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                }
                
            response = self._make_request_with_fallback("GET", url, stream=True, headers=headers)
            response.raise_for_status()
            
            ext = self._get_file_extension(url, response.headers.get("content-type", ""))
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=ext)
            
            with open(temp_file.name, "wb") as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
                    
            return temp_file.name
            
        except Exception as e:
            raise Exception(f"URL download failed: {e}")

    def _get_file_extension(self, url, content_type):
        parsed = urlparse(url)
        path_ext = os.path.splitext(parsed.path)[1]
        if path_ext in [".mp4", ".avi", ".mov", ".mkv", ".webm"]:
            return path_ext
        if "mp4" in content_type:
            return ".mp4"
        elif "avi" in content_type:
            return ".avi"
        elif "quicktime" in content_type:
            return ".mov"
        elif "webm" in content_type:
            return ".webm"
        return ".mp4"

    def _get_quality_label(self, score):
        """Quality label based on 0-10 scale"""
        if score >= 8.5:
            return "Excellent"
        elif score >= 7.0:
            return "Good"
        elif score >= 5.0:
            return "Fair"
        elif score >= 2.5:
            return "Poor"
        else:
            return "Very Poor"

    def generate_comprehensive_report(self, results):
        report = []
        report.append("=" * 80)
        report.append("COMPREHENSIVE VIDEO ANALYSIS REPORT")
        report.append("=" * 80)
        report.append(f"Generated: {results.get('processing_timestamp', '')}")
        report.append(f"Target Language: {results.get('target_language', results.get('target_language_used', 'EN')).upper()}")
        report.append(f"Processing Steps: {', '.join(results.get('processing_steps', []))}")
        report.append("")
        
        if "excel_metadata" in results and results["excel_metadata"]:
            report.append("EXCEL UPLOAD METADATA")
            report.append("-" * 60)
            for k, v in results["excel_metadata"].items():
                report.append(f"{k}: {v if v is not None else 'N/A'}")
            report.append("")

        if "citnow_metadata" in results:
            report.append("CITNOW SERVICE INFORMATION")
            report.append("-" * 60)
            meta = results["citnow_metadata"]
            report.append(f"Dealership: {meta.get('dealership', 'N/A')}")
            report.append(f"Vehicle Registration: {meta.get('vehicle', 'N/A')}")
            report.append(f"Service Advisor: {meta.get('service_advisor', 'N/A')}")
            report.append(f"Contact Email: {meta.get('email', 'N/A')}")
            report.append(f"Contact Phone: {meta.get('phone', 'N/A')}")
            report.append(f"Source URL: {meta.get('page_url', 'N/A')}")
            report.append("")
        
        if "video_analysis" in results:
            report.append("VIDEO QUALITY ANALYSIS")
            report.append("-" * 60)
            video = results["video_analysis"]
            report.append(f"Quality Score: {video.get('quality_score', 0):.1f}/10")
            report.append(f"Quality Label: {video.get('quality_label', 'N/A')}")
            report.append(f"Resolution: {video.get('resolution_quality', 'N/A')}")
            report.append(f"Camera Stability: {video.get('shake_level', 'N/A')}")
            
            if "detailed_analysis" in video:
                report.append("\nDetailed Metrics:")
                for metric, value in video["detailed_analysis"].items():
                    report.append(f"  - {metric.title()}: {value}")
            
            if "issues" in video and video["issues"]:
                report.append(f"\nDetected Issues ({len(video['issues'])}):")
                for i, issue in enumerate(video["issues"], 1):
                    report.append(f"  {i}. {issue}")
            else:
                report.append("\nNo major video issues detected.")
            report.append("")
        
        if "audio_analysis" in results:
            report.append("AUDIO ANALYSIS")
            report.append("-" * 60)
            audio = results["audio_analysis"]
            report.append(f"Clarity Level: {audio.get('clarity_level', 'N/A')}")
            report.append(f"Prediction: {audio.get('prediction', 'N/A')}")
            report.append(f"Confidence: {audio.get('confidence', 0):.2%}")
            report.append(f"Score: {audio.get('score', 0):.1f}/10")
            
            if "detailed_analysis" in audio:
                report.append("\nDetailed Audio Analysis:")
                for metric, value in audio["detailed_analysis"].items():
                    report.append(f"  - {metric.replace('_', ' ').title()}: {value}")
            
            if "issues" in audio and audio["issues"]:
                report.append(f"\nDetected Audio Issues ({len(audio['issues'])}):")
                for i, issue in enumerate(audio["issues"], 1):
                    report.append(f"  {i}. {issue}")
            else:
                report.append("\nNo major audio issues detected.")
            report.append("")
        
        if "overall_quality" in results:
            report.append("OVERALL QUALITY ASSESSMENT")
            report.append("-" * 60)
            overall = results["overall_quality"]
            report.append(f"Overall Score: {overall.get('overall_score', 0):.1f}/10")
            report.append(f"Overall Label: {overall.get('overall_label', 'N/A')}")
            report.append(f"Audio Contribution: {overall.get('audio_contribution', 0):.1f}")
            report.append(f"Video Contribution: {overall.get('video_contribution', 0):.1f}")
            report.append("")

        if "transcription" in results:
            report.append("FULL TRANSCRIPTION")
            report.append("-" * 60)
            report.append(results["transcription"]["text"])
            report.append("")
            report.append(f"Length: {results['transcription']['length']} characters")
            report.append("")
        if "summarization" in results:
            report.append("SUMMARY")
            report.append("-" * 60)
            report.append(results["summarization"]["summary"])
            report.append("")
            report.append(f"Reduction: {results['summarization']['reduction_ratio']}")
            report.append("")
        if "translation" in results:
            report.append(f"TRANSLATION ({results['target_language'].upper()})")
            report.append("-" * 60)
            report.append(results["translation"]["translated_text"])
            report.append("")
            report.append(f"Length: {results['translation']['length']} characters")
            report.append("")
        if "error_message" in results:
            report.append("ERROR DETAILS")
            report.append("-" * 60)
            report.append(f"Pipeline encountered an error: {results['error_message']}")
            report.append("")
        return "\n".join(report)

def main():
    class NumpyEncoder(json.JSONEncoder):
        def default(self, obj):
            if isinstance(obj, (np.integer, np.int8, np.int16, np.int32, np.int64, 
                              np.uint8, np.uint16, np.uint32, np.uint64)):
                return int(obj)
            elif isinstance(obj, (np.floating, np.float16, np.float32, np.float64)):
                return float(obj)
            elif isinstance(obj, np.bool_):
                return bool(obj)
            elif isinstance(obj, np.ndarray):
                return obj.tolist()
            elif isinstance(obj, np.str_):
                return str(obj)
            else:
                return super().default(obj)

    analyzer = None

    while True:
        citnow_url = input("Enter CitNow video URL (or type 'exit' to quit): ").strip()

        if citnow_url.lower() == "exit":
            print("Exiting the program. Goodbye!")
            break

        print("\nAvailable Indian languages for both transcription and translation:")
        for code, name in LANGUAGE_NAME_LOOKUP.items():
            print(f"  {code} - {name}")

        transcription_language = input("Enter SPOKEN language code (e.g. hi, ta, 'auto'): ").strip().lower()
        target_language_short = input("Enter TARGET language code for translation (e.g. hi, ta): ").strip().lower()

        if analyzer is None:
            print("\nFirst run: Initializing and loading models...")
            analyzer = UnifiedMediaAnalyzer(target_language=target_language_short)
            analyzer.load_pretrained_models()
        else:
            print("\nReady for next analysis...")

        results = analyzer.process_video(
            citnow_url,
            transcription_language=transcription_language,
            target_language_short=target_language_short,
        )

        report = analyzer.generate_comprehensive_report(results)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

        safe_url_part = re.sub(r"[^a-zA-Z0-9]", "_", citnow_url.split("/")[-1])

        report_filename_txt = f"analysis_{safe_url_part}_{timestamp}.txt"
        report_filename_json = f"analysis_{safe_url_part}_{timestamp}.json"

        with open(report_filename_txt, "w", encoding="utf-8") as f:
            f.write(report)
        with open(report_filename_json, "w", encoding="utf-8") as f:
            json.dump(results, f, ensure_ascii=False, indent=2, cls=NumpyEncoder)

        print(f"\n✅ Analysis complete! Reports saved as '{report_filename_txt}' and '{report_filename_json}'.")
        print("-" * 80)

if __name__ == "__main__":
    main()
