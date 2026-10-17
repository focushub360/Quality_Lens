# QualityLens — Technical Architecture & Video Analysis Pipeline Documentation

## 1. Executive Summary

**QualityLens** is an enterprise-grade AI-powered Video & Audio Quality Inspection and Analytics platform designed for automotive dealerships and service networks (specifically integrated with CitNOW video communication workflows).

The platform autonomously ingests vehicle inspection walkaround videos, evaluates them across multi-dimensional computer vision, acoustic signal processing, and natural language criteria, detects technical deficiencies and presentation defects, and provides real-time actionable intelligence, advisor scorecards, and dealer-level benchmark tracking.

---

## 2. High-Level System Architecture

```mermaid
graph TD
    A["CitNOW Video Links / Excel Upload"] --> B["FastAPI Backend Ingestion Gateway"]
    B --> C["Metadata Scraper & Video Downloader"]
    C --> D["Video Quality Engine (OpenCV + FFmpeg + Gemini)"]
    C --> E["Audio Processing Engine (Librosa + PyDub)"]
    E --> F["ASR & Multilingual Translation (Whisper + NLLB-200)"]
    F --> G["Summarization Engine (BART-large-CNN)"]
    D --> H["Quality Scoring & Defect Classifier"]
    E --> H
    H --> I["MongoDB Atlas (Primary / Secondary Replication)"]
    I --> J["FastAPI REST API"]
    J --> K["React 18 Analytics Dashboard"]
```

### Core Technology Stack

| Layer | Technologies | Purpose |
| :--- | :--- | :--- |
| **Backend API** | Python 3.10, FastAPI, Uvicorn, Pydantic | High-performance asynchronous REST endpoints, auth, and task queuing |
| **Computer Vision** | OpenCV 4.x, FFmpeg, NumPy | Frame extraction, Laplacian sharpness, optical flow camera shake, blockiness |
| **Multimodal Vision** | Google Gemini Vision API | High-level scene understanding, automotive component inspection, defect flags |
| **Acoustic Processing** | Librosa, PyDub, SciPy, SoundFile | Spectral SNR estimation, RMS volume, harmonic noise ratio (HNR), speech clarity |
| **Speech-to-Text** | OpenAI Whisper | Automatic Speech Recognition (ASR) for technician commentary |
| **Machine Translation**| Meta NLLB-200, MarianMT | Neural translation for 14+ Indian regional languages to English |
| **Summarization** | Facebook BART-large-CNN | Executive inspection summary generation |
| **Database** | MongoDB Atlas (M10/M20 Replica Clusters) | Document storage, analytical aggregations, full metadata tracking |
| **Frontend** | React 18, Material UI 5, Recharts | Interactive dashboards, bulk uploads, advisor scorecards, results filtering |
| **Storage & Infra** | AWS S3, AWS EC2 Ubuntu, NGINX SSL | Secure media persistence, SSL termination, systemd daemon management |

---

## 3. Video Analysis Pipeline: How It Works

```mermaid
sequenceDiagram
    participant S as CitNOW Server
    participant I as Ingestion Engine
    participant V as Video Processor
    participant A as Audio Processor
    participant N as NLP / AI Models
    participant DB as MongoDB

    I->>S: Fetch CitNOW Webpage & Parse DOM
    I->>S: Download MP4 Stream (Chunked buffer)
    par Video Track
        V->>V: Frame Extraction & Temporal Sampling
        V->>V: Compute Sharpness, Shake, Exposure & Blockiness
        V->>V: Detect Frozen Frames & Glare
    and Audio Track
        A->>A: FFmpeg 16kHz Mono WAV Extraction
        A->>A: Compute Volume, Noise Level & SNR
        A->>A: Compute Speech Clarity & Dynamic Range
    end
    A->>N: Feed Audio to Whisper ASR
    N->>N: Transcribe Speech & Detect Language
    N->>N: NLLB-200 Neural Translation to English
    N->>N: BART Model Generates Inspection Summary
    V->>DB: Compile Video Quality Metrics
    A->>DB: Compile Audio Quality Metrics
    N->>DB: Store Transcripts, Translations & Issues
    DB->>DB: Calculate Final Weighted Overall Score
```

---

## 4. Video Quality Metrics & Mathematical Algorithms

The video engine (`backend/Dude.py`) samples frames adaptively across the video's timeline based on duration, extracting up to 30–60 representative keyframes while filtering out transitions.

### 4.1 Sharpness & Image Focus
Evaluated using the variance of the 2D Laplacian operator applied to the grayscale frame $I(x, y)$:

$$\nabla^2 I = \frac{\partial^2 I}{\partial x^2} + \frac{\partial^2 I}{\partial y^2}$$

$$\text{Sharpness Score} = \text{Var}(\nabla^2 I) = \frac{1}{N} \sum_{x, y} \left( \nabla^2 I(x, y) - \mu_{\nabla^2 I} \right)^2$$

- **High Variance ($> 300$)**: Crisp, in-focus video with well-defined edges.
- **Low Variance ($< 100$)**: Blurry, out-of-focus frame.
- **Issue Flag Triggered**: `"Slightly soft or out of focus"` or `"Severely blurry / out of focus"`.

---

### 4.2 Camera Shake & Stability Analysis
Camera stability is measured by tracking inter-frame feature displacement using Dense Optical Flow (Farnebäck algorithm) or Lucas-Kanade corner tracking:

$$\vec{v}(x, y) = (u(x, y), v(x, y))$$

$$\text{Shake Magnitude} = \sigma\left( \sqrt{u^2 + v^2} \right)$$

- Evaluates the high-frequency jitter (handheld shake) distinct from intentional smooth panning motion.
- **Stability Score (0–100%)**: Measures how steady the technician holds the camera while presenting vehicle components.
- **Issue Flag Triggered**: `"Severe camera shake - very unstable"` or `"Noticeable handheld camera jitter"`.

---

### 4.3 Compression Artifacts & Blockiness Detection
Detects lossy H.264/H.265 compression artifacts by measuring pixel gradient discontinuities across 8×8 Discrete Cosine Transform (DCT) block boundaries:

$$D_h = \sum |I(8k, y) - I(8k+1, y)| - \sum |I(8k-1, y) - I(8k, y)|$$

- Quantifies pixelation, macroblocking, and visual degradation caused by low-bandwidth uploads.
- **Issue Flag Triggered**: `"Visible compression artifacts"`.

---

### 4.4 Brightness, Contrast & Color Vibrancy
- **Exposure / Brightness**: Evaluated in HSV/LAB color space. Measures the mean luminance channel $\mu_L$ and flags underexposure ($< 25\%$) or overexposure ($> 85\%$).
- **Contrast**: Root-Mean-Square (RMS) contrast of luminance:
  $$\text{Contrast}_{\text{RMS}} = \sqrt{\frac{1}{N} \sum (I_i - \bar{I})^2}$$
- **Color Vibrancy**: Standard deviation of the Saturation channel $S$ in HSV space. Flags dull, washed-out video.
- **Issue Flags Triggered**: `"Suboptimal lighting"`, `"Dark underexposed video"`, `"Dull colors - poor saturation"`.

---

### 4.5 Frozen Frame & Video Glitch Detection
Computes the Mean Absolute Difference (MAD) between sampled consecutive frames:

$$\text{MAD}(t, t+1) = \frac{1}{W \times H} \sum_{x, y} |I_{t+1}(x, y) - I_t(x, y)|$$

- If $\text{MAD} < \epsilon$ for prolonged intervals where timestamps advance, a freeze frame is registered.
- **Issue Flag Triggered**: `"Some frozen frames"`.

---

## 5. Audio Quality Pipeline & Acoustic Metrics

The audio track is extracted as an uncompressed 16kHz 16-bit mono PCM WAV stream and analyzed using `librosa` and `scipy.signal`.

```mermaid
graph LR
    A["Raw Audio Stream"] --> B["RMS Energy & Dynamic Range"]
    A --> C["Spectral Noise Floor & SNR"]
    A --> D["Spectral Centroid & Clarity"]
    A --> E["Harmonic-to-Noise Ratio (HNR)"]
    B --> F["Volume Level: Ideal / Low / Muffled"]
    C --> G["Background Noise: Minimal / Moderate / Heavy"]
    D --> H["Speech Clarity: Clear / Muffled"]
    E --> I["Voice Quality Index"]
```

### 5.1 Volume Level & Consistency
- Computed via short-time Root Mean Square (RMS) energy:
  $$\text{RMS} = \sqrt{\frac{1}{K} \sum_{k=1}^K x[k]^2}$$
- Evaluated against standard broadcast speech target ($-24\text{ dBFS}$ to $-16\text{ dBFS}$).
- **Issue Flag Triggered**: `"Low volume - requires concentration"` or `"Very low volume - hard to hear"`.

---

### 5.2 Background Noise & Signal-to-Noise Ratio (SNR)
- The noise floor is estimated by computing the minimum spectral energy in non-speech segments detected via Voice Activity Detection (VAD).
- Signal-to-Noise Ratio:
  $$\text{SNR (dB)} = 10 \log_{10} \left( \frac{P_{\text{speech}}}{P_{\text{noise}}} \right)$$
- Flags workshop noise, pneumatic tools, passing vehicles, and wind distortion.
- **Issue Flags Triggered**: `"Light background noise - minimal impact"`, `"Moderate background noise - noticeable"`, `"Heavy workshop background noise"`.

---

### 5.3 Speech Clarity & Voice Quality
- Evaluated through Spectral Centroid $\mu_s$, Spectral Rolloff, and Harmonic-to-Noise Ratio (HNR).
- Identifies whether the technician speaks clearly into the microphone or if acoustic reverberation/muffling obscures speech comprehension.
- **Issue Flags Triggered**: `"Poor voice quality - noisy"`, `"Poor speech clarity - very muffled"`, `"Average speech clarity"`.

---

## 6. Natural Language Processing & Translation Pipeline

### 6.1 Automatic Speech Recognition (ASR)
- **Model**: OpenAI Whisper.
- Transcribes the technician's spoken walkthrough commentary into text with high accuracy even amidst mechanical ambient sounds.
- Detects the spoken language (English, Hindi, Kannada, Tamil, etc.).

### 6.2 Multilingual Neural Translation
- **Model**: Meta AI **NLLB-200** (No Language Left Behind) & MarianMT.
- Automatically translates regional Indian dealership commentary into clean, professional English.
- Supported Languages: Hindi, Tamil, Telugu, Kannada, Malayalam, Marathi, Bengali, Gujarati, Punjabi, Odia, Assamese, Urdu, etc.

### 6.3 Executive Summarization
- **Model**: Facebook **BART-large-CNN**.
- Synthesizes the full transcription into an executive inspection summary highlighting:
  1. Identified vehicle defects (e.g. worn brake discs, tire tread wear, suspension bush wear).
  2. Recommended servicing actions.
  3. Customer communication tone and clarity.

---

## 7. Quality Scoring & Weighting Formula

Every video receives a **Video Quality Score** ($0.0 - 10.0$), an **Audio Quality Score** ($0.0 - 10.0$), and an **Overall Quality Score** ($0.0 - 10.0$).

### Component Score Weighting

$$\text{Video Quality} = \sum_{i} w_i \cdot S_i - P_{\text{video\_defects}}$$

Where sub-components include:
- Sharpness & Focus: 30%
- Camera Stability: 30%
- Resolution & Compression Quality: 20%
- Lighting & Color Vibrancy: 20%
- Penalty Deductions ($P$): Deducted for severe camera shake, frozen frames, or extreme pixelation.

$$\text{Audio Quality} = \sum_{j} w_j \cdot A_j - P_{\text{audio\_defects}}$$

Where sub-components include:
- Speech Clarity: 40%
- Signal-to-Noise Ratio (Background Noise): 35%
- Volume Level & Dynamic Consistency: 25%

$$\text{Overall Score} = 0.55 \times \text{Video Quality} + 0.45 \times \text{Audio Quality} - P_{\text{critical\_flags}}$$

### Quality Label Tiers
- **Excellent**: $8.0 - 10.0$ (Broadcast-quality presentation, crystal-clear audio, steady camera).
- **Good**: $6.0 - 7.9$ (Good professional walkthrough with minor acceptable flaws).
- **Fair**: $4.0 - 5.9$ (Deficiencies present: noticeable shake, low volume, or compression issues).
- **Poor**: $< 4.0$ (Severe quality failure: unusable audio, extreme camera shake, or blurry visuals).

---

## 8. Database Architecture & Schema Models

### MongoDB Replica Architecture
The system maintains dual cluster replication:
1. **Primary Database (`scanner.8qogm7e.mongodb.net`)**: Active write/read cluster for FastAPI backend.
2. **Secondary Database (`cluster0.v9v5op1.mongodb.net`)**: Live Focus Hub360 replica synced via `sync_to_focushub360.py`.

```mermaid
classDiagram
    class AnalysisResult {
        +ObjectId _id
        +String dealer_id
        +String citnow_service_advisor
        +String submitted_by_user_id
        +String submitted_by_username
        +Float overall_quality_score
        +String overall_quality_label
        +VideoAnalysis video_analysis
        +AudioAnalysis audio_analysis
        +CitnowMetadata citnow_metadata
        +DateTime created_at
    }
    class VideoAnalysis {
        +Float quality_score
        +String quality_label
        +List~String~ issues
        +String shake_level
        +String resolution_quality
        +Dict component_scores
    }
    class AudioAnalysis {
        +Float score
        +String clarity_level
        +List~String~ issues
        +Dict detailed_analysis
        +Dict component_scores
    }
    class CitnowMetadata {
        +String dealership
        +String service_advisor
        +String vehicle
        +String registration
        +String email
        +String phone
        +String video_url
        +String page_url
    }
    AnalysisResult *-- VideoAnalysis
    AnalysisResult *-- AudioAnalysis
    AnalysisResult *-- CitnowMetadata
```

---

## 9. Key Dashboard Features & Capabilities

1. **Executive Overview**: Total Analyzed Videos, Completion Rate, Benchmark Target KPI (Target vs Actual score comparison).
2. **Advisor Performance Trend**: Interactive Recharts bar chart tracking top service advisors with scorecards.
3. **Personalized Advisor Modal**: Opens on bar or `(i)` button click. Displays:
   - Full Overall, Video, and Audio score breakdown.
   - Total videos analyzed for that advisor.
   - **Real AI Detected Issues**: Exact detected flaws categorized by `[ 📹 Video ]` and `[ 🎙️ Audio ]` with occurrence counts.
   - Direct button link to filtered Results page (`/dealer/results?search=[Advisor]`).
4. **Dealer Top Detected Issues**: Aggregated distribution of the top recurring visual and acoustic problems across the dealership.
5. **Detailed Results Table**: Paginated video walkthrough records with Vehicle Registration, Dealership, Service Advisor, Submitter Name (`Submitted By`), Quality badges, and video playback dialog.
6. **Bulk Ingestion**: Supports uploading CitNOW Excel export spreadsheets (`.xlsx`/`.xls`) and batch-analyzing hundreds of videos with real-time status tracking.

---

## 10. Operational Procedures & Swapping Databases

When promoting the Secondary database (`cluster0`) to become the new Primary:

1. **Run Full Sync**: Execute `python backend/sync_to_focushub360.py` to ensure all 14,930+ analysis records, users, and tasks are identical across both clusters.
2. **Verify Count Parity**: Run `python scratch/compare_databases.py` to confirm zero document count discrepancy.
3. **Update Connection String**: In [`backend/.env`](file:///f:/VideoAnalysis/Quality_Lens/backend/.env), set:
   ```env
   MONGODB_URI="mongodb+srv://focushub360db_db_user:QualityLens2026!@cluster0.v9v5op1.mongodb.net/citnow_analyzer?retryWrites=true&w=majority"
   MONGODB_URI_BACKUP="mongodb+srv://appu:Prasanna460@scanner.8qogm7e.mongodb.net/citnow_analyzer?retryWrites=true&w=majority"
   ```
4. **Restart Backend Service**:
   ```bash
   sudo systemctl restart qualitylens-backend
   ```
