import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from grocery.models import Order, MobileMoneyPayment, MpesaResponseBody
from django_daraja.mpesa.core import MpesaClient

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
            
            try:
                response = cl.stk_push(phone_number, total_amount, reference, transaction_desc, callback_url)
                print("Mpesa Response:", response)
                print("Response Status Code:", response.status_code)
                print("Response Content:", response.content)

                if response.status_code == 200:
                    response_data = response.json()
                    if response_data.get('ResponseCode') == '0':
                        mpesa_response = MpesaResponseBody.objects.create(body=response_data)
                        payment = MobileMoneyPayment.objects.create(
                            amount=total_amount,
                            status='pending',
                            mpesa_response=mpesa_response,
                            phone_payment_number=phone_number,
                            provider='Mpesa',
                            mpesa_transaction_id=response_data['CheckoutRequestID']
                        )
                    
                        order.payment = payment
                        order.save()

                        return JsonResponse({'message': 'Payment initiated successfully', 'order_id': order.id})
                    else:
                        error_message = response_data.get('errorMessage', 'Payment initiation failed')
                        print(f"Mpesa STK Push Error: {error_message}")
                        return JsonResponse({'error': error_message}, status=400)
                else:
                    error_message = response.get('errorMessage', 'Payment initiation failed')
                    print(f"Mpesa STK Push Error: {error_message}")
                    return JsonResponse({'error': error_message}, status=400)

            except Exception as e:
                print("Exception occurred during Mpesa STK push request")
                return JsonResponse({'error': str(e)}, status=500)

        except Order.DoesNotExist:
            return JsonResponse({'error': 'Order not found'}, status=404)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
