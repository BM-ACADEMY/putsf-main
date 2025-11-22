# putsf_backend/__init__.py
import os
from pymongo import MongoClient
from django.conf import settings

db = None

def connect_mongo():
    global db
    MONGO_URI = os.getenv("MONGO_URI")
    MONGO_DB_NAME = os.getenv("MONGO_DB_NAME")
    if MONGO_URI and MONGO_DB_NAME:
        try:
            client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
            client.admin.command('ping')
            db = client[MONGO_DB_NAME]
            if settings.DEBUG:
                print(f"✅ Connected to MongoDB Atlas: {MONGO_DB_NAME}")
        except Exception as e:
            db = None
            if settings.DEBUG:
                print(f"❌ MongoDB Atlas connection error: {e}")

# Only connect when runserver actually starts
if os.environ.get("RUN_MAIN") == "true":
    connect_mongo()
