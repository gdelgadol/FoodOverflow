from django.utils.datastructures import MultiValueDictKeyError
from django.contrib.auth.hashers import check_password
from django.contrib.auth import login as cookie, logout as remove_cookie
from django.shortcuts import render, redirect
from django.contrib import messages
from django.http import JsonResponse
from ..models import Profile
import json


# Create your views here.


def login(request):
    try:
        data = json.loads(request.body)
        userEmail = data.get("email")
        userPassword = data.get("password")
        if Profile.objects.filter(email=userEmail).exists():
            password = Profile.objects.get(email=userEmail).password
            if check_password(userPassword, password):
                if Profile.objects.get(email=userEmail).active:
                    return JsonResponse(
                        {"message": "¡Login exitoso!", "type": "SUCCESS"}
                    )

                else:
                    return JsonResponse(
                        {
                            "message": "La cuenta no ha sido activa, porfavor usa el link enviado a tu correo para activarla.",
                            "type": "ERROR",
                        }
                    )
            else:
                return JsonResponse(
                    {
                        "message": "La contraseña ingresada no es correcta",
                        "type": "ERROR",
                    }
                )
        else:
            return JsonResponse(
                {
                    "message": "El nombre de correo electrónico no se encuentra registrado.",
                    "type": "ERROR",
                }
            )
    except MultiValueDictKeyError:
        userEmail = False
        userPassword = False
