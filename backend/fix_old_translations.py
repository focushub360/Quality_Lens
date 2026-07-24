import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from deep_translator import GoogleTranslator
import os

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://mongodb:27017/") # Docker network uses 'mongodb' host
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "citnow_analyzer")

async def fix_translations():
    print(f"Connecting to MongoDB at {MONGODB_URI}")
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client[MONGODB_DB_NAME]
    results_collection = db["analysis_results"]

    translator = GoogleTranslator(source='auto', target='en')
    
    cursor = results_collection.find({})
    updated_count = 0
    total = 0
    
    async for doc in cursor:
        total += 1
        transcription = doc.get('transcription', {}).get('text', '')
        translation = doc.get('translation', {}).get('translated_text', '')
        
        # If the translation is the exact same as the transcription, it's the old bug
        if transcription and translation == transcription and doc.get('target_language', 'en') == 'en':
            print(f"Fixing document {doc.get('_id')}...")
            
            try:
                # Handle large texts
                text_to_translate = transcription
                if len(text_to_translate) > 4900:
                    text_to_translate = text_to_translate[:4900] + "..."
                
                new_translation = translator.translate(text_to_translate)
                
                # Check if it actually changed (if it was English, it wouldn't change much)
                if new_translation and new_translation != transcription:
                    await results_collection.update_one(
                        {"_id": doc["_id"]},
                        {"$set": {"translation.translated_text": new_translation}}
                    )
                    updated_count += 1
                    print(f"✅ Successfully updated document {doc.get('_id')}")
                else:
                    print(f"⏭️ Skipping {doc.get('_id')} - text is already English or translation failed.")
            except Exception as e:
                print(f"❌ Failed to translate document {doc.get('_id')}: {e}")
                
    print(f"\n🎉 Done! Checked {total} documents, updated {updated_count} old translations.")

if __name__ == "__main__":
    asyncio.run(fix_translations())
