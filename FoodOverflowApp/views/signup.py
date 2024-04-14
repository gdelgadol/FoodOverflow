from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.datastructures import MultiValueDictKeyError
from django.utils.encoding import force_bytes, force_str
from django.template.loader import render_to_string
from ..tokens import account_activation_token
from django.core.mail import EmailMessage
from django.db import IntegrityError
from ..models import Profile
import json
from django.http import JsonResponse
from decouple import config

#Sign Up function
def signup(request):
    try:
        # get json data
        data = json.loads(request.body)
        try:
            # chack if username or email exists
            if Profile.objects.filter(username = data.get('username')).exists() or Profile.objects.filter(email = data.get('email')).exists():
                return JsonResponse(
                    {
                        "message": "El nombre de usuario o correo ya se encuentran registrados.",
                        "type": "ERROR",
                    }
                )
            # check if the password are the same
            if data.get("password") == data.get("check_password"):
                # get the username
                user_name = data.get("username")
                # get the email
                user_email = data.get("email")
                # create the user profile
                user = Profile.objects.create_user(
                    username = user_name,
                    password = data.get("password"),
                    email = user_email.lower(),
                )
                # send the activation Email
                activate_email(request, user, user.email)
              
                # return Success
                return JsonResponse(
                    {
                        "message": "¡Usuario creado con éxito! Por favor no olvides activar tu cuenta para ingresar.",
                        "type": "SUCCESS",
                    }
                )
            else:
                # If the passwords are not the same return Error
                return JsonResponse(
                    {"message": "Las contraseñas no coinciden.", "type": "ERROR"}
                )
        except IntegrityError:
            # If user already exists return error
            return JsonResponse({"message": "El usuario ya existe", "type": "ERROR"})
    except MultiValueDictKeyError:
        user_name = False
        user_email = False

# send email function
def activate_email(request, user, to_email):
    # Define the email subject
    mail_subject = "Activa tu cuenta de FoodOverflow"
    # Define the email message
    message = render_to_string(
        "email_templates/activation.html",
        {
            "user": user.username,
            "domain": config("FRONT_HOST"),
            "uid": urlsafe_base64_encode(force_bytes(user.pk)),
            "token": account_activation_token.make_token(user),
            "protocol": "https" if request.is_secure() else "http",
        },
    )
    #Send email
    email = EmailMessage(mail_subject, message, to=[to_email])
    email.send()

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
    if user is not None and account_activation_token.check_token(user, token):
        # Activate User account
        user.active = True
        user.save()
        #return success message
        return JsonResponse(
            {"message": "El usuario ha sido activado con éxito", "type": "SUCCESS"}
        )
    else:
        # if user does not exists or it is not activated
        if not user.active:
            # delete the account
            user.delete()
            # return error message
            return JsonResponse(
                {
                    "message": "El usuario no ha podido ser activado, intente el registro nuevamente.",
                    "type": "ERROR",
                }
            )
        # return error message
        return JsonResponse(
            {"message": "El usuario no ha podido ser activado, intente nuevamente.", "type": "ERROR"}
        )
