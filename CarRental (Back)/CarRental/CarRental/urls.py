from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from cars.views import CarViewSet
from dealers.views import DealerViewSet

router = DefaultRouter()
router.register(r'cars', CarViewSet, basename='cars')
router.register(r'dealers', DealerViewSet, basename='dealers')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/', include(router.urls)),
]

from django.conf import settings
from django.conf.urls.static import static
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
