from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.template.loader import render_to_string
from ..tokens import account_activation_token
from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags
from ..models import Profile
import json
from decouple import config
from .modules import error_response, success_response

# Create and send reset link to email if user exists


def password_reset(request):
    try:
        data = json.loads(request.body)
        user_email = data.get("email")
        if Profile.objects.filter(email=user_email).exists():
            user = Profile.objects.get(email__exact = user_email)
            send_email(request, user, user.email)
            return success_response({"message": "Correo enviado"})
        else:
            return error_response("El usuario no existe.")
    except Exception as e:
        print(str(e))
        user_email=False
        return error_response("Ha ocurrido un error, intenta nuevamente.")
        


# If link is valid send reset form and check if form is valid for the user

def reset(request, uidb64, token):
    try:
        data = json.loads(request.body)
        new_password = data.get("password")
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = Profile.objects.get(id=uid)
    except (TypeError, ValueError, OverflowError, Profile.DoesNotExist):
        user = None

    try:
        if user is not None and account_activation_token.check_token(user, token):
            user.set_password(new_password)
            user.save()
            return success_response({"message":"Contraseña reseteada."})
        else:
            return error_response("Link no es válido")
    except Exception as e:
        print(str(e))
        return error_response("Ha ocurrido un error, intenta nuevamente.")


def send_email(request, user, to_email):
    try:
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
        print(e)
        return error_response(str(e))