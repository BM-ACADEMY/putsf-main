from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import Complaint
from .serializers import ComplaintSerializer
from django.conf import settings
from datetime import datetime
from putsf_backend.db import get_db

class ComplaintViewSet(viewsets.ModelViewSet):
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        """Save in SQLite and also sync to MongoDB if connected."""
        complaint = serializer.save()  # ✅ Save to SQLite first

        db = get_db()
        if db:
            try:
                db.complaints.insert_one({
                    "name": complaint.name,
                    "phone": complaint.phone,
                    "message": complaint.message,
                    "created_at": datetime.utcnow(),
                })
                if settings.DEBUG:
                    print("✅ Complaint also saved to MongoDB")
            except Exception as e:
                if settings.DEBUG:
                    print(f"⚠️ Failed to save complaint in MongoDB: {e}")
        else:
            if settings.DEBUG:
                print("⚠️ MongoDB not connected. Complaint only saved in SQLite.")
