from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup, name = "signup"),
    path('login/', views.login, name='login'),
    path('activate/<uidb64>/<token>', views.activate, name='activate'),
    path('password_reset/', views.password_reset, name='password_reset'),
    path('restablecer_contrasena/<uidb64>/<token>', views.reset, name='restablecer'),
]
