#!/usr/bin/env python3
"""
Full Database Backup Script for QualityLens (citnow_analyzer)
Exports all collections to JSON with BSON fidelity, creates metadata, and packages into a compressed ZIP file.
"""

import os
import sys
import json
import zipfile
import tempfile
from datetime import datetime
from pymongo import MongoClient
import bson.json_util

# Load configuration from backend/.env if present
def load_env():
    env_path = os.path.join(os.path.dirname(__file__), ".env")
    env_vars = {}
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    env_vars[k.strip()] = v.strip().strip('"').strip("'")
    return env_vars

def main():
    env = load_env()
    db_name = env.get("MONGODB_DB_NAME", "citnow_analyzer")
    uri = env.get("MONGODB_URI", "mongodb://localhost:27017/")

    print(f"[*] Connecting to MongoDB database: {db_name} ...")
    client = MongoClient(uri)
    db = client[db_name]

    # Timestamp for backup
    now_str = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backups"))
    os.makedirs(backup_root, exist_ok=True)
    zip_filename = f"citnow_backup_{now_str}.zip"
    zip_filepath = os.path.join(backup_root, zip_filename)

    collections = sorted(db.list_collection_names())
    print(f"[*] Found {len(collections)} collection(s): {', '.join(collections)}")

    metadata = {
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "database": db_name,
        "backup_file": zip_filename,
        "collections": {}
    }

    with tempfile.TemporaryDirectory() as temp_dir:
        print(f"[*] Exporting collections to temporary directory: {temp_dir}")
        for col_name in collections:
            col = db[col_name]
            doc_count = col.count_documents({})
            print(f"    -> Exporting '{col_name}' ({doc_count} docs)...", end="", flush=True)
            
            file_path = os.path.join(temp_dir, f"{col_name}.json")
            
            # Use streaming / chunked export to handle large collections smoothly
            with open(file_path, "w", encoding="utf-8") as f:
                f.write("[\n")
                cursor = col.find({})
                first = True
                written = 0
                for doc in cursor:
                    if not first:
                        f.write(",\n")
                    f.write(bson.json_util.dumps(doc, indent=2))
                    first = False
                    written += 1
                f.write("\n]\n")

            file_size_bytes = os.path.getsize(file_path)
            metadata["collections"][col_name] = {
                "document_count": doc_count,
                "exported_count": written,
                "raw_size_bytes": file_size_bytes
            }
            print(f" done ({file_size_bytes / (1024*1024):.2f} MB)")

        # Write metadata.json
        meta_path = os.path.join(temp_dir, "backup_metadata.json")
        with open(meta_path, "w", encoding="utf-8") as f:
            json.dump(metadata, f, indent=2)

        # Create ZIP archive
        print(f"[*] Compressing backup archive to {zip_filepath} ...")
        with zipfile.ZipFile(zip_filepath, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=6) as zip_f:
            for root, _, files in os.walk(temp_dir):
                for f in files:
                    full_p = os.path.join(root, f)
                    arcname = os.path.relpath(full_p, temp_dir)
                    zip_f.write(full_p, arcname)

    zip_size_mb = os.path.getsize(zip_filepath) / (1024 * 1024)
    print(f"[+] Backup completed successfully!")
    print(f"    Location: {zip_filepath}")
    print(f"    Size: {zip_size_mb:.2f} MB")
    print(f"    Summary:")
    for col, info in metadata["collections"].items():
        print(f"      - {col}: {info['document_count']} records")

if __name__ == "__main__":
    main()
