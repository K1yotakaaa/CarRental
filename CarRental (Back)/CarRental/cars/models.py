from django.db import models
from dealers.models import Dealer

FUEL_CHOICES = [
  ('Electric', 'Electric'),
  ('Regular', 'Regular'),
  ('Premium', 'Premium'),
  ('Diesel', 'Diesel'),
  ('Hybrid', 'Hybrid'),
]

TYPE_CHOICES = [
  ('Sedan', 'Sedan'),
  ('SUV', 'SUV'),
  ('Coupe', 'Coupe'),
  ('Sports', 'Sports'),
  ('Compact', 'Compact'),
  ('Supercar', 'Supercar'),
]

class Car(models.Model):
  dealer = models.ForeignKey(Dealer, related_name='cars', on_delete=models.CASCADE)
  image = models.URLField(blank=True)
  image_file = models.ImageField(upload_to='cars/', null=True, blank=True)
  make = models.CharField(max_length=200)
  fuel_type = models.CharField(max_length=50, choices=FUEL_CHOICES)
  type = models.CharField(max_length=50, choices=TYPE_CHOICES)
  capacity = models.IntegerField()
  price = models.DecimalField(max_digits=10, decimal_places=2)
  description = models.TextField(blank=True)
  created_by = models.ForeignKey('users.User', null=True, blank=True, on_delete=models.SET_NULL)
  created_at = models.DateTimeField(auto_now_add=True)
  is_available = models.BooleanField(default=True)

  def __str__(self):
    return f"{self.make} ({self.dealer.name})"
