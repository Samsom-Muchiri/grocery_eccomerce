from django.shortcuts import render
from django.http import JsonResponse
from .models import Product, Order, User, Payment, CreditCardPayment, MobileMoneyPayment, Delivery
import json
from django import forms
from django.contrib.auth.decorators import login_required
from django.views.generic.edit import CreateView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .forms import UserProfileForm, PaymentForm
from .serializers import ProductSerializer, OrderSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.forms import UserCreationForm
from django.utils.decorators import method_decorator



def home(request):
    return render(request, 'home.html')

class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = User

    def clean_username(self):
        username = self.cleaned_data['username']
        User = self.Meta.model
        try:
            User.objects.get(username=username)
        except User.DoesNotExist:
            return username
        raise forms.ValidationError('This username is already taken. Please choose a different one.')

# View to handle user registration
class UserRegisterView(CreateView):
    form_class = CustomUserCreationForm
    # form_class = UserCreationForm
    template_name = 'registration/register.html'
    success_url = '/login/'

class UserProfileView(APIView):
    @method_decorator(login_required)
    def get(self, request):
        form = UserProfileForm(instance=request.user)
        return render(request, 'profile.html', {'form': form})

    def post(self, request):
        form = UserProfileForm(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            return JsonResponse({'message': 'Profile updated successfully'})
        else:
            return JsonResponse({'error': 'Invalid data'}, status=400)

class PaymentView(APIView):
    def post(self, request):
        form = PaymentForm(request.POST)
        if form.is_valid():
            # Process payment logic
            return JsonResponse({'message': 'Payment successful'})
        else:
            return JsonResponse({'error': 'Invalid data'}, status=400)

class ProductListView(APIView):
    @swagger_auto_schema(operation_id='list_products', responses={200: openapi.Response(description="List of products", schema=ProductSerializer(many=True))})
    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

class OrderListView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(operation_id='list_orders', responses={200: openapi.Response(description="List of orders", schema=OrderSerializer(many=True))})
    def get(self, request):
        orders = Order.objects.filter(user=request.user)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

class OrderDetailView(APIView):
    @swagger_auto_schema(
        operation_id='view_order',
        manual_parameters=[openapi.Parameter('order_id', openapi.IN_PATH, type=openapi.TYPE_INTEGER, description='Order ID')],
        responses={200: openapi.Response(description="Order details", schema=OrderSerializer),
                   404: openapi.Response(description="Order not found")}
    )
    def get(self, request, order_id):
        try:
            order = Order.objects.get(id=order_id)
            serializer = OrderSerializer(order)
            return Response(serializer.data)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
        
class CreateOrderView(APIView):
    @swagger_auto_schema(operation_id='create_order', request_body=openapi.Schema(
        type='object',
        properties={
            'products': openapi.Schema(type='array', items=openapi.Schema(type='integer')),
        }
    ), responses={200: openapi.Response(description="Order created successfully", schema=openapi.Schema(
        type='object',
        properties={
            'success': openapi.Schema(type='boolean'),
            'order_id': openapi.Schema(type='integer'),
        }
    )), 400: openapi.Response(description="Bad request")})
    def post(self, request):
        try:
            order_data = json.loads(request.body.decode('utf-8'))
            products = order_data.get('products', [])
            total_price = sum(Product.objects.filter(id__in=products).values_list('price', flat=True))
            order = Order.objects.create(
                user=request.user,
                total_price=total_price,
                status='pending'
            )
            order.products.add(*products)
            return Response({'success': True, 'order_id': order.id})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class DeliveryListView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_id='get_delivery_status',
        manual_parameters=[
            openapi.Parameter(
                name='order_id',
                in_=openapi.IN_PATH,
                type=openapi.TYPE_INTEGER,
                description='Order ID'
            )
        ],
        responses={200: openapi.Response(
            description='Order delivery status',
            schema=openapi.Schema(
                type='object',
                properties={'status': openapi.Schema(type='string')}
            )
        )}
    )
    def get(self, request, order_id):
        """
        Get the delivery status of an order.
        """
        try:
            order = Order.objects.get(pk=order_id)
            status = order.status
            return Response({'status': status})
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

    @swagger_auto_schema(
        operation_id='update_delivery_status',
        manual_parameters=[
            openapi.Parameter(
                name='order_id',
                in_=openapi.IN_PATH,
                type=openapi.TYPE_INTEGER,
                description='Order ID'
            )
        ],
        request_body=openapi.Schema(
            type='object',
            properties={'delivered': openapi.Schema(type='boolean', description='Mark delivery as completed')}
        ),
        responses={
            200: openapi.Response(description='Order status updated successfully'),
            400: openapi.Response(description='Delivery confirmation not provided or Delivery not found')
        }
    )
    def patch(self, request, order_id):
        """
        Update the delivery status of an order to "delivered" if the request data confirms delivery.
        """
        try:
            delivery = Delivery.objects.get(pk=order_id)
            order = delivery.order

            if request.data.get('delivered', False):
                order.status = 'delivered'
                order.save()
                return Response({'message': 'Order status updated to delivered'})
            else:
                return Response({'error': 'Delivery confirmation not provided'}, status=status.HTTP_400_BAD_REQUEST)

        except Delivery.DoesNotExist:
            return Response({'error': 'Delivery not found'}, status=status.HTTP_404_NOT_FOUND)