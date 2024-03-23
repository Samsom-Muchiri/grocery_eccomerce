
from django.contrib import admin
from django.urls import path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from .views import list_products, create_order, view_order

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
    path('admin/', admin.site.urls),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('products/', list_products, name='list_products'),
    path('orders/', create_order, name='create_order'),
    path('orders/<int:order_id>/', view_order, name='view_order'),


]
