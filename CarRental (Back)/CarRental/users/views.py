from rest_framework import generics, permissions, parsers
from .serializers import RegisterSerializer, UserSerializer
from .models import User
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class RegisterView(generics.CreateAPIView):
  queryset = User.objects.all()
  serializer_class = RegisterSerializer
  permission_classes = [permissions.AllowAny]

class ProfileView(generics.RetrieveUpdateAPIView):
  serializer_class = UserSerializer
  permission_classes = [IsAuthenticated]
  parser_classes = (parsers.MultiPartParser, parsers.FormParser)

  def get_object(self):
    return self.request.user
  
class AvatarUploadView(generics.UpdateAPIView):
  serializer_class = UserSerializer
  permission_classes = [IsAuthenticated]
  parser_classes = (parsers.MultiPartParser, parsers.FormParser)

  def get_object(self):
    return self.request.user

  def patch(self, request, *args, **kwargs):
    return self.update(request, *args, partial=True, **kwargs)
