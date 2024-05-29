from django.contrib import admin
from django.urls import path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from grocery.views import ProductListView, CreateOrderView, OrderListView, OrderDetailView, UserRegisterView, UserProfileView, PaymentView, home, DeliveryListView, DeliveryDetailView, ProductListByCategory, AddToCart, UpdateCart, CreateProductView, SalesActivityView, GoodsSoldOnOfferView, TotalSalesAmountView, ProductListBySubCategory, TopPicksView, NewArrivalsView, OrganicProductsView, csrf_token_view
from django.contrib.auth.views import LoginView
from MpesaViews.mpesaexpress import initiate_mpesa_stk_push, mpesa_callback
from MpesaViews.testview import send_prompt, send_prompt_res


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
    path('orders_creation/', CreateOrderView.as_view(), name='create_order'),
    path('orders/', OrderListView.as_view(), name='list_orders'),
    path('orders/<int:order_id>/', OrderDetailView.as_view(), name='view_order'),
    path('login/', LoginView.as_view(template_name='registration/login.html'), name='user_login'),
    path('register/', UserRegisterView.as_view(), name='user_register'),
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('payment/', PaymentView.as_view(), name='payment'),
    path('deliveries/<int:order_id>/', DeliveryListView.as_view(), name='delivery_list'),
    path('deliveries/<int:delivery_id>/', DeliveryDetailView.as_view(), name='delivery_detail'),
    path('products/<str:category>/', ProductListByCategory.as_view(), name='product-list-by-category'),
    path('products/<str:subcategory>/', ProductListBySubCategory.as_view(), name='product-list-by-subcategory'),
    path('add-to-cart/', AddToCart.as_view(), name='add-to-cart'),
    path('update-cart/<int:pk>/', UpdateCart.as_view(), name='update-cart'),
    path('create-product/', CreateProductView.as_view(), name='create_product'),
    path("mpesa/callback/", mpesa_callback, name="mpesa_callback"),
    path("mpesa/stkpush/", initiate_mpesa_stk_push, name="stk_push"),
    path('sale-activity/', SalesActivityView.as_view(), name='sale-activity'),
    path('goods-sold/', GoodsSoldOnOfferView.as_view(), name='goods-sold'),
    path('total-sales-amount/', TotalSalesAmountView.as_view(), name='total-sales-amount'),
    path('mpesa_prompt/', send_prompt, name='send_prompt'),
    path('prompt_res/', send_prompt_res, name='send_prompt_res'),
    path('top-picks/', TopPicksView.as_view()),
    path('products/new-arrivals/', NewArrivalsView.as_view(), name='new-arrivals'),
    path('products/organic/', OrganicProductsView.as_view(), name='organic-products'),
    path('get-csrf-token/', csrf_token_view, name='get_csrf_token'),
    # path("mpesa/mpesapayments/", MobileMoneyPayment, name="mpesapayments")


]

