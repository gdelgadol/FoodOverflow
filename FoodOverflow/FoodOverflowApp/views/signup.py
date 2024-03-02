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

def signup(request):
    try:
        try:
            if request.POST['password'] == request.POST['check_password']:
                userName = request.POST['username']
                email = request.POST['email']
                user = Profile.objects.create_user(username=userName,
                                                   password=request.POST["password"],
                                                   email=email.lower())
            else:
                context = {"message":"Las contraseñas no coinciden."}
                return render(request, 'login_signup/signup.html', context = context)
        except IntegrityError:
            context = {"message": "El usuario ya existe"}
            return render(request, 'login_signup/signup.html', context)
    except MultiValueDictKeyError:
        userName = False
        userPassword = False
        checkUserPassword = False
        email = False
    return render(request, 'login_signup/signup.html')
