from ..models import Profile
from ..models import Notification, Recipe, RecipeComment, Publication, PublicationComment
from ..views.token import decode_jwt
import re
import json

from .modules import error_response, success_response, get_if_exists

def get_user_notifications(request):
    try:
        data = json.loads(request.body)
        if data.get("jwt"):
            jwt_decoded = decode_jwt(data.get("jwt"))
        else:
            return error_response("Ha ocurrido un error, inténtalo de nuevo.")

        user = Profile.objects.get(username = jwt_decoded["username"])

        notification_query = Notification.objects.filter(profile_id = user.id).order_by("-notification_id")

        notifications = []

        for notification in notification_query:
            notification_is_not_report = notification.message.split(". ")[0] != "report"
            if not notification_is_not_report:
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
        
        return success_response({"notifications" :notifications})
    except Exception as e:
        print(str(e))
        return error_response("Hubo en error, inténtalo nuevamente.")

def delete_user_notification(request):
    try:
        data = json.loads(request.body)
        if data.get("jwt"):
            jwt_decoded = decode_jwt(data.get("jwt"))
        else:
            return error_response("Ha ocurrido un error, inténtalo de nuevo.")
        
        notification_id = data.get("notification_id")

        notification = Notification.objects.get(pk = notification_id)
        notification_is_not_report = notification.message.split(". ")[0] != "report"

        if jwt_decoded["username"] == notification.profile.username:
            if notification_is_not_report or data.get("ignore_report"):
                notification.delete()
                return success_response({"message" : "Cargando vista del post."})
            return success_response({"message" : "La notificación ha sido eliminada con éxito."})
        else:
            return error_response("El usuario no es el dueño de la notificación")
    except Exception as e:
        print(str(e))
        return error_response("Hubo en error, inténtalo nuevamente.")
    
def delete_all_notifications(request):
    try:
        data = json.loads(request.body)
        if data.get("jwt"):
            jwt_decoded = decode_jwt(data.get("jwt"))
        else:
            return error_response("Ha ocurrido un error, inténtalo de nuevo.")
        
        user = Profile.objects.get(username = jwt_decoded["username"])

        try:
            Notification.objects.filter(profile_id = user.id).delete()
            return success_response({"message":"Todas las notificaciones eliminadas con éxito"})
        except Exception as e:
            print(str(e))
            return error_response("Hubo en error al borrar las notificaciones")

    except Exception as e:
        print(str(e))
        return error_response("Hubo en error, inténtalo nuevamente.")
    
#Report comments or publications
def report(request, identifier):
    try:
        data = json.loads(request.body)
        
        admins = Profile.objects.filter(is_admin = True)

        id = data.get("id")
        message = data.get("message")

        url = ""
        if not decode_jwt(data.get("jwt")):
            return error_response("El usuario debe iniciar sesión para reportar una publicación.")
        
        recipe = None
        publication = None
        
        if identifier == "publication":
            publication = get_if_exists(Publication, {'publication_id' : id})
            if not publication:
                return error_response("La publicación que estás reportando no existe.")
            url += f'{identifier}/{id}'
            message = f'report. La publicación con id {id} ha sido reportada por: {message}. {url}'
            identifier = "Publicación reportada"
        elif identifier == "recipe":
            recipe = get_if_exists(Recipe, {'recipe_id' : id})
            if not recipe:
                return error_response("La receta que estás reportando no existe.")
            url += f'{identifier}/{id}'
            message = f'report. La receta con id {id} ha sido reportada por: {message}. {url}'
            identifier = "Receta reportada"
        elif identifier == "publication_comment":
            publication_comment = get_if_exists(PublicationComment, {'publication_comment_id' : id})
            if not publication_comment:
                return error_response("El comentario que estás reportando no existe.")
            publication = publication_comment.publication
            publication_id = publication.publication_id
            url += f'publication/{publication_id}'
            message = f'report. : El comentario con id {id} ha sido reportado por {message}. {url}'
            identifier = "Comentario reportado"
        elif identifier == "recipe_comment":
            recipe_comment = get_if_exists(RecipeComment, {'recipe_comment_id' : id})
            if not recipe_comment:
                return error_response("El comentario que estás reportando no existe.")
            recipe = recipe_comment.recipe
            recipe_id = recipe.recipe_id
            url += f'recipe/{recipe_id}'
            message = f'report. : El comentario con id {id} ha sido reportado por {message}. {url}'
            identifier = "Comentario reportado"
        else:
            print(identifier, " no es un identificador valido.")
            return error_response("Ha ocurruido un error, intentalo de nuevo.")
        
        for admin in admins:
            if publication:
                Notification.objects.notify_publication(admin, publication, message)
            elif recipe:
                Notification.objects.notify_recipe(admin, recipe, message)
        
        return success_response({"message" : f'{identifier} con éxito. Nuestros administradores revisarán tu petición.'})
    except Exception as e:
        print(e)
        return error_response("Ha ocurruido un error, intentalo de nuevo.")
    
#get posts reports
def get_posts_reports(request):
    try:
        data = json.loads(request.body)
        publication = None
        recipe = None

        if data.get("publication_id"):
            
            publication = Publication.objects.get(publication_id = int(data.get("publication_id")))
        elif data.get("recipe_id"):
            recipe = Recipe.objects.get(recipe_id = int(data.get("recipe_id")))

        if data.get("jwt"):
            admin = Profile.objects.get(username = decode_jwt(data.get("jwt"))["username"])
        else:
            return error_response("Envíame un jwt.")
        

        notifications = Notification.objects.filter(profile = admin, recipe = recipe, publication = publication).order_by("-notification_id")
        messages = []

        for notification in notifications:
            if notification.message.split(". ")[0] == "report":
                messages.append({ "message" : (notification.message.split(". ")[1]).split(": ")[1], "id" : notification.notification_id})

        return success_response({"messages" : messages})
    except Exception as e:
        print(e)
        return error_response("Ha ocurruido un error, intentalo de nuevo.")