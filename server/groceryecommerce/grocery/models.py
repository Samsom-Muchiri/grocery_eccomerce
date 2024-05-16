from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.conf import settings


class User(AbstractUser):

    address = models.CharField(max_length=255, blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)


class MpesaResponseBody(models.Model):
    body = models.JSONField()

    def __str__(self):
        return f"Mpesa Response Body {self.id}"
    
class Payment(models.Model):
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('successful', 'Successful'), ('failed', 'Failed')])

    mpesa_response = models.OneToOneField(MpesaResponseBody, on_delete=models.CASCADE, null=True, blank=True)

class CreditCardPayment(Payment):
    card_number = models.CharField(max_length=16)
    expiration_date = models.DateField()
    security_code = models.CharField(max_length=3)

class MobileMoneyPayment(Payment):
    phone_payment_number = models.CharField(max_length=20)
    provider = models.CharField(max_length=30)
    mpesa_transaction_id = models.CharField(max_length=200, blank=True, null=True)
    

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    products = models.ManyToManyField('Product', related_name='orders')
    payment = models.ForeignKey(Payment, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"Order #{self.id} - {self.user.username}"


class Product(models.Model):
    CATEGORY_CHOICES = [
        ('vegetables', 'Vegetables'),
        ('raw_meat', 'Raw Meat'),
        ('fruits', 'Fruits'),
        ('fish', 'Fish'),
        ('drinks', 'Drinks'),
        ('snacks', 'Snacks'),
    ]

    name = models.CharField(max_length=100)
    description = models.TextField()
    picture = models.ImageField(upload_to='product_images/')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    quantity = models.PositiveIntegerField(default=0)
    availability = models.BooleanField(default=True)
    offer = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Offer or discount on the product")
    

    def __str__(self):
        return self.name



class Delivery(models.Model):
    address = models.CharField(max_length=255)
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('shipped', 'Shipped'), ('delivered', 'Delivered')])
    order = models.ForeignKey(Order, on_delete=models.CASCADE)


class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart for {self.user.username}"

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('Product', on_delete=models.CASCADE)
    price = models.FloatField(null=True)
    offer = models.FloatField(null=True)
    quantity = models.IntegerField(null=False, default=1)
    