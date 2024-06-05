import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from grocery.models import Order, MobileMoneyPayment, MpesaResponseBody
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

@csrf_exempt
def mpesa_payment_callback(request):
    data = json.loads(request.body)
    mpesa_response = data['Body']['stkCallback']

    mpesa_response_body = MpesaResponseBody.objects.create(body=mpesa_response)
    transaction_id = mpesa_response['CheckoutRequestID']
    payment = MobileMoneyPayment.objects.get(mpesa_transaction_id=transaction_id)

    if mpesa_response['ResultCode'] == 0:
        payment.status = 'successful'
        payment.save()
        
        order = Order.objects.get(payment=payment)
        order.status = 'paid'
        order.save()

        # Notify frontend via WebSocket
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            'order_status', {
                'type': 'order_status_update',
                'order_id': order.id,
                'status': order.status
            }
        )
    else:
        payment.status = 'failed'
        payment.save()

    return JsonResponse({'message': 'Callback received successfully'})
