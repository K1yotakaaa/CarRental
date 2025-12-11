from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
  ordering = ('email',)
  list_display = ('email', 'full_name', 'role', 'is_staff', 'is_active')
  list_filter = ('role', 'is_staff', 'is_active')
  search_fields = ('email', 'full_name')

  fieldsets = (
      (None, {'fields': ('email', 'password')}),
      ('Personal info', {'fields': ('full_name', 'avatar')}),   # dealer REMOVED
      ('Permissions', {
        'fields': (
          'role',
          'is_active',
          'is_staff',
          'is_superuser',
          'groups',
          'user_permissions'
        )
      }),
      ('Important dates', {'fields': ('last_login',)}),
  )

  add_fieldsets = (
    (None, {
      'classes': ('wide',),
      'fields': ('email', 'full_name', 'password1', 'password2', 'role'),
    }),
  )

  filter_horizontal = ('groups', 'user_permissions')
  readonly_fields = ('last_login',)
