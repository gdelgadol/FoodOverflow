from django.utils.datastructures import MultiValueDictKeyError
from django.contrib.auth.hashers import check_password
from django.contrib.auth import login as create_cookie, logout as remove_cookie
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from ..models import Profile
import json

# Log in function
def login(request):
    try:
        #get the Json Data, Email and Password
        data = json.loads(request.body)
        userEmail = data.get("email")
        userPassword = data.get("password")

        #Check if user exists
        if Profile.objects.filter(email=userEmail).exists():
            #Get the user password
            password = Profile.objects.get(email=userEmail).password
            # check the passwords
            if check_password(userPassword, password):
                #check if the user account is activated
                if Profile.objects.get(email=userEmail).active:
                    # Look for the logged in user and create the cookie
                    user = Profile.objects.get(email=userEmail)
                    create_cookie(request, user)

                    #return Success
                    return JsonResponse(
                        {"message": "¡Login exitoso!", "type": "SUCCESS"}
                    )

                else:
                    # If the account is not activated return Error
                    return JsonResponse(
                        {
                            "message": "La cuenta no ha sido activa, porfavor usa el link enviado a tu correo para activarla.",
                            "type": "ERROR",
                        }
                    )
            else:
                # If the password is wrong return Error
                return JsonResponse(
                    {
                        "message": "La contraseña ingresada no es correcta",
                        "type": "ERROR",
                    }
                )
        else:
            # If user does not exists return Error
            return JsonResponse(
                {
                    "message": "El nombre de correo electrónico no se encuentra registrado.",
                    "type": "ERROR",
                }
            )
    # If the backend response fails return error
    except MultiValueDictKeyError:
        userEmail = False
        userPassword = False
        return JsonResponse(
            {
                "message": "HA surgido un error. Intenta de nuevo.",
                "type": "ERROR",
            }
        )

# Log out function
def logout(request):
    # If user is previously logged in then remove the cookie
    if request.user.is_authenticated:
        remove_cookie(request)

# Check the user state
@ensure_csrf_cookie
def is_authenticated(request):
    # If user does not logged in then return False
    if not request.user.is_authenticated:
        return JsonResponse({'status' : False})
    # If user is logged in then return True
    return JsonResponse({'status' : True})

# Get the user data
@ensure_csrf_cookie
def user_info(request):
    # If user does not logged in then return Error
    if not request.user.is_authenticated:
        return JsonResponse({'type' : 'Error, el usuario no ha iniciado sesión.'})
    # If user is logged in then return user's data
    return JsonResponse({'username' : request.user.username})