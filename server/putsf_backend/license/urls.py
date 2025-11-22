from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LicenseViewSet, download_license

router = DefaultRouter()
router.register(r'license', LicenseViewSet, basename='license')

urlpatterns = [
    path('', include(router.urls)),  # includes /license/check_phone/
    path('license-download/', download_license, name='license-download'),  # ✅ FIXED
]
