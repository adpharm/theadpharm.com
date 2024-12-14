from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from .managers import CustomUserManager


class CustomUser(AbstractUser):
    '''
    Custom user model with email as the unique identifier.

    Shout out https://testdriven.io/blog/django-custom-user-model/
    '''
    class Roles(models.TextChoices):
        '''
        Roles that a user can have.
        '''
        ADPHARMER = "adpharmer", "Adpharmer"
        BASIC = "basic", "Basic"
        ANONYMOUS = "anonymous", "Anonymous"

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
    objects: CustomUserManager = CustomUserManager()

    # Disable username field
    username = None
    # Use email as the unique identifier
    email = models.EmailField(_("email address"), unique=True)
    # confirmation email boolean
    # send_verification_email = models.BooleanField(default=False)
    # user role
    role = models.CharField(
        _("role"),
        max_length=50,
        choices=Roles.choices,
        help_text="The user's role in the app."
    )

    def __str__(self):
        return self.email
