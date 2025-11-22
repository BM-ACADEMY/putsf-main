import os
from pathlib import Path
from pymongo import MongoClient
from dotenv import load_dotenv

# -----------------------------
# Base Directory
# -----------------------------
BASE_DIR = Path(__file__).resolve().parent.parent

# -----------------------------
# Load environment variables
# -----------------------------
load_dotenv(BASE_DIR / ".env")           # main .env
load_dotenv(BASE_DIR / ".env.local", override=True)  # local overrides if exists

# -----------------------------
# Security
# -----------------------------
SECRET_KEY = os.getenv("SECRET_KEY", "fallback-secret-key")
DEBUG = os.getenv("DEBUG", "False").lower() in ["true", "1", "yes"]

# -----------------------------
# Allowed Hosts
# -----------------------------
RENDER_EXTERNAL_HOSTNAME = os.getenv("RENDER_EXTERNAL_HOSTNAME")

ALLOWED_HOSTS = [
    "putsf.com",
    "www.putsf.com",
    "putsf1.onrender.com",
    "putsf1-frontend.onrender.com",
    "127.0.0.1",
    "localhost",
]

if RENDER_EXTERNAL_HOSTNAME:
    ALLOWED_HOSTS.append(RENDER_EXTERNAL_HOSTNAME)

# -----------------------------
# Installed Apps
# -----------------------------
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django_extensions',

    # Third-party
    'corsheaders',
    'rest_framework',

    # Local apps
    "putsf_backend.accounts",
    "putsf_backend.gallery",
    "putsf_backend.blog",
    "putsf_backend.banner",
    "putsf_backend.license",
    "putsf_backend.complaints",
]

# -----------------------------
# Middleware
# -----------------------------
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# -----------------------------
# URL Configuration
# -----------------------------
ROOT_URLCONF = 'putsf_backend.urls'

# -----------------------------
# Templates
# -----------------------------
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / "templates", BASE_DIR / "putsf_backend" / "templates"],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# -----------------------------
# WSGI
# -----------------------------
WSGI_APPLICATION = 'putsf_backend.wsgi.application'

# -----------------------------
# Database (SQLite default)
# -----------------------------
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# -----------------------------
# MongoDB Connection
# -----------------------------
MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME")

_db = None

def get_db():
    """Return MongoDB connection instance if configured"""
    global _db
    if _db is None:
        if MONGO_URI and MONGO_DB_NAME:
            try:
                client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
                client.admin.command('ping')
                _db = client[MONGO_DB_NAME]
                if DEBUG:
                    print(f"✅ Connected to MongoDB: {MONGO_DB_NAME}")
            except Exception as e:
                _db = None
                if DEBUG:
                    print(f"⚠️ MongoDB connection failed: {e}. Skipping MongoDB.")
        else:
            if DEBUG:
                print("⚠️ MONGO_URI or MONGO_DB_NAME not set. Skipping MongoDB.")
    return _db


# Make get_db accessible via settings
from django.conf import settings as django_settings
django_settings.get_db = get_db

# -----------------------------
# Password Validation
# -----------------------------
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# -----------------------------
# Internationalization
# -----------------------------
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# -----------------------------
# Static & Media
# -----------------------------
STATIC_URL = '/static/'
STATIC_ROOT = '/root/arshad/Putsf/server/static'
STATICFILES_DIRS = [
    '/root/arshad/Putsf/server/putsf_backend/static',
]




# -----------------------------
# Site Domain & Media URL
# -----------------------------
# if DEBUG:
#     SITE_DOMAIN = "https://putsf.com"
# else:
#     SITE_DOMAIN = "http://127.0.0.1:8000"
if DEBUG:
    SITE_DOMAIN = "http://127.0.0.1:8000"
else:
    SITE_DOMAIN = "https://putsf.com"

MEDIA_URL = '/media/'
MEDIA_ROOT = '/var/www/putsf_media'



# -------------------se----------
# CORS
# -----------------------------
# CORS_ALLOWED_ORIGINS = [
#     "https://putsf.com",
#     "https://www.putsf.com",
# ]
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

CSRF_TRUSTED_ORIGINS = [
    "https://putsf.com",
    "https://www.putsf.com",
]



CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]


SECURE_CROSS_ORIGIN_OPENER_POLICY = None

# -----------------------------
# Custom User Model
# -----------------------------
AUTH_USER_MODEL = "accounts.AdminUser"

# -----------------------------
# REST Framework
# -----------------------------
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ]
}
from datetime import timedelta

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=5),   # short access token (auto-refresh)
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),     # stay logged in 7 days
    "ROTATE_REFRESH_TOKENS": True,                   # generate new refresh token each time
    "BLACKLIST_AFTER_ROTATION": True,
    "UPDATE_LAST_LOGIN": False,
    "AUTH_HEADER_TYPES": ("Bearer",),
}


# -----------------------------
# Other settings
# -----------------------------
APPEND_SLASH = True
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
