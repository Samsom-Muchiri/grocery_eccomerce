from rest_framework import serializers
from .models import Product, Order, Delivery, Cart, MpesaResponseBody, Payment, MobileMoneyPayment, Category, Tip, Subcategory, SavedItem


class SavedItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedItem
        fields = ['id', 'user', 'product', 'saved_at']
        read_only_fields = ['user', 'saved_at']

        
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()


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
    category_name = serializers.SerializerMethodField()
    subcategory_name = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'picture', 'price', 'quantity', 'availability',
            'discount', 'keywords', 'organic', 'created_at', 'updated_at', 'category_name', 'subcategory_name', 'image_url'
        ]
    
    def get_image_url(self, obj):
        request = self.context.get('request', None)
        if obj.picture and request:
            return request.build_absolute_uri(obj.picture.url)
        return None
    
    def get_category_name(self, obj):
        return obj.category.name if obj.category else None
    
    def get_subcategory_name(self, obj):
        return obj.subcategory.name if obj.subcategory else None
    

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


class CheckoutSerializer(serializers.Serializer):
    contact = serializers.CharField()
    delivery_country_name = serializers.CharField()
    delivery_first_name = serializers.CharField()
    delivery_second_name = serializers.CharField()
    delivery_address = serializers.CharField()
    delivery_city = serializers.CharField()
    delivery_postal_code = serializers.CharField()
    delivery_phone_number = serializers.CharField()
    tip_amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    