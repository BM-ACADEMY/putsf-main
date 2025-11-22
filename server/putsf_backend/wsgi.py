"""
WSGI config for putsf_backend project.

This file exposes the WSGI callable as a module-level variable named `application`.
It also ensures the project root is in Python path so local apps like `accounts` can be imported.
"""

import os
import sys

# ----------------------------
# Add project root to Python path
# ----------------------------
# This allows Python to find `putsf_backend` and its apps
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

# ----------------------------
# Django settings module
# ----------------------------
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'putsf_backend.settings')

# ----------------------------
# WSGI application
# ----------------------------
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()

# ----------------------------
# Optional: print Python version for debug
# ----------------------------
import platform
print(f"WSGI running with Python {platform.python_version()}")
