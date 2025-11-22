# putsf_backend/mongo.py
import os
from pymongo import MongoClient
from dotenv import load_dotenv
from pathlib import Path
import logging

# -----------------------------
# Setup
# -----------------------------
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(os.path.join(BASE_DIR, ".env"))

MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME")

db = None

if MONGO_URI and MONGO_DB_NAME:
    try:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        client.admin.command('ping')  # Test connection
        db = client[MONGO_DB_NAME]
        logging.info(f"✅ Connected to MongoDB Atlas: {MONGO_DB_NAME}")
    except Exception as e:
        logging.error(f"❌ MongoDB Atlas connection error: {e}")
        db = None
else:
    logging.warning("⚠️ MONGO_URI or MONGO_DB_NAME not set. db is None")
