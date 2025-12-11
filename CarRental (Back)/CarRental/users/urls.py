from django.urls import path
from .views import RegisterView, ProfileView, AvatarUploadView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
  path('register/', RegisterView.as_view(), name='auth-register'),
  path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
  path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
  path('me/', ProfileView.as_view(), name='profile'),
  path('avatar/', AvatarUploadView.as_view(), name='avatar-upload'),
]
