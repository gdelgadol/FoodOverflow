from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models

# User model
class UserManager(BaseUserManager):

    def create_user(self, username, password, email):
        user = self.model(
            username = username,
            email = self.normalize_email(email)
        )
        user.set_password(password)
        user.save(using = self._db)
        return user

    def create_superuser(self, username, password, email):
        user = self.create_user(
            username,
            password,
            email
        )
        user.is_admin = True
        user.save(using = self._db)
        return user


class Profile(AbstractBaseUser):
    username = models.CharField(max_length = 200, unique = True)
    email = models.EmailField(max_length = 200, unique = True)
    active = models.BooleanField(default = False)

    is_admin = models.BooleanField(default = False)
    description = models.CharField(max_length = 240)

    USERNAME_FIELD = "username"
    EMAIL_FIELD = "email"
    REQUIRED_FIELDS = ["password", "email"]

    objects = UserManager()

    def __str__(self):
        return self.username

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return self.is_admin

    @property
    def is_staff(self):
        return self.is_admin

#Publication Model
class PublicationManager(models.Manager):
    def create_publication(self, title, description, user_id):
        publication = self.model(
            publication_title = title,
            publication_description = description,
            profile_id = user_id
        )
        publication.save(using=self.db)
        return publication

class Publication(models.Model):
    publication_id = models.BigAutoField(primary_key=True)
    publication_title = models.CharField(max_length=100)
    profile_id = models.ForeignKey(Profile, on_delete=models.CASCADE)
    publication_description = models.TextField(unique=True)

    on_delete = models.CASCADE
    objects = PublicationManager()
