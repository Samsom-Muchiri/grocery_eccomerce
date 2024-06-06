from django import forms
from .models import User, Payment

class UserProfileForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['username', 'email', 'address', 'phone_number']

# class PaymentForm(forms.ModelForm):
#     class Meta:
#         model = Payment
#         fields = ['amount', 'status']

class LoginForm(forms.Form):
    username = forms.CharField(
        max_length=150,
        required=True,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Username'
        })
    )
    password = forms.CharField(
        max_length=128,
        required=True,
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Password'
        })
    )


class DeliveryForm(forms.Form):
    country_name = forms.CharField(max_length=100)
    first_name = forms.CharField(max_length=100)
    second_name = forms.CharField(max_length=100)
    address = forms.CharField(max_length=255)
    city = forms.CharField(max_length=100)
    postal_code = forms.CharField(max_length=20)
    phone_number = forms.CharField(max_length=20)
    
class PaymentForm(forms.Form):
    method = forms.ChoiceField(choices=[('mpesa', 'Mpesa')])
    phone_number = forms.CharField(max_length=20, required=False)
    
class CheckoutForm(forms.Form):
    contact = forms.CharField(max_length=100)
    delivery_country_name = forms.CharField(max_length=100)
    delivery_first_name = forms.CharField(max_length=100)
    delivery_second_name = forms.CharField(max_length=100)
    delivery_address = forms.CharField(max_length=255)
    delivery_city = forms.CharField(max_length=100)
    delivery_postal_code = forms.CharField(max_length=20)
    delivery_phone_number = forms.CharField(max_length=20)
    tip_amount = forms.DecimalField(max_digits=10, decimal_places=2)
    