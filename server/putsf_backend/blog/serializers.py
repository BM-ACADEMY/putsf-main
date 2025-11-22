# blog/serializers.py
from django.conf import settings
from rest_framework import serializers
from .models import Blog

class BlogSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Blog
        fields = ['id', 'title', 'image_url', 'created_at']

    def get_image_url(self, obj):
        if obj.image:
            return f"{settings.BASE_URL}/static/blog/{obj.image.name}"
        return None
