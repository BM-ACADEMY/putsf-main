from django.db import models

class Banner(models.Model):
    title = models.CharField(max_length=255, default="Default Title")
    subtitle = models.CharField(max_length=255, blank=True, null=True)
    image = models.ImageField(upload_to='banner/')
    created_at = models.DateTimeField(auto_now_add=True)  # Only this, remove any default

    def __str__(self):
        return self.title
