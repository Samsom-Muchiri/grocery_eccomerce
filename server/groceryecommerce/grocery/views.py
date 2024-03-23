from django.shortcuts import render
from django.http import JsonResponse
from .models import Product, Order
import json


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


def create_order(request):
    # Logic to create order
    return JsonResponse({'success': True})

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