from ..models import Profile
from ..models import Notification, Recipe, RecipeComment, Publication, PublicationComment
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
            if user.is_admin:
                extracted_url = notification.message.split(". ")[-1]
            else:
                # Define a regex pattern to match URLs of the form "/recipe/id" or "/publication/id"
                url_pattern = r'/(?:recipe|publication)/\d+'

                # Find all matching patterns in the message using the regex pattern
                urls = re.findall(url_pattern, notification.message)

                # Assuming there's only one URL in the message, you can access it like this
                if urls:
                    extracted_url = urls[0]
                else:
                    extracted_url = ""

            notification_data = {
                "notification_id": notification.notification_id,
                "message": notification.message,
                "url": extracted_url
            }

            notifications.append(notification_data)
        
        return JsonResponse ({"type":"SUCCESS", "notifications" :notifications})
    except Exception as e:
        print(str(e))
        return JsonResponse ({"message": "Hubo en error","type": "ERROR"})

def delete_user_notification(request):
    try:
        data = json.loads(request.body)
        if data.get("jwt"):
            jwt_decoded = decode_jwt(data.get("jwt"))
            if jwt_decoded["is_admin"]:
                return JsonResponse({
                "type" : "SUCCESS",
                "message" : "Soy Admin."
                })
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
    
#Report comments or publications
def report(request, identifier):
    try:
        data = json.loads(request.body)
        
        admins = Profile.objects.filter(is_admin = True)

        id = data.get("id")
        message = data.get("message")

        url = ""
        if not decode_jwt(data.get("jwt")):
            return JsonResponse({
                "type" : "ERROR", 
                "message" : "El usuario debe iniciar sesión para reportar una publicación."
                })
        
        recipe = None
        publication = None
        
        if identifier == "publication":
            if Publication.objects.filter(publication_id = id).exists():
                publication = Publication.objects.get(publication_id = id)
            else:
                return JsonResponse({
                    "type" : "ERROR", 
                    "message" : "La publicación que estás reportando no existe."
                    })
            url += f'{identifier}/{id}'
            message = f'La publicación con id {id} ha sido reportada por {message}. {url}'
            identifier = "Publicación reportada"
        elif identifier == "recipe":
            if Recipe.objects.filter(recipe_id = id).exists():
                recipe = Recipe.objects.get(recipe_id = id)
            else:
                return JsonResponse({
                    "type" : "ERROR", 
                    "message" : "La receta que estás reportando no existe."
                    })
            url += f'{identifier}/{id}'
            message = f'La receta con id {id} ha sido reportada por {message}. {url}'
            identifier = "Receta reportada"
        elif identifier == "publication_comment":
            if PublicationComment.objects.filter(publication_comment_id = id).exists():
                publication_comment = PublicationComment.objects.get(publication_comment_id = id)
            else:
                return JsonResponse({
                    "type" : "ERROR", 
                    "message" : "El comentario que estás reportando no existe."
                    })
            publication = publication_comment.publication
            publication_id = publication.publication_id
            url += f'publication/{publication_id}'
            message = f'El comentario con id {id} en la publicación con id {publication_id} ha sido reportada por {message}.'
            identifier = "Comentario reportado"
        elif identifier == "recipe_comment":
            if RecipeComment.objects.filter(recipe_comment_id = id).exists():
                recipe_comment = RecipeComment.objects.get(recipe_comment_id = id)
            else:
                return JsonResponse({
                    "type" : "ERROR", 
                    "message" : "El comentario que estás reportando no existe."
                    })
            recipe = recipe_comment.recipe
            recipe_id = recipe.recipe_id
            url += f'recipe/{recipe_id}'
            message = f'El comentario con id {id} en la receta con id {recipe_id} ha sido reportada por {message}. {url}'
            identifier = "Comentario reportado"
        else:
            print(identifier, " no es un identificador valido.")
            return JsonResponse({
                "type" : "ERROR", 
                "message" : "Ha ocurruido un error, intentalo de nuevo."
                })
        
        for admin in admins:
            if publication:
                Notification.objects.notify_publication(admin, publication, message)
            elif recipe:
                Notification.objects.notify_recipe(admin, recipe, message)
        
        return JsonResponse({
                "type" : "SUCCESS", 
                "message" : f'{identifier} con éxito. Nuestros administradores revisarán tu petición.'
                })
    except Exception as e:
        print(e)
        return JsonResponse({
            "type" : "ERROR", 
            "message" : "Ha ocurruido un error, intentalo de nuevo."
            })