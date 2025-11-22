from rest_framework import serializers
from django.conf import settings
from .models import Banner


class BannerSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Banner
        fields = ['_id', 'title', 'image', 'image_url', 'created_at']

    def get_image_url(self, obj):
        if obj.image:
            return f"{settings.BASE_URL}{settings.MEDIA_URL}banner/{obj.image}"
        return None