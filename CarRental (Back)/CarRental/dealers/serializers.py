from rest_framework import serializers
from .models import Dealer

class DealerSerializer(serializers.ModelSerializer):
  class Meta:
    model = Dealer
    fields = ['id', 'name', 'logo', 'description', 'created_at']
    read_only_fields = ['id', 'created_at']
