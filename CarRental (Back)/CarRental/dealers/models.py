from django.db import models

class Dealer(models.Model):
  name = models.CharField(max_length=200, unique=True)
  logo = models.URLField(blank=True)
  description = models.TextField(blank=True)
  created_at = models.DateTimeField(auto_now_add=True)
  
  def __str__(self):
    return self.name
