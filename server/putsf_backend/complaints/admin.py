from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Complaint

@admin.register(Complaint)
class ComplaintAdmin(admin.ModelAdmin):
    list_display = ("name", "phone", "message", "created_at")
    search_fields = ("name", "phone", "message")
    list_filter = ("created_at",)
