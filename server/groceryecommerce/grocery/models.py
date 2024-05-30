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
    

class Tip(models.Model):
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    def __str__(self):
        return f"Tip for Order #{self.order.id}"
    
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
    tip = models.OneToOneField(Tip, on_delete=models.CASCADE, blank=True, null=True)
    total_amount = models.DecimalField(default=0.0, max_digits=10, decimal_places=2)

    def save(self, *args, **kwargs):
        if not self.tip:
            self.tip = Tip.objects.create(amount=0)
        self.total_amount = self.calculate_total_amount()
        super().save(*args, **kwargs)
    
    def calculate_total_amount(self):
        # delivery_cost = self.delivery.calculate_delivery_cost()
        payment_cost = self.payment.calculate_payment_cost()
        tip_amount = self.tip.amount if self.tip else 0
        total = payment_cost + tip_amount
        return total


    def __str__(self):
        return f"Order #{self.id} - {self.user.username}"


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Subcategory(models.Model):
    name = models.CharField(max_length=100)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='subcategories')

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    picture = models.ImageField(upload_to='product_images/')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    subcategory = models.ForeignKey(Subcategory, on_delete=models.CASCADE, related_name='products')
    quantity = models.PositiveIntegerField(default=0)
    availability = models.BooleanField(default=True)
    discount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Offer or discount on the product")
    keywords = models.TextField(help_text="Enter keywords separated by commas")
    organic = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Delivery(models.Model):
    country_name = models.CharField(max_length=100, default="Kenya")
    first_name = models.CharField(max_length=100, default="Test")
    second_name = models.CharField(max_length=100, default="Test")
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100, default="Nairobi")
    postal_code = models.CharField(max_length=20)
    phone_number = models.CharField(max_length=20, default="070000000")
    order = models.ForeignKey(Order, on_delete=models.CASCADE)

    def __str__(self):
        return f"Delivery for Order #{self.order.id}"
    

class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart for {self.user.username} (user_id: {self.user.id})"

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('Product', on_delete=models.CASCADE)
    price = models.FloatField(null=True)
    offer = models.FloatField(null=True)
    quantity = models.IntegerField(null=False, default=1)

class SavedItem(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='saved_items')
    product = models.ForeignKey('Product', on_delete=models.CASCADE, related_name='saved_by')
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')

    def __str__(self):
        return f"{self.user.username} saved {self.product.name}"

