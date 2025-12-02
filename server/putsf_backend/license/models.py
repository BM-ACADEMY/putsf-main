from django.db import models

class License(models.Model):

    GENDER_CHOICES = (
        ("male", "Male"),
        ("female", "Female"),
        ("other", "Other"),
    )

    name = models.CharField(max_length=100)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True, null=True)
    education = models.CharField(max_length=150, blank=True, null=True)
    phone = models.CharField(max_length=15, unique=True)
    address = models.TextField()
    photo = models.ImageField(upload_to="licenses/photos/", blank=True, null=True)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.phone})"
