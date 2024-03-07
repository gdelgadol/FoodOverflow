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
