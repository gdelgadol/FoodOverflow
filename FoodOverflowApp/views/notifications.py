from ..models import Profile
from ..models import Notification
from django.http import JsonResponse
from ..views.token import decode_jwt
import re
import json

def get_user_notifications(request):
    try:
        data = json.loads(request.body)
        if data.get("jwt"):
            jwt_decoded = decode_jwt(data.get("jwt"))
        else:
            return JsonResponse({
                "type" : "ERROR",
                "message" : "Ha ocurrido un error, inténtalo de nuevo."
                })

        user = Profile.objects.get(username = jwt_decoded["username"])

        notification_query = Notification.objects.filter(profile_id = user.id)

        notifications = []

        for notification in notification_query:
            # Define a regex pattern to match URLs of the form "/recipe/id" or "/publication/id"
            url_pattern = r'/(?:recipe|publication)/\d+'

            # Find all matching patterns in the message using the regex pattern
            urls = re.findall(url_pattern, notification.message)

            # Assuming there's only one URL in the message, you can access it like this
            if urls:
                extracted_url = urls[0]
                print("Extracted URL:", extracted_url)
            else:
                return JsonResponse ({
                    "message":"No URL of the specified format found in the message.",
                    "type":"ERROR"
                })

            notification_data = {
                "notification_id": notification.notification_id,
                "message": notification.message,
                "url": extracted_url
            }

            notifications.append(notification_data)
        
        return JsonResponse ({"type":"SUCCESS", "notifications":notifications})
    except Exception as e:
        print(str(e))
        return JsonResponse ({"message": "Hubo en error","type": "ERROR"})

def delete_user_notification(request):
    try:
        data = json.loads(request.body)
        if data.get("jwt"):
            jwt_decoded = decode_jwt(data.get("jwt"))
        else:
            return JsonResponse({
                "type" : "ERROR",
                "message" : "Ha ocurrido un error, inténtalo de nuevo."
                })
        
        notification_id = data.get("notification_id")

        notification = Notification.objects.get(pk = notification_id)

        if jwt_decoded["username"] == notification.profile.username:
            notification.delete()
            return JsonResponse({
                "type" : "SUCCESS",
                "message" : "La notificación ha sido eliminada con éxito."
            })
        else:
            return JsonResponse({
                "type" : "ERROR",
                "message" : "El usuario no es el dueño de la notificación"
            })
    except Exception as e:
        print(str(e))
        return JsonResponse ({"message": "Hubo en error","type": "ERROR"})
    
def delete_all_notifications(request):
    try:
        data = json.loads(request.body)
        if data.get("jwt"):
            jwt_decoded = decode_jwt(data.get("jwt"))
        else:
            return JsonResponse({
                "type" : "ERROR",
                "message" : "Ha ocurrido un error, inténtalo de nuevo."
                })
        
        user = Profile.objects.get(username = jwt_decoded["username"])

        try:
            Notification.objects.filter(profile_id = user.id).delete()
            return JsonResponse ({
                "type":"SUCCESS",
                "message":"Todas las notificaciones eliminadas con éxito"
            })
        except Exception as e:
            print(str(e))
            return JsonResponse ({"message": "Hubo en error al borrar las notificaciones","type": "ERROR"})

    except Exception as e:
        print(str(e))
        return JsonResponse ({"message": "Hubo en error","type": "ERROR"})
    
