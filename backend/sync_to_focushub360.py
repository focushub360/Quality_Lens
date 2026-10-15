#!/usr/bin/env python3
"""
Sync & Update Database from Live Scanner to Focus Hub360 MongoDB
Ensures target Focus Hub360 cluster is 100% up to date with zero data loss.
"""

import sys
import time
from datetime import datetime
import certifi
from pymongo import MongoClient, ReplaceOne

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

SRC_URI = "mongodb+srv://appu:Prasanna460@scanner.8qogm7e.mongodb.net/citnow_analyzer?retryWrites=true&w=majority"
DST_URI = "mongodb+srv://focushub360db_db_user:QualityLens2026!@cluster0.v9v5op1.mongodb.net/citnow_analyzer?retryWrites=true&w=majority"
DB_NAME = "citnow_analyzer"
BATCH_SIZE = 500

def sync_database():
    start_time = time.time()
    print("=" * 65)
    print("QUALITY LENS: SYNCING DATABASE TO FOCUS HUB360")
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 65)

    print("[*] Connecting to Source MongoDB (Live Scanner)...")
    src_client = MongoClient(SRC_URI, tlsCAFile=certifi.where(), serverSelectionTimeoutMS=15000)
    src_db = src_client[DB_NAME]
    src_client.admin.command("ping")
    print("  [OK] Source connected.")

    print("[*] Connecting to Target MongoDB (Focus Hub360)...")
    dst_client = MongoClient(DST_URI, tlsCAFile=certifi.where(), serverSelectionTimeoutMS=15000)
    dst_db = dst_client[DB_NAME]
    dst_client.admin.command("ping")
    print("  [OK] Target connected.")

    cols = sorted(src_db.list_collection_names())
    print(f"\n[*] Found {len(cols)} collections to sync: {', '.join(cols)}\n")

    summary = {}

    for col_name in cols:
        src_col = src_db[col_name]
        dst_col = dst_db[col_name]

        src_count = src_col.count_documents({})
        before_dst_count = dst_col.count_documents({})
        print(f"[*] [{col_name}] Source: {src_count} | Target Before: {before_dst_count}")

        if src_count == 0:
            print(f"    -> Skipping empty collection.")
            summary[col_name] = {"source": 0, "target_final": before_dst_count, "synced": 0}
            continue

        # Sync in batches with upsert (ReplaceOne)
        cursor = src_col.find({}).batch_size(BATCH_SIZE)
        batch = []
        synced_count = 0
        batch_num = 0

        try:
            for doc in cursor:
                doc_id = doc.get("_id")
                if doc_id is not None:
                    batch.append(ReplaceOne({"_id": doc_id}, doc, upsert=True))
                else:
                    dst_col.insert_one(doc)
                    synced_count += 1

                if len(batch) >= BATCH_SIZE:
                    batch_num += 1
                    dst_col.bulk_write(batch, ordered=False)
                    synced_count += len(batch)
                    print(f"    -> Processed batch {batch_num} ({synced_count}/{src_count})...", end="\r", flush=True)
                    batch = []

            if batch:
                dst_col.bulk_write(batch, ordered=False)
                synced_count += len(batch)

        finally:
            cursor.close()

        # Copy indexes if any
        try:
            indexes = src_col.index_information()
            for idx_name, idx_info in indexes.items():
                if idx_name != "_id_":
                    keys = idx_info["key"]
                    unique = idx_info.get("unique", False)
                    dst_col.create_index(keys, name=idx_name, unique=unique, background=True)
        except Exception as idx_err:
            print(f"    (Notice: index creation note for {col_name}: {idx_err})")

        after_dst_count = dst_col.count_documents({})
        print(f"    [OK] Synced {synced_count} docs. Target Final: {after_dst_count} docs.")
        summary[col_name] = {
            "source": src_count,
            "target_before": before_dst_count,
            "target_final": after_dst_count,
            "synced": synced_count
        }

    elapsed = time.time() - start_time
    print("\n" + "=" * 65)
    print("SUCCESS: FOCUS HUB360 DATABASE SYNC COMPLETED!")
    print(f"Duration: {elapsed:.2f} seconds")
    print("=" * 65)
    print(f"{'Collection':<25} | {'Source':<10} | {'Target Before':<14} | {'Target Final':<12}")
    print("-" * 65)
    for col, s in summary.items():
        print(f"{col:<25} | {s['source']:<10} | {s.get('target_before', 0):<14} | {s['target_final']:<12}")
    print("=" * 65)

if __name__ == "__main__":
    sync_database()
