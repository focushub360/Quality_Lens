# backend/download_models.py
import os
from transformers import BartForConditionalGeneration, BartTokenizer, AutoTokenizer, AutoModelForSeq2SeqLM
from faster_whisper import WhisperModel

cache_dir = '/app/cache'
os.environ['HF_HOME'] = cache_dir
os.environ['TRANSFORMERS_CACHE'] = cache_dir

print('Pre-loading facebook/bart-large-cnn...')
BartForConditionalGeneration.from_pretrained('facebook/bart-large-cnn', cache_dir=cache_dir)
BartTokenizer.from_pretrained('facebook/bart-large-cnn', cache_dir=cache_dir)

print('Pre-loading facebook/nllb-200-distilled-600M...')
AutoTokenizer.from_pretrained('facebook/nllb-200-distilled-600M', cache_dir=cache_dir)
AutoModelForSeq2SeqLM.from_pretrained('facebook/nllb-200-distilled-600M', cache_dir=cache_dir)

print('Pre-loading faster-whisper base model...')
WhisperModel('base', device='cpu', compute_type='int8', download_root=os.path.join(cache_dir, 'hub'))

print('All models cached successfully!')
