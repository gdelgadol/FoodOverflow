from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.auth.hashers import make_password
from django.utils.datastructures import MultiValueDictKeyError
from django.shortcuts import render, redirect
from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_bytes, force_str
from django.template.loader import render_to_string
from ..tokens import account_activation_token
from django.http import HttpResponseNotFound
from smtplib import SMTPRecipientsRefused
from django.core.mail import EmailMessage
from django.shortcuts import redirect
from django.db import IntegrityError
from django.contrib import messages
from ..models import Profile
import json
from decouple import config
from django.urls import reverse
from django.shortcuts import redirect
from django.http import JsonResponse

# Create and send reset link to email if user exists


def password_reset(request):
    try:
        data = json.loads(request.body)
        user_email = data.get("email")
        if Profile.objects.filter(email=user_email).exists():
            user = Profile.objects.get(email__exact = user_email)
            send_email(request, user, user.email)
            return JsonResponse({"message": "Correo enviado", "type": "SUCCESS"})
        else:
            return JsonResponse({"message": "El usuario no existe", "type": "ERROR"})
    except:
        user_email=False


# If link is valid send reset form and check if form is valid for the user

def reset(request, uidb64, token):
    try:
        data = json.loads(request.body)
        new_password = data.get("password")
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = Profile.objects.get(id=uid)
    except (TypeError, ValueError, OverflowError, Profile.DoesNotExist):
        user = None
    if user is not None and account_activation_token.check_token(user, token):
        user.set_password(new_password)
        user.save()
        return JsonResponse({"message":"Contraseña reseteada"})
    else:
        return JsonResponse({"message":"Link no es válido"})


def send_email(request, user, to_email):
    mail_subject = "Restablece tu contraseña de FoodOverflow"
    message = render_to_string(
        "email_templates/pass_reset.html",
        {
            "user": user.username,
            "domain": config('FRONT_HOST'),
            "uid": urlsafe_base64_encode(force_bytes(user.pk)),
            "token": account_activation_token.make_token(user),
            "protocol": "https" if request.is_secure() else "http",
        },
    )
    email = EmailMessage(mail_subject, message, to=[to_email])
    email.send()