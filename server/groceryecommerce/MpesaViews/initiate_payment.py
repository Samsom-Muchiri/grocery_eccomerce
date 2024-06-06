import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from grocery.models import Order, MobileMoneyPayment, MpesaResponseBody
from django_daraja.mpesa.core import MpesaClient
# from .mpesa import get_mpesa_client
import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
handler = logging.StreamHandler()
handler.setFormatter(formatter)
logger.addHandler(handler)


@login_required
@csrf_exempt
def initiate_payment(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        order_id = data.get('order_id')
        phone_number = data.get('phone_number')

        try:
            order = Order.objects.get(id=order_id, user=request.user)
            total_amount = int(order.total_amount)
            reference = 'reference'

            cl = MpesaClient()
            transaction_desc = f"Payment for Order #{order.id}"
            callback_url = 'https://6240-102-213-93-26.ngrok-free.app/callback'
            
            response = cl.stk_push(phone_number, total_amount, reference, transaction_desc, callback_url)
            
            logger.debug("Mpesa Response:", response)


            if response.get('ResultCode') == 0:
                mpesa_response = MpesaResponseBody.objects.create(body=stk_response.response)
                payment = MobileMoneyPayment.objects.create(
                    amount=total_amount,
                    status='pending',
                    mpesa_response=mpesa_response,
                    phone_payment_number=phone_number,
                    provider='Mpesa',
                    mpesa_transaction_id=response['CheckoutRequestID']
                )
                order.payment = payment
                order.save()

                return JsonResponse({'message': 'Payment initiated successfully', 'order_id': order.id})
            else:
                return JsonResponse({'error': 'Payment initiation failed'}, status=400)

        except Order.DoesNotExist:
            return JsonResponse({'error': 'Order not found'}, status=404)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
