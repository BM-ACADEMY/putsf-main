from django.contrib import admin
from .models import Banner

class BannerAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'subtitle', 'created_at')  # ✅ use existing field

admin.site.register(Banner, BannerAdmin)
