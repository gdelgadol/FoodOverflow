from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags
import json
from .modules import error_response, success_response

def send_pqrs(request):
    try:
        data = json.load(request)
        mail_subject = data.get("nombre") + " ha realizado una PQRS"
        message = render_to_string(
            "email_templates/pqrs.html",
            context = {
                "tipo": data.get("tipo"),
                "nombre": data.get("nombre"),
                "correo": data.get("correo"),
                "telefono": data.get("telefono"),
                "mensaje": data.get("mensaje"),
            }
        )
        plain_message = strip_tags(message)
        #Send email
        email = EmailMultiAlternatives(
            subject = mail_subject,
            body = plain_message, 
            from_email = None,
            to= ["foodoverflow2@gmail.com"]
            )
        email.attach_alternative(message, "text/html")
        email.send()
        return success_response({"message": "¡Su PQRS ha sido enviada con éxito!"})
    except Exception as e:
        print(str(e))
        return error_response("Hubo un error. Por favor, inténtelo de nuevo.")