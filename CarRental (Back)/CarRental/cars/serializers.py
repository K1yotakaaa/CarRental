from rest_framework import serializers
from .models import Car
from dealers.serializers import DealerSerializer
from dealers.models import Dealer

class CarSerializer(serializers.ModelSerializer):
  dealer = serializers.PrimaryKeyRelatedField(queryset=Dealer.objects.all())
  dealer_detail = DealerSerializer(source='dealer', read_only=True)

  class Meta:
    model = Car
    fields = [
      'id', 'image', 'image_file', 'make', 'fuel_type', 'type', 'capacity',
      'price', 'dealer', 'dealer_detail', 'description', 'created_by', 'created_at', 'is_available'
    ]
    read_only_fields = ['id', 'created_by', 'created_at']

  def create(self, validated_data):
    request = self.context.get('request')
    if request and hasattr(request, "user"):
      validated_data['created_by'] = request.user
    return super().create(validated_data)