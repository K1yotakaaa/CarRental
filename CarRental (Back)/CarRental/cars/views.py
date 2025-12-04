from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from .models import Car
from .serializers import CarSerializer
from users.permissions import IsDealerOrAdminOrReadOnly
from rest_framework import filters

class CarViewSet(viewsets.ModelViewSet):
  queryset = Car.objects.select_related('dealer').all().order_by('-created_at')
  serializer_class = CarSerializer
  permission_classes = [IsDealerOrAdminOrReadOnly]
  filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
  filterset_fields = ['dealer']
  search_fields = ['make', 'fuel_type', 'type', 'dealer__name', 'description']
  ordering_fields = ['price', 'capacity', 'created_at']

  def get_queryset(self):
    dealer = self.request.query_params.get('dealer')
    print("🔍 BACKEND DEBUG — dealer param =", dealer)

    qs = Car.objects.all()

    if dealer:
        qs = qs.filter(dealer_id=dealer)
        print("🔍 BACKEND DEBUG — filtered count =", qs.count())
    else:
        print("🔍 BACKEND DEBUG — NO dealer param")

    return qs