from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import requests
import json
import datetime
import base64
from rest_framework import serializers

# Serializer classes
class MpesaRequestSerializer(serializers.Serializer):
    BusinessShortCode = serializers.CharField()
    Password = serializers.CharField()
    Timestamp = serializers.CharField()
    TransactionType = serializers.CharField(default='CustomerPayBillOnline')
    Amount = serializers.IntegerField()
    PartyA = serializers.CharField()
    PartyB = serializers.CharField()
    PhoneNumber = serializers.CharField()
    CallBackURL = serializers.URLField()
    AccountReference = serializers.CharField()
    TransactionDesc = serializers.CharField()

class MpesaCallbackSerializer(serializers.Serializer):
    ResultCode = serializers.IntegerField()
    TransactionID = serializers.CharField()

class AccessTokenRequestSerializer(serializers.Serializer):
    consumer_key = serializers.CharField()
    consumer_secret = serializers.CharField()

    def get_access_token(self):
        url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
        auth_string = f'{self.validated_data["consumer_key"]}:{self.validated_data["consumer_secret"]}'
        encoded_auth_string = base64.b64encode(auth_string.encode()).decode()
        
        headers = {
            'Authorization': f'Basic {encoded_auth_string}'
        }
        
        response = requests.get(url, headers=headers)
        
        print("Access Token Response:", response.status_code, response.text)

        if response.status_code == 200:
            return response.json().get('access_token')
        else:
            raise serializers.ValidationError("Error getting access token")

def generate_daraja_password(business_short_code, passkey, timestamp):
    password_str = business_short_code + passkey + timestamp
    password_bytes = password_str.encode("ascii")
    return base64.b64encode(password_bytes).decode("utf-8")

def build_stk_push_request(order_id, phone_number, amount):
    timestamp = datetime.datetime.now().strftime('%Y%m%d%H%M%S')
    business_short_code = settings.SAFARICOM_BUSINESS_SHORT_CODE
    passkey = settings.SAFARICOM_MPESA_PASSKEY
    password = generate_daraja_password(business_short_code, passkey, timestamp)

    data = {
        'BusinessShortCode': business_short_code,
        'Password': password,
        'Timestamp': timestamp,
        'TransactionType': 'CustomerPayBillOnline',
        'Amount': amount,
        'PartyA': phone_number,
        'PartyB': business_short_code,
        'PhoneNumber': phone_number,
        'CallBackURL': settings.MPESA_CALLBACK_URL,
        'AccountReference': order_id,
        'TransactionDesc': f'Payment for Order {order_id}'
    }
    return data

# Views
@csrf_exempt
def send_prompt(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        amount = data.get("amount")
        mobile_no = data.get("number")

        if not amount or not mobile_no:
            return JsonResponse({"error": "Missing required fields. Please provide amount and mobile_no."}, status=400)

        # Generate access token
        access_token_serializer = AccessTokenRequestSerializer(data={
            'consumer_key': settings.SAFARICOM_CONSUMER_KEY,
            'consumer_secret': settings.SAFARICOM_CONSUMER_SECRET
        })
        if access_token_serializer.is_valid():
            access_token = access_token_serializer.get_access_token()
            print("Access Token:", access_token)
        else:
            return JsonResponse({"error": "Invalid consumer key or secret."}, status=400)

        # Build STK push request data
        order_id = "1"
        stk_push_data = build_stk_push_request(order_id, mobile_no, amount)

        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {access_token}'
        }

        # Define the URL for the STK push endpoint
        stk_push_url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"

        print("STK Push Request Data:", json.dumps(stk_push_data, indent=2))
        print("Headers:", headers)

        # Send STK push request
        response = requests.post(stk_push_url, headers=headers, data=json.dumps(stk_push_data))


        print("STK Push Response:", response.status_code, response.text)
        

        if response.status_code == 200:
            result = response.json()
        else:
            result = {
                'status_code': response.status_code,
                'response_text': response.text
            }

        return JsonResponse(result, status=200, safe=False)

    return JsonResponse({"error": "Invalid request method."}, status=405)

@csrf_exempt
def send_prompt_res(request):
    return JsonResponse({"error": "This endpoint is not implemented."}, status=501)
