from django.db import models

class Complaint(models.Model):
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]  # ✅ keeps newest first

    def __str__(self):
        return f"{self.name} - {self.phone}"
