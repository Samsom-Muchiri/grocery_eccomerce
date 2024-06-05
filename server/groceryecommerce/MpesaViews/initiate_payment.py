import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from grocery.models import Order, MobileMoneyPayment, MpesaResponseBody
# from django_daraja.mpesa.core import MpesaClient
from .mpesa import get_mpesa_client


@login_required
@csrf_exempt
def initiate_payment(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        order_id = data.get('order_id')
        phone_number = data.get('phone_number')

        try:
            order = Order.objects.get(id=order_id, user=request.user)
            total_amount = order.total_amount

            cl = get_mpesa_client()
            stk_response = cl.stk_push(phone_number, total_amount, 'reference', 'description')
            
            if stk_response.is_successful:
                mpesa_response = MpesaResponseBody.objects.create(body=stk_response.response)
                payment = MobileMoneyPayment.objects.create(
                    amount=total_amount,
                    status='pending',
                    mpesa_response=mpesa_response,
                    phone_payment_number=phone_number,
                    provider='Mpesa'
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
