from django.contrib import admin
from .models import License

@admin.register(License)
class LicenseAdmin(admin.ModelAdmin):
    list_display = ("name", "gender", "education", "phone", "is_approved", "created_at")
    search_fields = ("name", "phone")
    list_filter = ("gender", "is_approved", "education")
