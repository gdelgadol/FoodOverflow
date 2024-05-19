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
    path('report/<str:identifier>', views.report, name = "report"), #report posts and post's comments 
    path('save/<str:identifier>', views.save_posts, name = "save"), #save posts and post's comments 
    path('saved_posts/<str:identifier>', views.get_saved_posts, name = "saved_posts"), #Get the user's saved posts
    path('delete_posts/<str:identifier>', views.delete_post, name = "delete"), #delete post
    path('delete_comment/<str:identifier>', views.delete_comment, name = "delete"), #delete post,
    path('get_reports/', views.get_posts_reports, name = "get_reports"),
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
    #notifications
    path('notifications/', views.get_user_notifications, name="get_notifications"), #Get all user notifications
    path('notifications/delete/', views.delete_user_notification, name="delete_user_notification"), #Delete a user notification
    path('notifications/deleteall/', views.delete_all_notifications, name="delete_all_notifications"), #Delete all user notifications
    # User settings
    path('get_jwt_info', views.get_jwt, name = "user_token_info"), # user's info in JWT Token
    path('get_user/<str:identifier>', views.get_user_data, name = "user_token"), # user's info in JWT Token
    path('delete_user/',views.delete_user, name = 'delete_user'), # delete_user path
    path('update_password/', views.update_password, name = "update_password"), # Change pasword
    path('update_email/', views.update_email, name = "update_email"), # Change email
    path('update_username/', views.update_username, name = "update_username"), # Change username
    path('settings/<uidb64>/<token>/<str:email>', views.email_confirmated, name='confirmated'), #Confirm new email
    path('user/<str:user_identifier>/<str:identifier>/', views.get_user_posts, name = "users_posts"), # Users Posts
    path('update_avatar', views.update_avatar, name = 'update_avatar'), # Change use's avatar
    path('update_description', views.update_description, name = 'update_description'), #Change user's description
    path('get_avatars', views.get_avatars, name = 'get_avatars'), # get all avatars

    # MercadoPago
    path('create_preference/', views.create_preference, name='create_preference'),
]