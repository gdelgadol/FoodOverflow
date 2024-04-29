from django.contrib import admin
from .models import *

# Register your models here.

admin.site.register(Profile)
admin.site.register(Publication)
admin.site.register(PublicationComment)
admin.site.register(PublicationVote)
admin.site.register(Recipe)
admin.site.register(RecipeComment)
admin.site.register(RecipeVote)
admin.site.register(Avatar)
admin.site.register(SavedPost)
admin.site.register(Notification)