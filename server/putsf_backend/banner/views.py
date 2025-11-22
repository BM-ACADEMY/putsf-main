from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from django.conf import settings
from putsf_backend.mongo import db
from django.utils import timezone
from bson.objectid import ObjectId
from urllib.parse import urlparse
import os


class BannerAPIView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, mongo_id=None):
        """Fetch all banners or a single banner"""
        banners_collection = db["banners"]
        try:
            if mongo_id:
                banner = banners_collection.find_one({"_id": ObjectId(mongo_id)})
                if not banner:
                    return Response({"error": "Banner not found"}, status=status.HTTP_404_NOT_FOUND)
                banner["_id"] = str(banner["_id"])
                return Response(banner)
            else:
                banners = list(banners_collection.find({}).sort("created_at", -1))
                for b in banners:
                    b["_id"] = str(b["_id"])
                return Response(banners)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        """Upload a new banner image"""
        banners_collection = db["banners"]
        image_file = request.FILES.get("image")

        if not image_file:
            return Response({"error": "Image is required"}, status=status.HTTP_400_BAD_REQUEST)

        media_dir = os.path.join(settings.MEDIA_ROOT, "banner")
        os.makedirs(media_dir, exist_ok=True)
        file_path = os.path.join(media_dir, image_file.name)

        try:
            with open(file_path, "wb+") as f:
                for chunk in image_file.chunks():
                    f.write(chunk)
        except Exception as e:
            return Response({"error": f"Failed to save image: {str(e)}"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        full_url = request.build_absolute_uri(f"/media/banner/{image_file.name}")

        data = {
            "image_url": full_url,
            "created_at": timezone.now().isoformat()
        }

        result = banners_collection.insert_one(data)
        return Response(
            {"message": "Banner uploaded successfully!", "image_url": full_url, "_id": str(result.inserted_id)},
            status=status.HTTP_201_CREATED
        )

    def patch(self, request, mongo_id):
        """Update the banner image"""
        banners_collection = db["banners"]

        try:
            banner = banners_collection.find_one({"_id": ObjectId(mongo_id)})
            if not banner:
                return Response({"error": "Banner not found"}, status=status.HTTP_404_NOT_FOUND)

            image_file = request.FILES.get("image")
            if not image_file:
                return Response({"error": "No image provided"}, status=status.HTTP_400_BAD_REQUEST)

            # Save new image
            media_dir = os.path.join(settings.MEDIA_ROOT, "banner")
            os.makedirs(media_dir, exist_ok=True)
            file_path = os.path.join(media_dir, image_file.name)

            with open(file_path, "wb+") as f:
                for chunk in image_file.chunks():
                    f.write(chunk)

            full_url = request.build_absolute_uri(f"/media/banner/{image_file.name}")

            # Remove old image file
            old_image_url = banner.get("image_url")
            if old_image_url and old_image_url != full_url:
                parsed_path = urlparse(old_image_url).path
                old_file_path = os.path.join(settings.BASE_DIR, parsed_path.lstrip("/"))
                if os.path.exists(old_file_path):
                    os.remove(old_file_path)

            banners_collection.update_one({"_id": ObjectId(mongo_id)}, {"$set": {"image_url": full_url}})
            banner["image_url"] = full_url
            banner["_id"] = str(banner["_id"])

            return Response({"message": "Banner image updated successfully", "banner": banner},
                            status=status.HTTP_200_OK)

        except Exception as e:
            print("PATCH ERROR:", e)
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, mongo_id):
        """Delete banner and image file"""
        banners_collection = db["banners"]

        try:
            banner = banners_collection.find_one({"_id": ObjectId(mongo_id)})
            if not banner:
                return Response({"error": "Banner not found"}, status=status.HTTP_404_NOT_FOUND)

            image_url = banner.get("image_url")
            if image_url:
                parsed_path = urlparse(image_url).path
                file_path = os.path.join(settings.BASE_DIR, parsed_path.lstrip("/"))
                if os.path.exists(file_path):
                    os.remove(file_path)

            banners_collection.delete_one({"_id": ObjectId(mongo_id)})
            return Response({"message": "Banner deleted successfully!"}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
