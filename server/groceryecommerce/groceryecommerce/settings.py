import os
import dj_database_url
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


AUTH_USER_MODEL = 'grocery.User'

LOGIN_REDIRECT_URL = '/profile/' 

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-ud#9we6co+pt8x_&bmzf-0k&6gi&#q!snz9g*pnmsn_i61n9+d'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.auth',
    'rest_framework',
    'grocery',
    'drf_yasg',
    'corsheaders',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    # 'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

CSRF_COOKIE_SECURE = False
CSRF_COOKIE_HTTPONLY = False 

CSRF_TRUSTED_ORIGINS = []

CSRF_COOKIE_SAMESITE = None

CORS_ALLOW_ALL_ORIGINS = True


# CORS_ALLOWED_ORIGINS = [
#     'http://localhost:3000',
#     'https://grocery-ecommerce.vercel.app'
# ]


CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]
CORS_ALLOWED_HEADERS = [
    'accept',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]


ROOT_URLCONF = 'groceryecommerce.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
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

WSGI_APPLICATION = 'groceryecommerce.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

DATABASES["default"] = dj_database_url.parse("postgres://personalprojects_kqsm_user:kshxLVbDydW9FGW4Z93EeZxcPwOWBfHA@dpg-copiac779t8c73fuo970-a.oregon-postgres.render.com/groceryupdate")

# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

# if DEBUG:
#     STATICFILES_DIRS = [
#         os.path.join(BASE_DIR, 'static'),
#     ]
# else:
#     STATIC_ROOT = BASE_DIR / 'staticfiles'

STATIC_ROOT = BASE_DIR / 'staticfiles'

# URL to use when referring to static files located in STATIC_ROOT
STATIC_URL = '/static/'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'


DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

MPESA_ENVIRONMENT = 'sandbox'

SAFARICOM_BUSINESS_SHORT_CODE = '174379'
SAFARICOM_MPESA_PASSKEY = 'fb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'
SAFARICOM_CONSUMER_KEY = 'SnIVwrQBzAJZH9hIvXDAk0saTcfO9wjdnnOefNSH8T4TOpIA'
SAFARICOM_CONSUMER_SECRET = 'UKiw63DBGHBn4YqUT7AbeqIySIjJnKPhGlfepm5lUZZbiBGNTMfZ7IruKwZiPeak'
MPESA_CALLBACK_URL = 'https://cae7-102-213-93-44.ngrok-free.app/mpesa/callback/'
SAFARICOM_STK_PUSH_URL = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
