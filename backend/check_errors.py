import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "videoanalysis")

print(f"Connecting to MongoDB URI: {MONGODB_URI[:30]}... DB: {MONGODB_DB_NAME}")

client = MongoClient(MONGODB_URI)
db = client[MONGODB_DB_NAME]
results_coll = db["analysis_results"]

batch_id = "6a3e1ac093642e7ac7bf82f1"
query = {"batch_id": batch_id, "status": "failed"}

failed_docs = list(results_coll.find(query))
print(f"Found {len(failed_docs)} failed documents.")

for idx, doc in enumerate(failed_docs):
    print(f"\n--- Failed Video {idx + 1} ---")
    print(f"URL: {doc.get('input_source')}")
    print(f"Order: {doc.get('processing_order')}")
    print(f"Error Message: {doc.get('error_message')}")
    excel_meta = doc.get("excel_metadata", {})
    print(f"Excel Metadata: {excel_meta}")
