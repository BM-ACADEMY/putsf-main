from pymongo import MongoClient
from django.conf import settings

def get_db():
    try:
        client = MongoClient(settings.MONGO_URI)
        db = client[settings.MONGO_DB_NAME]
        return db
    except Exception as e:
        if settings.DEBUG:
            print(f"⚠️ MongoDB connection failed: {e}")
        return None
