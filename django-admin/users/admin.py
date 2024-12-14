from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import CustomUser

# Shout out https://testdriven.io/blog/django-custom-user-model/


class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = CustomUser
        fields = ("email",)


class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = CustomUser
        fields = ("email",)


class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = (
        "email",
        "role",
    )
    list_filter = (
        "email",
        "role",
        "is_superuser",
        "is_staff",
        "is_active"
    )
    fieldsets = (
        (None, {
            "fields": (
                "email",
                "password",
                "first_name",
                "last_name",
                "role",
            )
        }),
        ("Permissions", {
            "fields": (
                # "send_verification_email",
                "is_superuser",
                "is_staff",
                "is_active",
                # "groups",
                # "user_permissions"
            )
        }),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                "email",
                "password1",
                "password2",
                "first_name",
                "last_name",
                "role",
                "is_superuser",
                "is_staff",
                "is_active",
                # "groups",
                # "user_permissions"
            )}
         ),
    )
    search_fields = ("email",)
    ordering = ("email",)
    # inlines = (InlineDriveMember,)


admin.site.register(CustomUser, CustomUserAdmin)
