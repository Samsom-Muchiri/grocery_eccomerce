# from django.http import JsonResponse
# from django.shortcuts import get_object_or_404
# from grocery.models import Order, Payment

# def checkout_order(request, order_id):
#     order = get_object_or_404(Order, pk=order_id)
#     total_amount = order.total_price

#     mpesa_api = MpesaApi(consumer_key="YOUR_CONSUMER_KEY",
#                          consumer_secret="YOUR_CONSUMER_SECRET",
#                          passkey="YOUR_PASSKEY")
    
#     STKPush = mpesa_api.lipa_na_mpesa_online(
#         ShortCode="YOUR_PAYBILL_SHORTCODE",
#         PartyA=request.user.phone_number,
#         CallBackURL="YOUR_CALLBACK_URL",
#         PhoneNumber=request.user.phone_number,
#         Amount=total_amount,
#         AccountReference="Order %s" % order.id,
#         TransactionDesc="Order Payment"
#     )

#     if STKPush["ResponseCode"] == 0:
#         return JsonResponse({"message": "Processing payment. Please check your phone for Mpesa prompt."})
#     else:
#         return JsonResponse({"error": STKPush["ResponseDescription"]}, status=400)

# def mpesa_callback(request):
#     response_data = request.POST.dict()

#     mpesa_api = MpesaApi(consumer_key="YOUR_CONSUMER_KEY",
#                          consumer_secret="YOUR_CONSUMER_SECRET",
#                          passkey="YOUR_PASSKEY")

#     # Verify Mpesa transaction using MpesaApi.query_transaction
#     transaction_status = mpesa_api.query_transaction(TransactionID=response_data["TransactionID"])

#     if transaction_status["ResultCode"] == 0:
#         order_id = response_data["AccountReference"].split()[1]  # Extract order ID
#         try:
#             order = Order.objects.get(pk=order_id)
#             order.payment_status = "successful"
#             order.payment = Payment.objects.create(amount=transaction_status["Amount"], mpesa_transaction_id=response_data["TransactionID"])
#             order.save()
#             # Process order fulfillment (shipped, delivered)
#             return JsonResponse({"message": "Payment confirmed."})
#         except Order.DoesNotExist:
#             return JsonResponse({"error": "Order not found."}, status=404)
#     else:
#         return JsonResponse({"error": transaction_status["ResultDesc"]})
