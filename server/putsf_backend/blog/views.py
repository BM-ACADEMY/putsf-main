from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from django.conf import settings
from django.utils import timezone
from putsf_backend.mongo import db
from bson.objectid import ObjectId
import os


class BlogPostAPIView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, post_id=None):
        """
        GET all posts or a single post by ID
        """
        posts_collection = db["blog_posts"]

        try:
            if post_id:
                post = posts_collection.find_one({"_id": ObjectId(post_id)})
                if not post:
                    return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)
                post["_id"] = str(post["_id"])
                return Response(post)
            else:
                posts = list(posts_collection.find({}).sort("created_at", -1))
                for post in posts:
                    post["_id"] = str(post["_id"])
                return Response(posts)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        """
        Create a new blog post
        """
        posts_collection = db["blog_posts"]

        title = request.data.get("title")
        subtitle = request.data.get("subtitle")
        content = request.data.get("content")
        status_post = request.data.get("status", "draft")
        image_file = request.FILES.get("image")

        if not title or not content or not image_file:
            return Response({"error": "Title, content, and image are required"}, status=status.HTTP_400_BAD_REQUEST)

        # Save image to media/blog/
        media_dir = os.path.join(settings.MEDIA_ROOT, "blog")
        os.makedirs(media_dir, exist_ok=True)
        file_path = os.path.join(media_dir, image_file.name)

        try:
            with open(file_path, "wb+") as f:
                for chunk in image_file.chunks():
                    f.write(chunk)
        except Exception as e:
            return Response({"error": f"Failed to save image: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        image_url = request.build_absolute_uri(f"/media/blog/{image_file.name}")

        post_data = {
            "title": title,
            "subtitle": subtitle,
            "content": content,
            "status": status_post,
            "image_url": image_url,
            "created_at": timezone.now().isoformat()
        }

        result = posts_collection.insert_one(post_data)
        post_data["_id"] = str(result.inserted_id)

        return Response({"message": "Blog post created successfully!", "post": post_data}, status=status.HTTP_201_CREATED)

    def patch(self, request, post_id):
        """
        PATCH: Partially update blog post (title, subtitle, content, status, image)
        """
        posts_collection = db["blog_posts"]

        try:
            obj_id = ObjectId(post_id)
        except:
            return Response({"error": "Invalid post ID"}, status=status.HTTP_400_BAD_REQUEST)

        post = posts_collection.find_one({"_id": obj_id})
        if not post:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

        update_data = {}
        title = request.data.get("title")
        subtitle = request.data.get("subtitle")
        content = request.data.get("content")
        status_post = request.data.get("status")
        image_file = request.FILES.get("image")

        if title:
            update_data["title"] = title
        if subtitle:
            update_data["subtitle"] = subtitle
        if content:
            update_data["content"] = content
        if status_post in ["draft", "published"]:
            update_data["status"] = status_post

        # Handle new image upload
        if image_file:
            media_dir = os.path.join(settings.MEDIA_ROOT, "blog")
            os.makedirs(media_dir, exist_ok=True)
            file_path = os.path.join(media_dir, image_file.name)

            with open(file_path, "wb+") as f:
                for chunk in image_file.chunks():
                    f.write(chunk)

            full_url = request.build_absolute_uri(f"/media/blog/{image_file.name}")
            update_data["image_url"] = full_url

            # Remove old image if different
            old_image_url = post.get("image_url")
            if old_image_url and old_image_url != full_url:
                filename = os.path.basename(old_image_url)
                old_file_path = os.path.join(settings.MEDIA_ROOT, "blog", filename)
                if os.path.exists(old_file_path):
                    os.remove(old_file_path)

        if not update_data:
            return Response({"error": "No valid fields to update"}, status=status.HTTP_400_BAD_REQUEST)

        posts_collection.update_one({"_id": obj_id}, {"$set": update_data})

        post.update(update_data)
        post["_id"] = str(post["_id"])

        return Response({"message": "Blog updated successfully!", "post": post}, status=status.HTTP_200_OK)

    def delete(self, request, post_id):
        """
        DELETE a blog post by ID
        """
        posts_collection = db["blog_posts"]

        try:
            obj_id = ObjectId(post_id)
        except:
            return Response({"error": "Invalid post ID"}, status=status.HTTP_400_BAD_REQUEST)

        post = posts_collection.find_one({"_id": obj_id})
        if not post:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

        image_url = post.get("image_url")
        if image_url:
            filename = os.path.basename(image_url)
            file_path = os.path.join(settings.MEDIA_ROOT, "blog", filename)
            if os.path.exists(file_path):
                os.remove(file_path)

        posts_collection.delete_one({"_id": obj_id})
        return Response({"message": "Blog post deleted successfully!"}, status=status.HTTP_200_OK)
