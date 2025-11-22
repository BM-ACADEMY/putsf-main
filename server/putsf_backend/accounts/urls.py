from rest_framework_simplejwt.views import TokenRefreshView
from django.urls import path
from .views import AdminLoginAPIView

urlpatterns = [
    path('login/', AdminLoginAPIView.as_view(), name='admin-login'),
    path('refresh/', TokenRefreshView.as_view(), name='token-refresh'),
]
