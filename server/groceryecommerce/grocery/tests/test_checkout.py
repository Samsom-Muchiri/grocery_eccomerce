# shop/tests/test_checkout.py

from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from grocery.models import Product, Cart, CartItem

class CheckoutTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = get_user_model().objects.create_user(username='testuser', password='Verifypassword')
        self.client.login(username='testuser', password='Verifypassword')

        # self.product = Product.objects.create(id=5, name='Test Product', price=1)
        # self.cart = Cart.objects.create(user=self.user)
        # self.cart_item = CartItem.objects.create(cart=self.cart, product=self.product, quantity=1)

    def test_checkout_process(self):
        response = self.client.post(reverse('add-to-cart'), {
            'product_id': 5,
            'quantity': 1
        }, content_type='application/json')
        self.assertEqual(response.status_code, 200)

        response = self.client.post(reverse('checkout'), {
            'contact': 'austinewere59@gmail.com',
            'delivery': {
                'country_name': 'Kenya',
                'first_name': 'Jack',
                'second_name': 'Were',
                'address': '123 Main St',
                'city': 'Nairobi',
                'postal_code': '00100',
                'phone_number': '0700941989'
            },
            'tip_amount': 1
        }, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('order_id', response.json())
        order_id = response.json().get('order_id')

        # Initiate payment
        response = self.client.post(reverse('initiate_payment'), {
            'order_id': order_id,
            'phone_number': '0700941989'
        }, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('Payment initiated successfully', response.json().get('message'))
