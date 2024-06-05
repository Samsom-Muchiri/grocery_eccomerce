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
    delivery = DeliveryForm()
    payment = PaymentForm()
    tip = forms.DecimalField(max_digits=10, decimal_places=2, required=False, initial=0)
