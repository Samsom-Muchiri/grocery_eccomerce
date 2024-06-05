from django.conf import settings
from django_daraja.mpesa.core import MpesaClient

def get_mpesa_client():
    return MpesaClient(
        settings.MPESA_CONSUMER_KEY,
        settings.MPESA_CONSUMER_SECRET,
        settings.MPESA_SHORTCODE,
        settings.MPESA_PASSKEY,
        settings.MPESA_CALLBACK_URL,
        settings.MPESA_ENVIRONMENT
    )
