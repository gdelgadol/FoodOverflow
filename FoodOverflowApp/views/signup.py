from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.template.loader import render_to_string
from ..tokens import account_activation_token
from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags
from django.db import IntegrityError
from ..models import Profile, Avatar
import json
from .modules import error_response, success_response
from decouple import config
import random

#Sign Up function
def signup(request):
    try:
        # get json data
        data = json.loads(request.body)
        # check if username or email exists
        if Profile.objects.filter(username = data.get('username')).exists() or Profile.objects.filter(email = data.get('email')).exists():
            return error_response("El nombre de usuario o correo ya se encuentran registrados.")
        # check if the password are the same
        if data.get("password") == data.get("check_password"):
            # get the username
            user_name = data.get("username")
            if user_name == 'profile':
                return error_response("'profile' no es un nombre de usuario válido.")

            # get the email
            user_email = data.get("email")
            # create the user profile
            user = Profile.objects.create_user(
                username = user_name,
                password = data.get("password"),
                email = user_email.lower(),
            )

            if not data.get("avatar_id"):
                avatares = Avatar.objects.all()
                user.avatar_id = avatares[random.randint(0, len(avatares)-1)]
            else:
                avatar = Avatar.objects.get(pk = int(data.get("avatar_id")))
                user.avatar_id = avatar

            if data.get("description"):
                user.description = data.get("description")
            
            user.save()

            # send the activation Email
            activate_email(request, user, user.email)
            
            # return Success
            return success_response({"message": "¡Usuario creado con éxito! Por favor no olvides activar tu cuenta para ingresar."})
        else:
            # If the passwords are not the same return Error
            return error_response("Las contraseñas no coinciden.")
    except Exception as e:
        print(str(e))
        return error_response("Ha ocurrido un error, intentalo de nuevo.")

# send email function
def activate_email(request, user, to_email):
    try:
        # Define the email subject
        mail_subject = "Activa tu cuenta de FoodOverflow"
        # Define the email message
        message = render_to_string(
            "email_templates/activation.html",
            context = {
                "user": user.username,
                "domain": config("FRONT_HOST"),
                "uid": urlsafe_base64_encode(force_bytes(user.pk)),
                "token": account_activation_token.make_token(user),
                "protocol": "https" if request.is_secure() else "http",
            }
        )

        plain_message = strip_tags(message)

        #Send email
        email = EmailMultiAlternatives(
            subject = mail_subject,
            body = plain_message, 
            from_email = None,
            to=[to_email]
            )
        
        email.attach_alternative(message, "text/html")
        email.send()
    except Exception as e:
        print(str(e))
        return error_response(str(e))

# Activation function
def activate(request, uidb64, token):
    try:
        # check if credentials are correct
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = Profile.objects.get(id=uid)
        # else return error
    except (TypeError, ValueError, OverflowError, Profile.DoesNotExist):
        user = None
    # if user exists check the sended token
    try:
        if user.active: #if user is currently activated
            return success_response({"message": "El usuario ha sido activado previamente con éxito"})
        elif user is not None and account_activation_token.check_token(user, token):
            # Activate User account
            user.active = True
            user.save()
            #return success message
            return success_response({"message": "El usuario ha sido activado con éxito"})
        else:
            # if user does not exists or it is not activated
            if not user.active:
                # delete the account
                user.delete()
                # return error message
                return error_response("El usuario no ha podido ser activado, intenta el registro nuevamente.")
            # return error message
            return error_response("El usuario no ha podido ser activado, intenta nuevamente.")
    except Exception as e:
        print(str(e))
        return error_response("Ha ocurrido un error, intenta nuevamente.")
