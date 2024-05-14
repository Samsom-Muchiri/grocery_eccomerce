from rest_framework import serializers
from .models import Product, Order, Delivery, Cart, MpesaResponseBody, Payment, MobileMoneyPayment
from ..MpesaViews.utils import MpesaGateWay

pay = MpesaGateWay()

class SendSTKPushSerializer(serializers.Serializer):
    phone_payment_number = serializers.CharField()
    amount = serializers.CharField()

    def validate_amount(self, attrs):
        amount = int(attrs)

        if amount <= 0:
            raise serializers.ValidationError(detail="Amount must be greater than 0")
        return amount


    def create(self, validated_data):
        phone_payment_number = validated_data['phone_payment_number']
        amount = validated_data['amount']

        if str(phone_payment_number)[0] == "+":
            phone_payment_number = phone_payment_number[1:]
        elif str(phone_payment_number)[0] == "0":
            phone_payment_number = "254" + phone_payment_number[1:]

        callback_url = ''
        payment = pay.stk_push(phone_payment_number=phone_payment_number, amount=amount, callback_url=callback_url)

        res = payment.json()

        return res
    

class MpesaResponseBodySerializer(serializers.ModelSerializer):
    class Meta:
        model = MpesaResponseBody
        fields = "__all__"

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
        
class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'


class DeliverySerializer(serializers.ModelSerializer):
    class Meta:
        model = Delivery
        fields = '__all__' 

class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = '__all__'

class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = '__all__'

class MobileMoneyPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = MobileMoneyPayment
        fields = '__all__'