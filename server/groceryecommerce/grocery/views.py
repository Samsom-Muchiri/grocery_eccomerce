from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from .models import Product, Order, User, Payment, CreditCardPayment, MobileMoneyPayment, Delivery, Cart, CartItem, Category, Subcategory, Tip
import json
from django import forms
from django.contrib.auth.decorators import login_required
from django.views.generic.edit import CreateView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .forms import UserProfileForm, PaymentForm
from .serializers import ProductSerializer, OrderSerializer, CartItemSerializer, CartSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.forms import UserCreationForm
from django.utils.decorators import method_decorator
from .serializers import DeliverySerializer, CartSerializer
from django.contrib.sessions.models import Session
from rest_framework import generics
from django.db.models import Sum


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
            'tip_amount': openapi.Schema(type='number')
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
            cart_id = request.data.get('cart_id')
            cart = Cart.objects.get(id=cart_id)
            total_price = sum(item.price for item in cart.items.all())

            tip_amount = request.data.get('tip_amount', 0)
            total_price += tip_amount

            order = Order.objects.create(
                user=request.user,
                total_price=total_price,
                status='pending'
            )
            order.products.add(*[item.product for item in cart.items.all()])
            
            tip = Tip.objects.create(amount=tip_amount)
            order.tip = tip
            
            order.save()
            
            cart.delete()
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
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'product_id': openapi.Schema(
                    type=openapi.TYPE_INTEGER,
                    description="ID of the product to add to the cart"
                ),
                'quantity': openapi.Schema(
                    type=openapi.TYPE_INTEGER,
                    description="Quantity of the product to add to the cart"
                ),
                'price': openapi.Schema(
                    type=openapi.TYPE_NUMBER,
                    description="Price of the product"
                ),
                'offer': openapi.Schema(
                    type=openapi.TYPE_NUMBER,
                    description="Offer on the product"
                )
            }
        ),
        responses={200: openapi.Response(description="Item(s) added to cart successfully")}
    )
    def post(self, request):
        try:
            product_id = request.data.get('product_id')
            quantity = request.data.get('quantity', 1)
            offer = request.data.get('offer')

            product = Product.objects.get(id=product_id)
            
            cart, created = Cart.objects.get_or_create(user=request.user)
            price = request.data.get('price', product.price)

            for _ in range(quantity):
                cart_item, _ = CartItem.objects.get_or_create(cart=cart, product=product)

                cart_item.quantity += 1
                
                # Calculate the price after applying the offer, if available
                item_price = price if price is not None else product.price
                if offer is not None:
                    item_price -= offer

                cart_item.price = item_price
                cart_item.offer = offer
                cart_item.save()

            return Response({'success': True, 'message': f'{quantity} item(s) added to cart successfully'})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UpdateCart(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_id='update_cart',
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'items': openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'product_id': openapi.Schema(
                                type=openapi.TYPE_INTEGER,
                                description="ID of the product to update in the cart"
                            ),
                            'quantity': openapi.Schema(
                                type=openapi.TYPE_INTEGER,
                                description="Quantity of the product in the cart"
                            ),
                            'price': openapi.Schema(
                                type=openapi.TYPE_NUMBER,
                                description="Price of the product"
                            ),
                            'offer': openapi.Schema(
                                type=openapi.TYPE_NUMBER,
                                description="Offer on the product"
                            )
                        }
                    ),
                    description="List of items to update in the cart"
                )
            }
        ),
        responses={200: openapi.Response(description="Cart updated successfully"),
                   400: openapi.Response(description="Bad request")}
    )
    def put(self, request, *args, **kwargs):
        try:
            data = request.data.get('items', [])
            cart, created = Cart.objects.get_or_create(user=request.user)

            for item_data in data:
                product_id = item_data.get('product_id')
                quantity = item_data.get('quantity', 1)
                price = item_data.get('price')
                offer = item_data.get('offer')

                product = Product.objects.get(id=product_id)
                cart_item, _ = CartItem.objects.get_or_create(cart=cart, product=product)
                cart_item.quantity = quantity
                if offer is not None:
                    cart_item.price = price - offer
                else:
                    cart_item.price = price

                cart_item.offer = offer
                cart_item.save()

            return Response({'success': True, 'message': 'Cart updated successfully'})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class CreateProductView(APIView):
    @swagger_auto_schema(
        operation_id='create_product',
        request_body=ProductSerializer,
        responses={201: openapi.Response(description="Product created successfully", schema=ProductSerializer)},
        tags=['products']
    )
    def post(self, request):
        """
        Create a new product.
        """
        try:
            serializer = ProductSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class SalesActivityView(APIView):

    @swagger_auto_schema(
        operation_id='sales_activity',
        responses={
            200: openapi.Response(
                description="Sales activity",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'items_remaining': openapi.Schema(type=openapi.TYPE_INTEGER),
                        'items_sold': openapi.Schema(type=openapi.TYPE_INTEGER)
                    }
                )
            )
        }
    )
    def get(self, request):
        """
        Get the number of items remaining and items sold.
        """
        items_remaining = Product.objects.aggregate(total=Sum('quantity'))['total']
        items_sold = Order.objects.aggregate(total=Sum('products__quantity'))['total']
        
        return Response({
            'items_remaining': items_remaining,
            'items_sold': items_sold
        })

class GoodsSoldOnOfferView(APIView):

    @swagger_auto_schema(
        operation_id='goods_sold_on_offer',
        responses={
            200: openapi.Response(
                description="Goods sold on offer and marked price",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'goods_sold_on_offer': openapi.Schema(type=openapi.TYPE_INTEGER),
                        'goods_sold_on_marked_price': openapi.Schema(type=openapi.TYPE_INTEGER)
                    }
                )
            )
        }
    )
    def get(self, request):
        """
        Get the total number of goods sold on offer and goods sold on marked price.
        """
        goods_sold_on_offer = Order.objects.filter(products__offer__isnull=False).aggregate(total=Sum('products__quantity'))['total']
        goods_sold_on_marked_price = Order.objects.filter(products__offer__isnull=True).aggregate(total=Sum('products__quantity'))['total']

        return Response({
            'goods_sold_on_offer': goods_sold_on_offer,
            'goods_sold_on_marked_price': goods_sold_on_marked_price
        })

class TotalSalesAmountView(APIView):

    @swagger_auto_schema(
        operation_id='total_sales_amount',
        responses={
            200: openapi.Response(
                description="Total sales amount",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'total_sales_amount': openapi.Schema(type=openapi.TYPE_NUMBER)
                    }
                )
            )
        }
    )
    def get(self, request):
        """
        Get the total amount received from the total sales.
        """
        total_sales_amount = Payment.objects.filter(status='successful').aggregate(total=Sum('amount'))['total']
        
        return Response({
            'total_sales_amount': total_sales_amount
        })

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
        category_slug = self.kwargs['category']
        try:
            category = Category.objects.get(slug=category_slug)
            return Product.objects.filter(category=category)
        except Category.DoesNotExist:
            return Product.objects.none()

class ProductListBySubcategory(generics.ListAPIView):
    serializer_class = ProductSerializer

    @swagger_auto_schema(
        operation_id='list_products_by_subcategory',
        responses={200: openapi.Response(description="List of products by subcategory", schema=ProductSerializer(many=True))}
    )
    def get_queryset(self):
        """
        Get a list of products by subcategory.
        """
        subcategory_slug = self.kwargs['subcategory']
        try:
            subcategory = Subcategory.objects.get(slug=subcategory_slug)
            return Product.objects.filter(subcategory=subcategory)
        except Subcategory.DoesNotExist:
            return Product.objects.none()
