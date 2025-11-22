from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .views import home

urlpatterns = [
    path("", home, name="home"),
    path("admin-django/", admin.site.urls),
    path("api/admin/", include("putsf_backend.accounts.urls")),
    path("api/gallery/", include("putsf_backend.gallery.urls")),
    path("api/", include("putsf_backend.banner.urls")),
    path("api/blog/", include("putsf_backend.blog.urls")),
    path('api/', include('putsf_backend.license.urls')),
    path("api/", include("putsf_backend.complaints.urls")),
    ]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])