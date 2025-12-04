from django.contrib import admin
from .models import Car

@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
  list_display = ('make', 'dealer', 'fuel_type', 'type', 'price', 'capacity', 'is_available')
  search_fields = ('make', 'dealer__name')
  list_filter = ('fuel_type', 'type', 'dealer')
