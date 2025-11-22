from django.urls import path
from .views import BlogPostAPIView

urlpatterns = [
    path("posts/", BlogPostAPIView.as_view(), name="blog_posts"),           # GET all / POST new
    path("posts/<str:post_id>/", BlogPostAPIView.as_view(), name="blog_post_detail"),  # GET/DELETE single
]
