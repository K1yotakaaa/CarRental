from rest_framework import viewsets
from .models import Dealer
from .serializers import DealerSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from users.permissions import IsDealerOrAdminOrReadOnly

class DealerViewSet(viewsets.ModelViewSet):
  queryset = Dealer.objects.all()
  serializer_class = DealerSerializer
  permission_classes = [IsDealerOrAdminOrReadOnly]
  filterset_fields = ['name']
  search_fields = ['name', 'description']
