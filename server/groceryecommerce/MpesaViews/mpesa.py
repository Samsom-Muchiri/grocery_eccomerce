from django.conf import settings
from django_daraja.mpesa.core import MpesaClient as DarajaMpesaClient
import base64
import hashlib
import datetime


class CustomDarajaMpesaClient(DarajaMpesaClient):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.initiator_name = kwargs.get('initiator_name')
        self.shortcode = kwargs.get('shortcode')
        self.passkey = kwargs.get('passkey')

    def generate_password(self, shortcode, passkey):
        timestamp = self.generate_timestamp()
        data = f"{shortcode}{passkey}{timestamp}"
        encoded = base64.b64encode(data.encode('utf-8')).decode('utf-8')
        return encoded

    def generate_timestamp(self):
        timestamp = datetime.datetime.now().strftime('%Y%m%d%H%M%S')
        return timestamp

    def stk_push(self, phone_number, amount, reference, transaction_desc, callback_url):
        response = self.stk_push_simulation(
            business_short_code=settings.MPESA_SHORTCODE,
            password=self.generate_password(settings.MPESA_SHORTCODE, settings.MPESA_PASSKEY),
            timestamp=self.generate_timestamp(),
            amount=amount,
            phone_number=phone_number,
            callback_url=callback_url,
            reference=reference,
            transaction_desc=transaction_desc,
        )
        return response
    
def get_mpesa_client():
    return CustomDarajaMpesaClient(
        consumer_key=settings.MPESA_CONSUMER_KEY,
        consumer_secret=settings.MPESA_CONSUMER_SECRET,
        environment=settings.MPESA_ENVIRONMENT,
        passkey=settings.MPESA_PASSKEY,
        initiator_name=settings.MPESA_INITIATOR_NAME,
        shortcode=settings.MPESA_SHORTCODE
    )