from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup, name = "signup"), #Sign Up path
    path('login/', views.login, name='login'), # Log in path
    path('activate/<uidb64>/<token>', views.activate, name='activate'), # Activate path
    path('password_reset/', views.password_reset, name='password_reset'), # send email for reset password path
    path('restablecer_contrasena/<uidb64>/<token>', views.reset, name='restablecer'), # Reset password path
    path('logout/', views.logout, name = "logout"), # Log out path
    path('user_token/', views.get_user_data, name = "user_token"), # user's info in JWT Token
    path('forum/', views.get_forum_posts, name = "get_forum_posts"),
    path('crear_publicacion/', views.create_forum_publication, name= "crear_publicaion"),
]

