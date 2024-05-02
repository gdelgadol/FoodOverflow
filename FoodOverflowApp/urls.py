from django.urls import path
from . import views

urlpatterns = [
    # Authentication
    path('signup/', views.signup, name = "signup"), #Sign Up path
    path('login/', views.login, name='login'), # Log in path
    path('activate/<uidb64>/<token>', views.activate, name='activate'), # Activate path
    path('password_reset/', views.password_reset, name='password_reset'), # send email for reset password path
    path('restablecer_contrasena/<uidb64>/<token>', views.reset, name='restablecer'), # Reset password path
    path('logout/', views.logout, name = "logout"), # Log out path
    # Forum
    ## Publication
    path('publications/', views.get_publications, name = "get_publications"), # get publications
    path('crear_publicacion/', views.create_forum_publication, name= "crear_publicaion"), # create publication path
    path('publication/', views.get_publication, name= "get_publication"), # get the publication
    path('publication/filter/', views.get_publications_tags, name="get_publications_tags"), #Get publications by tags
    ## Recipes
    path('recipes/', views.get_recipes, name = "get_publications"), # get only recipes
    path('crear_recipe/', views.create_recipe, name= "crear_recipe"), # create recipe path
    path('recipe/', views.get_recipe, name= "get_publication"), # get the recipe
    path('recipe/filter/', views.get_recipe_tags, name="get_recipe_tags"), #Get recipe by tags
    ## votes
    path('vote/<str:id_vote>/', views.make_vote, name = "vote"), # Make a vote
    ## comment
    path('comment/<str:id_comment>/', views.create_comment, name = "comment"), #Comment on a post
    path('comment/<str:id_comment>/response/', views.create_comment_response, name = "response"), #Reply to a comment
    # User settings
    path('get_user/<str:identifier>', views.get_user_data, name = "user_token"), # user's info in JWT Token
    path('delete_user/',views.delete_user, name = 'delete_user'), # delete_user path
    path('update_password/', views.update_password, name = "update_password"), # Change pasword
    path('update_email/', views.update_email, name = "update_email"), # Change email
    path('update_username/', views.update_username, name = "update_username"), # Change username
    path('settings/<uidb64>/<token>/<str:email>', views.email_confirmated, name='confirmated'), #Confirm new email
    path('user/<str:user_identifier>/<str:identifier>/', views.get_user_posts, name = "users_posts"), # Users Posts
]