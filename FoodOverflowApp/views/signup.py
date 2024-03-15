from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
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
from django.http import JsonResponse

def signup(request):
    try:
        data = json.loads(request.body)
        try:
            if data.get("password") == data.get("check_password"):
                userName = data.get('username')
                email = data.get('email')
                user = Profile.objects.create_user(username=userName,
                                                   password=data.get("password"),
                                                   email=email.lower())
                activateEmail(request, user, user.email)
                return JsonResponse({"message":"¡Usuario creado con éxito!", "type":"SUCCESS"})
            else:
                return JsonResponse({"message":"Las contraseñas no coinciden.", "type": "ERROR"})
        except IntegrityError:
            return JsonResponse({"message": "El usuario ya existe", "type": "ERROR"})
    except MultiValueDictKeyError:
        userName = False
        userPassword = False
        checkUserPassword = False
        email = False

def activateEmail(request, user, to_email):
    mail_subject = "Activa tu cuenta de Calistopia"
    message = render_to_string(
        "email_templates/activation.html",
        {
            "user": user.username,
            "domain": get_current_site(request).domain,
            "uid": urlsafe_base64_encode(force_bytes(user.pk)),
            "token": account_activation_token.make_token(user),
            "protocol": "https" if request.is_secure() else "http",
        },
    )
    email = EmailMessage(mail_subject, message, to=[to_email])
    email.send()

def activate(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = Profile.objects.get(id=uid)
    except (TypeError, ValueError, OverflowError, Profile.DoesNotExist):
        user = None
    if user is not None and account_activation_token.check_token(user, token):
        user.active = True
        user.save()
        return JsonResponse({"message": "El usuario ha sido activado con éxito", "type": "SUCCESS"})
    else:
        if not user.active:
            user.delete()
            return JsonResponse({"message": "El usuario no ha podido ser activado, intente el registro nuevamente.", "type": "ERROR"})
        return JsonResponse(
            {"message": "El usuario no ha podido ser activado.", "type": "ERROR"})