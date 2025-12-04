from rest_framework import permissions

class IsDealerOrAdminOrReadOnly(permissions.BasePermission):
    """
    Read-only for any request.
    Write allowed if user.role == 'dealer' or user.is_staff or user.is_superuser.
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        if not request.user or not request.user.is_authenticated:
            return False
        return (request.user.role == 'dealer') or request.user.is_staff or request.user.is_superuser

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        if request.user.is_staff or request.user.is_superuser:
            return True
        
        try:
            owner = getattr(obj, 'created_by', None)
            if owner and owner == request.user and request.user.role == 'dealer':
                return True
        except Exception:
            pass
        return False
    
class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Used for Dealers:
    - Anyone can read dealers
    - Only admin/staff can create/update/delete dealers
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return (
            request.user.is_authenticated 
            and (request.user.is_superuser or request.user.is_staff)
        )
