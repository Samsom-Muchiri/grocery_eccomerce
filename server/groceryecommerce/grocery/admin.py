from django.contrib import admin
from .models import User, Payment, Order, Product, CreditCardPayment, MobileMoneyPayment, Delivery, Category, Subcategory

admin.site.register(User)
admin.site.register(Payment)
admin.site.register(Order)
admin.site.register(Product)
admin.site.register(CreditCardPayment)
admin.site.register(MobileMoneyPayment)
admin.site.register(Delivery)
admin.site.register(Category)
admin.site.register(Subcategory)

