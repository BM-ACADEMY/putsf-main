from django.contrib.auth.models import AbstractUser
from django.db import models

class AdminUser(AbstractUser):
    is_admin = models.BooleanField(default=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    email = models.EmailField(unique=True)

    def __str__(self):
        return self.email
