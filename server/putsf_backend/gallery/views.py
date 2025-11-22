from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from django.conf import settings
from putsf_backend.mongo import db
from django.utils import timezone
from bson.objectid import ObjectId
import os
from urllib.parse import urlparse


class GalleryImageAPIView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, mongo_id=None):
        """
        GET all images or a single image by ID
        """
        images_collection = db["gallery_images"]
        try:
            if mongo_id:
                image = images_collection.find_one({"_id": ObjectId(mongo_id)})
                if not image:
                    return Response({"error": "Image not found"}, status=status.HTTP_404_NOT_FOUND)
                image["_id"] = str(image["_id"])
                return Response(image)
            else:
                images = list(images_collection.find({}).sort("created_at", -1))
                for img in images:
                    img["_id"] = str(img["_id"])
                return Response(images)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        """
        POST a new image with title
        """
        images_collection = db["gallery_images"]

        image_file = request.FILES.get("image")
        title = request.data.get("title")

        if not image_file or not title:
            return Response({"error": "Title and image are required"}, status=status.HTTP_400_BAD_REQUEST)

        if images_collection.find_one({"title": title}):
            return Response({"error": "Image with this title already exists"}, status=status.HTTP_400_BAD_REQUEST)

        media_dir = os.path.join(settings.MEDIA_ROOT, "gallery")
        os.makedirs(media_dir, exist_ok=True)
        file_path = os.path.join(media_dir, image_file.name)

        with open(file_path, "wb+") as f:
            for chunk in image_file.chunks():
                f.write(chunk)

        full_url = f"{settings.SITE_DOMAIN}/media/gallery/{image_file.name}"

        data = {
            "title": title,
            "image_url": full_url,
            "created_at": timezone.now().isoformat()
        }

        result = images_collection.insert_one(data)
        return Response(
            {"message": "Image added successfully!", "_id": str(result.inserted_id), "image_url": full_url},
            status=status.HTTP_201_CREATED
        )

    def patch(self, request, mongo_id):
        """
        PATCH (update) gallery image by ID (supports title and optional image)
        """
        images_collection = db["gallery_images"]

        try:
            image = images_collection.find_one({"_id": ObjectId(mongo_id)})
            if not image:
                return Response({"error": "Image not found"}, status=status.HTTP_404_NOT_FOUND)

            update_data = {}
            title = request.data.get("title")
            image_file = request.FILES.get("image")

            if title:
                update_data["title"] = title

            if image_file:
                media_dir = os.path.join(settings.MEDIA_ROOT, "gallery")
                os.makedirs(media_dir, exist_ok=True)
                file_path = os.path.join(media_dir, image_file.name)

                with open(file_path, "wb+") as f:
                    for chunk in image_file.chunks():
                        f.write(chunk)

                full_url = f"{settings.SITE_DOMAIN}/media/gallery/{image_file.name}"
                update_data["image_url"] = full_url

                # Remove old image
                old_image_url = image.get("image_url")
                if old_image_url and old_image_url != full_url:
                    filename = os.path.basename(old_image_url)
                    old_path = os.path.join(settings.MEDIA_ROOT, "gallery", filename)
                    if os.path.exists(old_path):
                        os.remove(old_path)

            if not update_data:
                return Response({"error": "No valid fields to update"}, status=status.HTTP_400_BAD_REQUEST)

            images_collection.update_one({"_id": ObjectId(mongo_id)}, {"$set": update_data})
            image.update(update_data)
            image["_id"] = str(image["_id"])

            return Response({"message": "Image updated successfully!", "image": image}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, mongo_id):
        """
        DELETE an image by ID
        """
        images_collection = db["gallery_images"]

        try:
            image = images_collection.find_one({"_id": ObjectId(mongo_id)})
            if not image:
                return Response({"error": "Image not found"}, status=status.HTTP_404_NOT_FOUND)

            image_url = image.get("image_url")
            if image_url:
                filename = os.path.basename(image_url)
                file_path = os.path.join(settings.MEDIA_ROOT, "gallery", filename)
                if os.path.exists(file_path):
                    os.remove(file_path)

            images_collection.delete_one({"_id": ObjectId(mongo_id)})
            return Response({"message": "Image deleted successfully!"}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
