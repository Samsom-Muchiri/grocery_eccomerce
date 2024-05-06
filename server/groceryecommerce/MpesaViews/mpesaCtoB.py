from django.http.response import JsonResponse
from grocery.models import Order, Payment
from django_daraja.mpesa.core import MpesaClient


def checkout_order(request, order_id):
    order = Order.objects.get(pk=order_id)
    total_amount = order.total_price

    # Replace with your Mpesa credentials
    mpesa_api = MpesaApi(consumer_key="mn3rPg0kJSeFbmzBG2p0Il43YhKg0gxgAfxroObN1DKTC2vm",
                         consumer_secret="d2CRu5vYhjTkHm0IkTPQu6MT2EpQpfFFd6b5sCqpqNucEtbyV9oeTp9v6zUmp7N7",
                         passkey="were12")
    cl = MpesaClient()

    # Use Lipa na Mpesa Online (STK Push)
    STKPush = mpesa_api.lipa_na_mpesa_online(
        ShortCode="PAYBILL_SHORTCODE",
        PartyA="YOUR_BUSINESS_SHORTCODE",  # Replace with your Lipa na Mpesa Till Number
        CallBackURL="YOUR_CALLBACK_URL",    # URL for receiving Mpesa confirmation
        PhoneNumber=request.user.phone_number,  # User's phone number
        Amount=total_amount,
        AccountReference="Order %s" % order.id,  # Order reference for identification
        TransactionDesc="Order Payment"
    )

    if STKPush["ResponseCode"] == 0:
        # Mpesa request initiated successfully
        return JsonResponse({"message": "Processing payment. Please check your phone for Mpesa prompt."})
    else:
        # Handle Mpesa request failure
        return JsonResponse({"error": STKPush["ResponseDescription"]}, status=status.HTTP_400_BAD_REQUEST)


def mpesa_callback(request):
    # Parse Mpesa response data (use django-mpesa library)
    response_data = request.POST.dict()

    # Initialize MpesaApi
    mpesa_api = MpesaApi(consumer_key="YOUR_CONSUMER_KEY",
                         consumer_secret="YOUR_CONSUMER_SECRET",
                         passkey="YOUR_PASSCODE")

    # Verify Mpesa transaction using MpesaApi.query_transaction
    transaction_status = mpesa_api.query_transaction(TransactionID=response_data["TransactionID"])

    if transaction_status["ResultCode"] == 0:
        # Payment successful
        order_id = response_data["AccountReference"].split()[1]  # Extract order ID
        try:
            order = Order.objects.get(pk=order_id)
            order.payment_status = "successful"
            order.payment = Payment.objects.create(amount=transaction_status["Amount"], mpesa_transaction_id=response_data["TransactionID"])
            order.save()
            # Process order fulfillment (shipped, delivered)
            return JsonResponse({"message": "Payment confirmed."})
        except Order.DoesNotExist:
            # Handle case where order is not found
            return JsonResponse({"error": "Order not found."}, status=404)
    else:
        # Payment failed
        return JsonResponse({"error": transaction_status["ResultDesc"]})
