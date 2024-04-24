from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from .models import Product, Order, User, Payment, CreditCardPayment, MobileMoneyPayment, Delivery, Cart
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
from .serializers import DeliverySerializer, CartSerializer
from django.contrib.sessions.models import Session
from rest_framework import generics


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

    @swagger_auto_schema(
        operation_id='user_register',
        responses={200: openapi.Response(description="User registered successfully")}
    )
    def post(self, request, *args, **kwargs):
        """
        Register a new user.
        """
        return super().post(request, *args, **kwargs)
    

class UserProfileView(APIView):
    @method_decorator(login_required)
    @swagger_auto_schema(
        operation_id='user_profile',
        responses={200: openapi.Response(description="User profile details"),
                   401: openapi.Response(description="Unauthorized")}
    )
    def get(self, request):
        form = UserProfileForm(instance=request.user)
        return render(request, 'profile.html', {'form': form})

    def post(self, request):
        user_instance = get_object_or_404(User, pk=request.user.pk)
        form = UserProfileForm(request.POST, instance=user_instance)
        if form.is_valid():
            form.save()
            return JsonResponse({'message': 'Profile updated successfully'})
        else:
            errors = form.errors.as_json()
            print(errors)  
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
        """
        Get a list of products.
        """
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

class OrderListView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(operation_id='list_orders', responses={200: openapi.Response(description="List of orders", schema=OrderSerializer(many=True))})
    def get(self, request):
        """
        Get a list of orders for authenticated user.
        """
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
        """
        Get details of a specific order.
        """
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
        """
        Create a new order.
        """
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

class DeliveryDetailView(APIView):
    @swagger_auto_schema(
        operation_id='get_delivery_details',
        manual_parameters=[
            openapi.Parameter(
                name='delivery_id',
                in_=openapi.IN_PATH,
                type=openapi.TYPE_INTEGER,
                description='Delivery ID'
            )
        ],
        responses={
            200: openapi.Response(description='Delivery details', schema=DeliverySerializer()),
            404: openapi.Response(description='Delivery not found')
        }
    )
    def get(self, request, delivery_id):
        """
        Get details of a specific delivery.
        """
        try:
            delivery = Delivery.objects.get(pk=delivery_id)
            serializer = DeliverySerializer(delivery)
            return Response(serializer.data)
        except Delivery.DoesNotExist:
            return Response({'error': 'Delivery not found'}, status=status.HTTP_404_NOT_FOUND)

class ProductListByCategory(generics.ListAPIView):
    serializer_class = ProductSerializer

    @swagger_auto_schema(
        operation_id='list_products_by_category',
        responses={200: openapi.Response(description="List of products by category", schema=ProductSerializer(many=True))}
    )
    def get_queryset(self):
        """
        Get a list of products by category.
        """
        category = self.kwargs['category']
        return Product.objects.filter(category=category)


class AddToCart(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_id='add_to_cart',
        responses={200: openapi.Response(description="Item added to cart successfully")},
    )
    def post(self, request):
        try:
            data = json.loads(request.body)
            product_ids = data.get('product_ids', [])

            cart, created = Cart.objects.get_or_create(user=request.user)
            products = Product.objects.filter(id__in=product_ids)

            cart.products.add(*products)

            return Response({'success': True, 'message': 'Item(s) added to cart successfully'})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UpdateCart(generics.UpdateAPIView):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer

    @swagger_auto_schema(
        operation_id='update_cart',
        responses={200: openapi.Response(description="Cart updated successfully"),
                   400: openapi.Response(description="Bad request")}
    )
    def update(self, request, *args, **kwargs):
        """
        Update the cart.
        """
        instance = self.get_object()
        data = request.data

        if 'products' in data:
            # If the 'products' key is present and the value is an empty list,
            if data['products'] == []:
                instance.products.clear()
                return Response({'detail': 'Cart cleared successfully'}, status=status.HTTP_200_OK)

            # If 'products' key is present and is not empty,
            # update the products in the cart
            else:
                product_ids = data['products']
                products = Product.objects.filter(id__in=product_ids)
                instance.products.set(products)

                return Response({'detail': 'Cart updated successfully'}, status=status.HTTP_200_OK)

        return Response({'detail': 'No products provided for update'}, status=status.HTTP_400_BAD_REQUEST)
    