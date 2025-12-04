from django.contrib import admin
from .models import Dealer

@admin.register(Dealer)
class DealerAdmin(admin.ModelAdmin):
  list_display = ('name', 'logo')
  search_fields = ('name',)
