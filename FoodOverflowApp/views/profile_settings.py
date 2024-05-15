from ..models import Profile, Avatar
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from ..tokens import account_activation_token
from django.contrib.auth.hashers import check_password
from ..views.token import decode_jwt
from decouple import config
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
import json
from .modules import error_response, success_response, get_if_exists

#Delete user Account
def delete_user(request):
    try:
        #get frontend data
        data = json.loads(request.body)
        jwt_token_decoded = decode_jwt(data.get('jwt'))
        user_password = data.get('password')

        #Check if user exists
        #get user model field
        user = get_if_exists(Profile, {'username' : jwt_token_decoded['username']})

        if user:
            #Check the ingresed password
            if check_password(user_password, user.password):
                #Delete the user
                user.delete()
                return success_response({'message' : 'El usuario ha sido eliminado con éxito.'})
            else:
                # wrong password
                return error_response('La contraseña ingresada es incorrecta.')
        else:
            #Catch some error
            return error_response("Ha ocurrido un error, intenta nuevamente.")
    except Exception as e:
        print(str(e))
        return error_response("Ha ocurrido un error, intenta nuevamente.")

#Update username
def update_username(request):
    try:
        #get frontend data
        data = json.loads(request.body)
        jwt_token_decoded = decode_jwt(data.get('jwt'))
        user_password = data.get('password')
        user_new_username = data.get('new_username')

        #Check if user exists
        user = get_if_exists(Profile, {'username' : jwt_token_decoded['username']})
        if user:

            #Check the ingresed password
            if check_password(user_password, user.password):
                
                #Check if the neu username is available
                if Profile.objects.filter(username = user_new_username).exists():
                    return error_response(f'El nombre de usuario {user_new_username} no está disponible.')
                #Update the new data
                user.username = user_new_username
                user.save()
                return success_response({'message' : 'El nombre de usuario ha sido cambiado con éxito.'})
            else:
                # wrong password
                return error_response("La contraseña ingresada es incorrecta")
        else:
            #Catch some error
            return error_response("Ha ocurrido un error, intenta nuevamente.")
    except Exception as e:
        print(str(e))
        return error_response("Ha ocurrido un error, intenta nuevamente.")

#Update user account
def update_password(request):
    try:
        #get frontend data
        data = json.loads(request.body)
        jwt_token_decoded = decode_jwt(data.get('jwt'))
        user_password = data.get('password')
        user_new_password = data.get('new_password')
        user_check_new_password = data.get('new_password_confirm')

        # Check if the new password are the same
        if user_new_password != user_check_new_password:
            return error_response('Las contraseñas no coinciden.')

        #Check if user exists
        if Profile.objects.filter(username = jwt_token_decoded['username']).exists():

            #get user model field
            user = Profile.objects.get(username = jwt_token_decoded['username'])

            #Check the ingresed password
            if check_password(user_password, user.password):
                #Update the new data
                user.set_password(user_new_password)
                user.save()
                return success_response({'message' : 'La contraseña ha sido actualizada con éxito.'})
            else:
                # wrong password
                return error_response("La contraseña ingresada es incorrecta")
        else:
            #Catch some error
            return error_response("Ha ocurrido un error, intenta nuevamente.")
    except Exception as e:
        print(str(e))
        return error_response("Ha ocurrido un error, intenta nuevamente.")
    
#update avatar
def update_avatar(request):
    try:
        #get frontend data
        data = json.loads(request.body)
        if data.get('jwt'):
            jwt_token_decoded = decode_jwt(data.get('jwt'))
            if not jwt_token_decoded:
                return error_response("Ha ocurrido un error, Inténta iniciar sesión de nuevo.")

        profile = get_if_exists(Profile, {'username' : jwt_token_decoded['username']})
        if not profile:
            return error_response('El perfil que estás buscando no existe.')

        if data.get('avatar_id'):
            avatar = get_if_exists(Avatar, {"pk" : int(data.get('avatar_id'))})
            if not avatar:
                return error_response("Avatar no válido.")

        profile.avatar_id = avatar
        profile.save()

        return success_response({'message' : 'El avatar ha sido actualizado.'})

    except Exception as e:
        print(e)
        return error_response("Ha ocurrido un error, intenta nuevamente.")

#update description
def update_description(request):
    try:
        #get frontend data
        data = json.loads(request.body)
        if data.get('jwt'):
            jwt_token_decoded = decode_jwt(data.get('jwt'))
            if not jwt_token_decoded:
                return error_response("Ha ocurrido un error, Inténta iniciar sesión de nuevo.")

        profile = get_if_exists(Profile, {'username' : jwt_token_decoded['username']})
        if not profile:
            return error_response('El perfil que estás buscando no existe.')

        profile.description = data.get('description')
        profile.save()

        return success_response({'message' : 'La descripción ha sido actualizada.'})

    except Exception as e:
        print(e)
        return error_response("Ha ocurrido un error, intenta nuevamente.")

#update user email
def update_email(request):
    try:
        #get frontend data
        data = json.loads(request.body)
        jwt_token_decoded = decode_jwt(data.get('jwt'))
        user_password = data.get('password')
        user_new_email = data.get('new_email')

        #Check if user exists
        user = get_if_exists(Profile, {'username' : jwt_token_decoded['username']})
        if user:
            #Check the ingresed password
            if check_password(user_password, user.password):

                #Send email for confirmate email
                confirm_email(request, user, user_new_email)
                
                return success_response({'message' : 'Por favor, confirma tu cuenta de correo electrónico para poder realizar el cambio.'})
            else:
                # wrong password
                return error_response("La contraseña ingresada es incorrecta")
        else:
            #Catch some error
            return error_response("Ha ocurrido un error, intenta nuevamente.")
    except Exception as e:
        print(str(e))
        return error_response("Ha ocurrido un error, intenta nuevamente.")

#Send email function
def confirm_email(request, user, to_email):
    try:
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
    except Exception as e:
        return error_response(str(e))

#Update the email
def email_confirmated(request, uidb64, token, email):
    try:
        #decode the uid
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = Profile.objects.get(id=uid)
    except (TypeError, ValueError, OverflowError, Profile.DoesNotExist):
        #Some errors
        user = None
        return error_response("Algo ha salido mal. Por favor intentalo de nuevo.")
    
    try:
        #Verify token
        if user.email == email:
            return success_response({'message' : 'El correo electrónico ha sido actualizado previamente.'})
        elif account_activation_token.check_token(user, token):
            user.email = email
            user.save()
            # Email updated Successfully
            return success_response({'message' : 'El correo electrónico ha sido actualizado con éxito.'})
        else:
            return error_response('Algo ha salido mal. Por favor intentalo de nuevo.')
    except Exception as e:
        print(str(e))
        return error_response("Ha ocurrido un error intentalo nuevamente.")