# putsf_backend/license/models.py
from django.db import models

class License(models.Model):
    name = models.CharField(max_length=100)
    aadhar_number = models.CharField(max_length=12)
    phone = models.CharField(max_length=15, unique=True)  # ✅ Unique constraint added
    address = models.TextField()
    photo = models.ImageField(upload_to="licenses/photos/", blank=True, null=True)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.phone})"
