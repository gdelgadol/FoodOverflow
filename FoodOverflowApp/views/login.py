from django.utils.datastructures import MultiValueDictKeyError
from django.contrib.auth.hashers import check_password
from django.contrib.auth import login as create_cookie, logout as remove_cookie
from django.http import JsonResponse
from ..models import Profile
from decouple import config
import json
import jwt

# Log in function
def login(request):
    try:
        #get the Json Data, Email and Password
        data = json.loads(request.body)
        user_email = data.get("email")
        user_password = data.get("password")

        #Check if user exists
        if Profile.objects.filter(email=user_email).exists():
            #Get the user password
            password = Profile.objects.get(email=user_email).password
            # check the passwords
            if check_password(user_password, password):
                #check if the user account is activated
                if Profile.objects.get(email=user_email).active:
                    # Look for the logged in user and create the cookie
                    user = Profile.objects.get(email=user_email)
                    create_cookie(request, user)
                    # Create the JWT token
                    token = create_token(request)

                    #return Success and JWT token
                    return JsonResponse(
                        {"message": "¡Login exitoso!", 
                         "type": "SUCCESS",
                         'jwt' : token}
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
        user_email = False
        user_password = False
        return JsonResponse(
            {
                "message": "Ha surgido un error. Intenta de nuevo.",
                "type": "ERROR",
            }
        )

# Log out function
def logout(request):
    # If user is previously logged in then remove the cookie
    if request.user.is_authenticated:
        remove_cookie(request)

# Get the user data
def create_token(request):
    # If user does not logged in then return Error
    if not request.user.is_authenticated:
        return JsonResponse({'type' : 'ERROR' , 'message' : 'El usuario no ha iniciado sesión.'})
    
    # If user is logged in then return user's data
    payload = {
        'is_authenticated' : request.user.is_authenticated,
        'username' : request.user.username,
    }

    #Encode the user's info
    secret = config('SECRET_JWT_KEY')
    algorithm = config('JWT_ALGORITHM')
    token = jwt.encode(payload, secret, algorithm = algorithm)

    #return token
    return token
