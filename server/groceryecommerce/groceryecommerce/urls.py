from django.contrib import admin
from django.urls import path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from grocery.views import ProductListView, CreateOrderView, OrderListView, OrderDetailView, UserRegisterView, UserProfileView, PaymentView, home
from django.contrib.auth.views import LoginView

schema_view = get_schema_view(
    openapi.Info(
        title="Grocery API",
        default_version='v1',
        description="API for grocery eCommerce site",
        terms_of_service="https://www.github.com/ajackwere/",
        contact=openapi.Contact(email="austinewere59@gmail.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('', home, name='home'),
    path('admin/', admin.site.urls),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('products/', ProductListView.as_view(), name='list_products'),
    path('orders/', CreateOrderView.as_view(), name='create_order'),
    path('orders/', OrderListView.as_view(), name='list_orders'),
    path('orders/<int:order_id>/', OrderDetailView.as_view(), name='view_order'),
    path('login/', LoginView.as_view(template_name='registration/login.html'), name='user_login'),
    path('register/', UserRegisterView.as_view(), name='user_register'),
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('payment/', PaymentView.as_view(), name='payment'),
]
