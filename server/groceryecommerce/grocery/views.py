from django.shortcuts import render
from django.http import JsonResponse
from .models import Product, Order
import json
from django.contrib.auth import authenticate, login, get_user_model
from django.contrib.auth.forms import UserCreationForm
from django.views.generic.edit import CreateView
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Product, Order, User
from .forms import UserProfileForm, PaymentForm
from .serializers import ProductSerializer, OrderSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django import forms
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes




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

def list_products(request):
    products = Product.objects.all()
    data = []
    for product in products:
        product_data = {
            'name': product.name,
            'price': product.price,
            'image': product.picture.url if product.picture else None,
        }
        data.append(product_data)
    return JsonResponse(data, safe=False)
def list_orders(request):
    orders = Order.objects.filter(user=request.user)
    serializer = OrderSerializer(orders, many=True)
    return JsonResponse(serializer.data, safe=False)

@api_view(['GET', 'POST'])
# @permission_classes([IsAuthenticated])    
def create_order(request):
    if request.method == 'POST':
        try:
            # Parse JSON data from frontend
            order_data = json.loads(request.body.decode('utf-8'))
            products = order_data.get('products', [])

            # Calculate total price
            total_price = 0
            for product_id in products:
                try:
                    product = Product.objects.get(id=product_id)
                    total_price += product.price
                except Product.DoesNotExist:
                    # Handle case where product doesn't exist
                    pass
            
            # Create order
            order = Order.objects.create(
                user=request.user,
                total_price=total_price,
                status='pending'  # Default status
            )

            # Add products to order
            for product_id in products:
                try:
                    product = Product.objects.get(id=product_id)
                    order.products.add(product)
                except Product.DoesNotExist:
                    # case where product doesn't exist
                    pass
            
            return JsonResponse({'success': True, 'order_id': order.id})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    elif request.method == 'GET':
        # Retrieve orders for the current user
        orders = Order.objects.filter(user=request.user)

        # Serialize the orders data
        serializer = OrderSerializer(orders, many=True)

        # Return the serialized data as a JSON response
        return JsonResponse(serializer.data, safe=False)
    else:
        return JsonResponse({'error': 'Only POST and GET requests are allowed'}, status=405)

def view_order(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
        data = {
            'id': order.id,
            'total_price': order.total_price,
            'status': order.status,
            'created_at': order.created_at,
        }
        return JsonResponse(data)
    except Order.DoesNotExist:
        return JsonResponse({'error': 'Order not found'}, status=404)

# View to handle user registration
class UserRegisterView(CreateView):
    form_class = CustomUserCreationForm
    # form_class = UserCreationForm
    template_name = 'registration/register.html'
    success_url = '/login/'

# View to handle user profile

@method_decorator(login_required, name='dispatch')
class UserProfileView(APIView):
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


# View to handle payment
class PaymentView(APIView):
    def post(self, request):
        form = PaymentForm(request.POST)
        if form.is_valid():
            # Process payment logic
            return JsonResponse({'message': 'Payment successful'})
        else:
            return JsonResponse({'error': 'Invalid data'}, status=400)
