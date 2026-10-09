#!/usr/bin/env python3
"""
Database Restore and Migration Script for QualityLens (citnow_analyzer)
Restores backup data from compressed ZIP archive (BSON/JSON format) to a target MongoDB database.
"""

import os
import sys
import json
import zipfile
import tempfile
import argparse
from datetime import datetime
from pymongo import MongoClient
import bson.json_util

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
                elif line.startswith("# MONGODB_URI_BACKUP="):
                    _, v = line.split("=", 1)
                    env_vars["MONGODB_URI_BACKUP"] = v.strip().strip('"').strip("'")
    return env_vars

def find_latest_backup(backups_dir):
    if not os.path.exists(backups_dir):
        return None
    zips = [os.path.join(backups_dir, f) for f in os.listdir(backups_dir) if f.startswith("citnow_backup_") and f.endswith(".zip")]
    if not zips:
        return None
    zips.sort(key=os.path.getmtime, reverse=True)
    return zips[0]

def restore_backup(backup_zip_path, target_uri, db_name="citnow_analyzer", batch_size=1000):
    print(f"[*] Target URI: {target_uri}")
    print(f"[*] Target Database: {db_name}")
    print(f"[*] Backup Archive: {backup_zip_path}")

    if not os.path.exists(backup_zip_path):
        raise FileNotFoundError(f"Backup file not found: {backup_zip_path}")

    print("[*] Connecting to target MongoDB...")
    client = MongoClient(target_uri, serverSelectionTimeoutMS=10000)
    client.admin.command("ping")
    print("[+] Successfully connected to target MongoDB server!")

    db = client[db_name]

    with tempfile.TemporaryDirectory() as temp_dir:
        print(f"[*] Extracting backup archive to {temp_dir} ...")
        with zipfile.ZipFile(backup_zip_path, "r") as zip_f:
            zip_f.extractall(temp_dir)

        meta_path = os.path.join(temp_dir, "backup_metadata.json")
        if os.path.exists(meta_path):
            with open(meta_path, "r", encoding="utf-8") as f:
                metadata = json.load(f)
            print(f"[*] Backup timestamp: {metadata.get('timestamp')}")

        json_files = [f for f in os.listdir(temp_dir) if f.endswith(".json") and f != "backup_metadata.json"]
        print(f"[*] Found {len(json_files)} collection file(s) to restore.")

        migration_summary = {}

        for jf in json_files:
            col_name = os.path.splitext(jf)[0]
            file_path = os.path.join(temp_dir, jf)
            col = db[col_name]

            print(f"    -> Restoring collection '{col_name}' ...", flush=True)
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read().strip()

            if not content or content == "[]":
                print("       Empty collection. Skipped.")
                migration_summary[col_name] = {"inserted": 0, "total_target": col.count_documents({})}
                continue

            docs = bson.json_util.loads(content)
            total_docs = len(docs)
            print(f"       Loaded {total_docs} document(s) from backup.")

            inserted = 0
            for i in range(0, total_docs, batch_size):
                chunk = docs[i : i + batch_size]
                try:
                    result = col.insert_many(chunk, ordered=False)
                    inserted += len(result.inserted_ids)
                except Exception as e:
                    for doc in chunk:
                        try:
                            if "_id" in doc:
                                col.replace_one({"_id": doc["_id"]}, doc, upsert=True)
                            else:
                                col.insert_one(doc)
                            inserted += 1
                        except Exception:
                            pass

            final_count = col.count_documents({})
            print(f"       Done. Processed: {inserted}/{total_docs} docs. Total in collection now: {final_count}")
            migration_summary[col_name] = {"inserted": inserted, "total_target": final_count}

    print("\n[+] Migration completed successfully!")
    print("================ Migration Summary ================")
    for col, stat in migration_summary.items():
        print(f"  - {col}: {stat['inserted']} restored (Total in DB: {stat['total_target']})")
    print("===================================================")

def main():
    parser = argparse.ArgumentParser(description="Restore backup data to a target MongoDB database.")
    parser.add_argument("--backup-file", help="Path to backup ZIP file.")
    parser.add_argument("--target-uri", help="Target MongoDB URI.")
    parser.add_argument("--db-name", default="citnow_analyzer", help="Target database name.")
    args = parser.parse_args()

    env = load_env()
    target_uri = args.target_uri or env.get("MONGODB_URI_BACKUP")
    if not target_uri:
        print("[!] Error: No target URI provided.")
        sys.exit(1)

    backup_file = args.backup_file
    if not backup_file:
        backups_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backups"))
        backup_file = find_latest_backup(backups_dir)
        if not backup_file:
            print(f"[!] Error: No backup ZIP found in {backups_dir}")
            sys.exit(1)

    restore_backup(backup_file, target_uri, args.db_name)

if __name__ == "__main__":
    main()