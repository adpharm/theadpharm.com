"""
Prod settings for this Django project
"""

import os
import environ
# from dotenv import load_dotenv
from .settings import *

# load_dotenv(".env.local")

env = environ.Env()

# Env vars
# django
DEBUG = env.bool("DEBUG", False)
SECRET_KEY = env.str("SECRET_KEY")
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", [])
CSRF_TRUSTED_ORIGINS = env.list("CSRF_TRUSTED_ORIGINS", [])
# email settings
DEFAULT_FROM_EMAIL = env.str("DEFAULT_FROM_EMAIL")
EMAIL_HOST_USER = env.str("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = env.str("EMAIL_HOST_PASSWORD")

CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

# TODO: run django-admin clearsessions to clean out expired sessions.
# see: https://docs.djangoproject.com/en/5.0/ref/django-admin/#clearsessions

# configuring static files (whitenoise)
STATIC_ROOT = os.path.join(BASE_DIR, 'static_tmp', 'static')
STORAGES = {
    # ...
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}


# TODO: cloudfront for static files(?): https://whitenoise.readthedocs.io/en/stable/django.html#instructions-for-amazon-cloudfront
