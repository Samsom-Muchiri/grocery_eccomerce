from django.conf import settings
import requests
import json
import base64
import datetime
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import serializers
from rest_framework.decorators import api_view
from rest_framework.response import Response
from grocery.models import MobileMoneyPayment, Order, MpesaResponseBody


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
    

def generate_daraja_password(business_short_code, passkey, timestamp):
    password_str = business_short_code + passkey + timestamp
    password_bytes = password_str.encode("ascii")
    return base64.b64encode(password_bytes).decode("utf-8")


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
        'Amount': amount,
        'PartyA': phone_number,
        'PartyB': business_short_code,
        'PhoneNumber': phone_number,
        'CallBackURL': settings.MPESA_CALLBACK_URL,
        'AccountReference': order_id,
        'TransactionDesc': f'Payment for Order {order_id}'
    }
    return data

@api_view(['POST'])
def initiate_mpesa_stk_push(request):
    access_token_serializer = AccessTokenRequestSerializer(data={
        'consumer_key': settings.SAFARICOM_CONSUMER_KEY,
        'consumer_secret': settings.SAFARICOM_CONSUMER_SECRET
    })
    if access_token_serializer.is_valid():
        try:
            access_token = access_token_serializer.get_access_token()
        except serializers.ValidationError as e:
            return Response({'status': 'error', 'message': str(e)}, status=500)

        phone_number = request.data.get('phone_number')
        order_id = 1
        amount = 1

        data = build_stk_push_request(order_id, phone_number, amount)
        serializer = MpesaRequestSerializer(data=data)

        if serializer.is_valid():
            url = settings.SAFARICOM_STK_PUSH_URL
            headers = {
                'Authorization': f'Bearer {access_token}',
                'Content-Type': 'application/json'
            }

            try:
                response = requests.post(url, headers=headers, json=serializer.validated_data)
                response.raise_for_status()
                
                mpesa_response_body = MpesaResponseBody.objects.create(body=response.json())

                mobile_money_payment = MobileMoneyPayment.objects.create(
                    phone_payment_number=phone_number,
                    provider='Mpesa',
                    amount=amount,
                    status='pending',
                    mpesa_response=mpesa_response_body
                )
                return Response({'status': 'success', 'payment_id': mobile_money_payment.id})
            except requests.exceptions.RequestException as e:
                print(f"Error initiating STK Push: {e}")
                return Response({'status': 'error', 'message': str(e)}, status=500)
        else:
            return Response(serializer.errors, status=400)
    else:
        return Response(access_token_serializer.errors, status=400)

@api_view(['POST'])
def mpesa_callback(request):
    serializer = MpesaCallbackSerializer(data=request.data)
    if serializer.is_valid():
        mpesa_data = serializer.validated_data
        process_mpesa_payment(mpesa_data)
        return Response({'status': 'success'})
    else:
        return Response(serializer.errors, status=400)

def process_mpesa_payment(mpesa_data):
    result_code = mpesa_data.get('ResultCode')
    transaction_id = mpesa_data.get('TransactionID')

    payment = MobileMoneyPayment.objects.filter(
        mpesa_response__body__TransactionID=transaction_id).first()

    if payment and result_code == 0:
        payment.status = 'successful'
        payment.save()

        payment.order.status = 'paid'
        payment.order.save()
    else:
        if payment:
            payment.status = 'failed'
            payment.save()

    MpesaResponseBody.objects.create(body=mpesa_data)


def validate_mpesa_data(mpesa_data):
    # validation logic will be done here
    return True
