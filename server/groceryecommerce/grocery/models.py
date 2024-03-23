from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.conf import settings


class User(AbstractUser):

    address = models.CharField(max_length=255, blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)

    # unique related_name attributes for groups and user_permissions fields
    # groups = models.ManyToManyField('Group', related_name='grocery_users')
    # user_permissions = models.ManyToManyField('Permission', related_name='grocery_users')

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    products = models.ManyToManyField('Product', related_name='orders')

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

    def __str__(self):
        return self.name
        