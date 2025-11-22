from django.urls import path
from .views import BannerAPIView

urlpatterns = [
    path('banners/', BannerAPIView.as_view()),               # GET all / POST
    path('banners/<str:mongo_id>/', BannerAPIView.as_view()),  # GET/DELETE by _id
]
