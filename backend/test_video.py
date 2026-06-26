import traceback
import sys
from Dude import UnifiedMediaAnalyzer

# Use a mock/simplified or full analyzer
print("Initializing UnifiedMediaAnalyzer...")
try:
    analyzer = UnifiedMediaAnalyzer()
    
    # We can load model dependencies if needed, or if the initialization does it automatically
    # Wait, does the analyzer load models on demand?
    # Yes, typically.
    
    url = "https://southasia.citnow.com/vp9Y3BP8Rd8"
    print(f"Processing video: {url}")
    res = analyzer.process_video(url, transcription_language="auto", target_language_short="en")
    print("Success! Result:")
    print(res)
except Exception as e:
    print("\n--- ERROR TRACEBACK ---")
    traceback.print_exc()
