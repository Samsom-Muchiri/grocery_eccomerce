from rest_framework import serializers
from .models import Product, Order, Delivery, Cart, MpesaResponseBody, Payment, MobileMoneyPayment, Category, Tip, Subcategory


# class SendSTKPushSerializer(serializers.Serializer):
#     phone_payment_number = serializers.CharField()
#     # order_id = serializers.IntegerField()

#     # def validate_order_id(self, value):
#     #     try:
#     #         order = Order.objects.get(id=value)
#     #     except Order.DoesNotExist:
#     #         raise serializers.ValidationError("Order does not exist")
#     #     return value


#     def create(self, validated_data):
#         phone_payment_number = validated_data['phone_payment_number']
#         # order_id = validated_data['order_id']

#         # try:
#         #     order = Order.objects.get(id=order_id)
#         # except Order.DoesNotExist:
#         #     raise serializers.ValidationError("Order does not exist")
        
#         # amount = order.total_price
        

#         amount = 1

#         if str(phone_payment_number)[0] == "+":
#             phone_payment_number = phone_payment_number[1:]
#         elif str(phone_payment_number)[0] == "0":
#             phone_payment_number = "254" + phone_payment_number[1:]

#         callback_url = 'https://cae7-102-213-93-44.ngrok-free.app/mpesa/callback/'
#         payment = pay.stk_push(phone_payment_number=phone_payment_number, amount=amount, callback_url=callback_url)

#         res = payment.json()

#         return res
    

class MpesaResponseBodySerializer(serializers.ModelSerializer):
    class Meta:
        model = MpesaResponseBody
        fields = "__all__"

class ProductSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.picture and request.host:
            return f"{request.scheme}://{request.host}{obj.picture.url}"
        return None
    class Meta:
        model = Product
        fields = '__all__'

class TipSerializer(serializers.ModelSerializer):

    class Meta:
        model = Subcategory
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    tip = TipSerializer()
    class Meta:
        model = Order
        fields = '__all__'


class DeliverySerializer(serializers.ModelSerializer):
    class Meta:
        model = Delivery
        fields = '__all__' 

class CartSerializer(serializers.ModelSerializer):
    user_id = serializers.SerializerMethodField()

    def get_user_id(self, obj):
        return obj.user.id
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


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class SubcategorySerializer(serializers.ModelSerializer):
    category = CategorySerializer()

    class Meta:
        model = Subcategory
        fields = '__all__'

