from django.views.decorators.csrf import csrf_exempt
from django.forms.models import model_to_dict
from rest_framework import views, response, status
from grocery.serializers import SendSTKPushSerializer, MpesaResponseBodySerializer, MobileMoneyPaymentSerializer
from grocery.models import MpesaResponseBody, MobileMoneyPayment, Payment, Order

class SendSTKPushView(views.APIView):
    @csrf_exempt
    def post(self, request, format=None):
        serializer = SendSTKPushSerializer(data=request.data)
        if serializer.is_valid():
            order_id = serializer.validated_data.get('order_id')
            phone_payment_number = serializer.validated_data.get('phone_payment_number')

            res = serializer.save()
            return response.Response(res, status=status.HTTP_200_OK)
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class MpesaCallbackView(views.APIView):
    @csrf_exempt
    def post(self, request, format=None):
        body = request.data

        if body:
            mpesa = MpesaResponseBody.objects.create(body=body)

            mpesa_body = mpesa.body

            if mpesa_body['stkCallback']['ResultCode'] == 0:
                payment = MobileMoneyPayment.objects.create(
                    amount=mpesa_body['Body']['stkCallback']['CallbackMetadata']['Item'][0]["Value"],
                    mpesa_transaction_id=mpesa_body['Body']['stkCallback']['CallbackMetadata']['Item'][1]["Value"],
                    phone_payment_number=mpesa_body['Body']['stkCallback']['CallbackMetadata']['Item'][-1]["Value"],
                )
                
                order = Order.objects.get(id=mpesa_body['Body']['stkCallback']['CallbackMetadata']['Item'][1]["Value"])  # Assuming transaction ID is order ID
                order.status = 'paid'
                order.save()

            return response.Response({"message": "Callback received and processed successfully."})
        return response.Response({"failed": "No Callback Received"}, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request, format=None):
        response_bodies = MpesaResponseBody.objects.all()
        serializer = MpesaResponseBodySerializer(response_bodies, many=True)

        return response.Response({"responses": serializer.data})
    
class MobileMoneyPaymentView(views.APIView):
    def get(self, request):
        payments = MobileMoneyPayment.objects.all()
        serializer = MobileMoneyPaymentSerializer(payments, many=True)

        return response.Response({"payments": serializer.data})
