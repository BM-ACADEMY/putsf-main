from django.contrib import admin
from .models import License

@admin.register(License)
class LicenseAdmin(admin.ModelAdmin):
    list_display = ("name", "aadhar_number", "phone", "is_approved", "created_at")
    list_filter = ("is_approved",)
    search_fields = ("name", "aadhar_number", "phone")
