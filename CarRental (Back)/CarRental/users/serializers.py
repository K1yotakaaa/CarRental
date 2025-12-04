from rest_framework import serializers
from .models import User
from django.contrib.auth.password_validation import validate_password
import re

class RegisterSerializer(serializers.ModelSerializer):
  password = serializers.CharField(write_only=True)
  password2 = serializers.CharField(write_only=True)

  role = serializers.CharField(read_only=True)

  class Meta:
    model = User
    fields = ['email', 'password', 'password2', 'full_name', 'role']
  def validate(self, data):
    if data['password'] != data['password2']:
      raise serializers.ValidationError("Passwords must match.")
    
    pw = data['password']
    if len(pw) < 8:
      raise serializers.ValidationError("Password must be at least 8 characters.")
    if not re.search(r'\d', pw):
      raise serializers.ValidationError("Password must contain at least one number.")
    if not re.search(r'[!@#$%^&*(),.?\":{}|<>]', pw):
      raise serializers.ValidationError("Password must contain at least one special character.")
    return data
  
  def create(self, validated_data):
    validated_data.pop('password2', None)
    password = validated_data.pop('password')
    return User.objects.create_user(
      password=password,
      role="basic",
      **validated_data
    )


class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ['id', 'email', 'full_name', 'role', 'avatar', 'dealer']
    read_only_fields = ['id', 'role']
