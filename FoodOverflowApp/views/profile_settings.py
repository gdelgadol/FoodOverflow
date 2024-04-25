from ..models import Profile
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from ..tokens import account_activation_token
from django.contrib.auth.hashers import check_password
from django.http import JsonResponse
from ..views.token import decode_jwt
from decouple import config
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
import json

#Delete user Account
def delete_user(request):
    #get frontend data
    data = json.loads(request.body)
    jwt_token_decoded = decode_jwt(data.get('jwt'))
    user_password = data.get('password')

    #Check if user exists
    if Profile.objects.filter(username = jwt_token_decoded['username']).exists():

        #get user model field
        user = Profile.objects.get(username = jwt_token_decoded['username'])

        #Check the ingresed password
        if check_password(user_password, user.password):
            #Delete the user
            user.delete()
            return JsonResponse({
                'type' : 'SUCCESS', 
                'message' : 'El usuario ha sido eliminado con éxito.'
                })
        else:
            # wrong password
            return JsonResponse({
                'type' : 'ERROR', 
                'message' : 'La contraseña ingresada es incorrecta.'
                })
    else:
        #Catch some error
        return JsonResponse({
            'type' : 'ERROR', 
            'message' : 'Ha ocurrido un error, intenta nuevamente.'
            })

#Update username
def update_username(request):
    #get frontend data
    data = json.loads(request.body)
    jwt_token_decoded = decode_jwt(data.get('jwt'))
    user_password = data.get('password')
    user_new_username = data.get('new_username')

    #Check if user exists
    if Profile.objects.filter(username = jwt_token_decoded['username']).exists():

        #get user model field
        user = Profile.objects.get(username = jwt_token_decoded['username'])

        #Check the ingresed password
        if check_password(user_password, user.password):
            
            #Check if the neu username is available
            if Profile.objects.filter(username = user_new_username).exists():
                return JsonResponse({
                    'type' : 'ERROR',
                    'message' : f'El nombre de usuario {user_new_username} no está disponible.'
                })
            #Update the new data
            user.username = user_new_username
            user.save()
            return JsonResponse({
                'type' : 'SUCCESS', 
                'message' : 'El nombre de usuario ha sido cambiado con éxito.'
                })
        else:
            # wrong password
            return JsonResponse({
                'type' : 'ERROR', 
                'message' : 'La contraseña ingresada es incorrecta.'
                })
    else:
        #Catch some error
        return JsonResponse({
            'type' : 'ERROR', 
            'message' : 'Ha ocurrido un error, intenta nuevamente.'
            })

#Update user account
def update_password(request):
    #get frontend data
    data = json.loads(request.body)
    jwt_token_decoded = decode_jwt(data.get('jwt'))
    user_password = data.get('password')
    user_new_password = data.get('new_password')
    user_check_new_password = data.get('new_password_confirm')

    # Check if the new password are the same
    if user_new_password != user_check_new_password:
        return JsonResponse({
            'type' : 'ERROR', 
            'message' : 'Las contraseñas no coinciden.'
        })

    #Check if user exists
    if Profile.objects.filter(username = jwt_token_decoded['username']).exists():

        #get user model field
        user = Profile.objects.get(username = jwt_token_decoded['username'])

        #Check the ingresed password
        if check_password(user_password, user.password):
            #Update the new data
            user.set_password(user_new_password)
            user.save()
            return JsonResponse({
                'type' : 'SUCCESS', 
                'message' : 'La contraseña ha sido actualizada con éxito.'
                })
        else:
            # wrong password
            return JsonResponse({
                'type' : 'ERROR', 
                'message' : 'La contraseña ingresada es incorrecta.'
                })
    else:
        #Catch some error
        return JsonResponse({
            'type' : 'ERROR', 
            'message' : 'Ha ocurrido un error, intenta nuevamente.'
            })

#update user email
def update_email(request):
    #get frontend data
    data = json.loads(request.body)
    jwt_token_decoded = decode_jwt(data.get('jwt'))
    user_password = data.get('password')
    user_new_email = data.get('new_email')

    #Check if user exists
    if Profile.objects.filter(username = jwt_token_decoded['username']).exists():

        #get user model field
        user = Profile.objects.get(username = jwt_token_decoded['username'])

        #Check the ingresed password
        if check_password(user_password, user.password):

            #Send email for confirmate email
            confirm_email(request, user, user_new_email)
            
            return JsonResponse({
                'type' : 'SUCCESS', 
                'message' : 'Por favor, confirma tu cuenta de correo electrónico para poder realizar el cambio.'
                })
        else:
            # wrong password
            return JsonResponse({
                'type' : 'ERROR', 
                'message' : 'La contraseña ingresada es incorrecta.'
                })
    else:
        #Catch some error
        return JsonResponse({
            'type' : 'ERROR', 
            'message' : 'Ha ocurrido un error, intenta nuevamente.'
            })

#Send email function
def confirm_email(request, user, to_email):
    # Define the email subject
    mail_subject = "Confirma tu correo de FoodOverflow para realizar el cambio"
    # Define the email message
    message = render_to_string(
        "email_templates/confirm_email.html",
        {
            "user": user.username,
            "domain": config("FRONT_HOST"),
            "uid": urlsafe_base64_encode(force_bytes(user.pk)),
            "token": account_activation_token.make_token(user),
            "email": to_email,
            "protocol": "https" if request.is_secure() else "http",
        },
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

#Update the email
def email_confirmated(request, uidb64, token, email):
    print(email)
    try:
        #decode the uid
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = Profile.objects.get(id=uid)
    except (TypeError, ValueError, OverflowError, Profile.DoesNotExist):
        #Some errors
        user = None
        return JsonResponse({
            'type' : 'ERROR',
            'message' : 'Algo ha salido mal. Por favor intentalo de nuevo.'
        })
    
    #Verify token
    if account_activation_token.check_token(user, token):
        print(user.email, email)
        user.email = email
        user.save()
        # Email updated Successfully
        return JsonResponse({
            'type' : 'SUCCESS',
            'message' : 'El correo electrónico ha sido actualizado con éxito.'
        })
    else:
        return JsonResponse({
            'type' : 'ERROR',
            'message' : 'Algo ha salido mal. Por favor intentalo de nuevo.'
        })