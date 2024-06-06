import json
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from grocery.models import Order, MobileMoneyPayment, MpesaResponseBody
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

@csrf_exempt
def mpesa_payment_callback(request):
    if request.method == 'POST':
        data = json.loads(request.body)
    elif request.method == 'GET':
        data = request.GET.dict()
    else:
        return HttpResponse(status=405, content="Method Not Allowed")

    if 'Body' in data and 'stkCallback' in data['Body']:
        mpesa_response = data['Body']['stkCallback']
    elif 'Body' in data:
        mpesa_response = data['Body']
    else:
        return JsonResponse({'error': 'Invalid callback data'}, status=400)

    mpesa_response_body = MpesaResponseBody.objects.create(body=mpesa_response)
    transaction_id = mpesa_response.get('CheckoutRequestID')
    
    if not transaction_id:
        return JsonResponse({'error': 'Invalid transaction ID'}, status=400)
    
    try:
        payment = MobileMoneyPayment.objects.get(mpesa_transaction_id=transaction_id)
    except MobileMoneyPayment.DoesNotExist:
        return JsonResponse({'error': 'Payment not found'}, status=404)

    if mpesa_response.get('ResultCode') == 0:
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
