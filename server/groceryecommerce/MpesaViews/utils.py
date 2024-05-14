import logging
import time
import base64
import requests
import os

from datetime import datetime
from requests.auth import HTTPBasicAuth
from requests import Response
from MpesaViews.exeptions import *
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

logging = logging.getLogger("default")
now = datetime.now()

class MpesaResponse(Response):
	response_description = ""
	error_code = None
	error_message = ''


def mpesa_response(r):
	"""
	Create MpesaResponse object from requests.Response object
	
	Arguments:
		r (requests.Response) -- The response to convert
	"""

	r.__class__ = MpesaResponse
	json_response = r.json()
	r.response_description = json_response.get('ResponseDescription', '')
	r.error_code = json_response.get('errorCode')
	r.error_message = json_response.get('errorMessage', '')
	return r

class MpesaGateWay:
    def __init__(self):
        self.business_shortcode =  os.environ.get("BUSINESS_SHORTCODE")
        self.consumer_key =  os.environ.get("CONSUMER_KEY")
        self.consumer_secret =  os.environ.get("CONSUMER_SECRET")
        self.access_token_url =  os.environ.get("ACCESS_TOKEN_URL")
        self.password = self.generate_password()
        self.checkout_url =  os.environ.get("CHECKOUT_URL")

        try:
            self.access_token = self.getAccessToken()
            if self.access_token is None:
                raise Exception("Request for access token failed.")
        except Exception as e:
            logging.error("Error {}".format(e))
        else:
            self.access_token_expiration = time.time() + 3400

    def getAccessToken(self):
        try:
            res = requests.get(self.access_token_url, auth=HTTPBasicAuth(self.consumer_key, self.consumer_secret))
            token = res.json()["access_token"]
            self.headers = {"Authorization": "Bearer %s" % token}
            return token
        except Exception as err:
            logging.error("Error {}".format(err))
            return None

    class Decorators:
        @staticmethod
        def refreshToken(decorated):
            def wrapper(gateway, *args, **kwargs):
                if (gateway.access_token_expiration and time.time() > gateway.access_token_expiration):
                    token = gateway.getAccessToken()
                    gateway.access_token = token
                return decorated(gateway, *args, **kwargs)

            return wrapper


    def generate_password(self):
        self.timestamp = now.strftime("%Y%m%d%H%M%S")
        password_str = os.environ.get("BUSINESS_SHORTCODE") + os.environ.get("PASS_KEY") + self.timestamp
        password_bytes = password_str.encode("ascii")
        return base64.b64encode(password_bytes).decode("utf-8")
    

    @Decorators.refreshToken
    def stk_push(self, phone_payment_number, amount, callback_url):
        if not isinstance(amount, int):
            raise MpesaInvalidParameterException('Amount must be an integer')
    
        request_data = {
            "BusinessShortCode": self.business_shortcode,
            "Password": self.password,
            "Timestamp": self.timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": amount,
            "PartyA": phone_payment_number,
            "PartyB": self.business_shortcode,
            "PhoneNumber": phone_payment_number,
            "CallBackURL": callback_url,
            "AccountReference": "Mpesa Payment",
            "TransactionDesc": "Payment",
        }

        try:
            res = requests.post(self.checkout_url, json=request_data, headers=self.headers, timeout=30)
            response = mpesa_response(res)

            return response
        except requests.exceptions.ConnectionError:
            raise MpesaConnectionError('Connection failed')
        except Exception as ex:
            raise MpesaConnectionError(str(ex))
        