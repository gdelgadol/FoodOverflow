from ..models import Publication, PublicationComment, PublicationVote
from ..models import Recipe, RecipeComment, RecipeVote
from ..models import Profile, SavedPost
from ..models import Notification
from ..views.token import decode_jwt
from decouple import config
from .publications import save_publication
from .recipes import save_recipe
from .modules import *

import json

#Delete comments and posts  
def delete_comment(request, identifier):
    try:
        data = json.loads(request.body)

        if data.get("jwt"):
            jwt_decoded = decode_jwt(data.get("jwt"))
        else:
            return error_response("Ha ocurrido un error, inténtalo de nuevo.")
        
        comment_id = data.get("comment_id")

        if identifier == 'publication':
            comment = get_if_exists(PublicationComment, {'publication_comment_id' : comment_id})
            if not comment:
                return error_response('El comentario que estás intentando eliminar no existe.')

            if jwt_decoded["username"] == comment.profile.username  or jwt_decoded["is_admin"]:
                comment.delete()
                return success_response({"message" : "El comentario ha sido eliminada con éxito."})
            
        elif identifier == 'recipe':
            comment = get_if_exists(RecipeComment,{'recipe_comment_id' : comment_id})
            if not comment:
                return error_response('El comentario que estás intentando eliminar no existe.')

            if jwt_decoded["username"] == comment.profile.username or jwt_decoded["is_admin"]:
                comment.delete()
                return success_response({"message" : "El comentario ha sido eliminada con éxito."})
            
        return error_response("Ha ocurrido un error, inténtalo de nuevo.")
    
    except Exception as e:
        print(str(e))
        return error_response("Ha ocurrido un error, inténtalo de nuevo.")

#Delete posts    
def delete_post(request, identifier):
    try:
        data = json.loads(request.body)

        if data.get("jwt"):
            jwt_decoded = decode_jwt(data.get("jwt"))
        else:
            return error_response("Ha ocurrido un error, inténtalo de nuevo.")
        
        post_id = data.get("post_id")

        if identifier == 'publication':
            
            publication = get_if_exists(Publication,{'publication_id' : post_id})
            if not publication:
                return error_response("La publicación que estás intentando eliminar no existe.")

            if jwt_decoded["username"] == publication.profile.username or jwt_decoded["is_admin"]:
                publication.delete()
                return success_response({"message" : "La publicación ha sido eliminada con éxito."})
            
        elif identifier == 'recipe':
            recipe = get_if_exists(Recipe, {'recipe_id' : post_id})
            if not recipe:
                return error_response("La receta que estás intentando eliminar no existe.")

            if jwt_decoded["username"] == recipe.profile.username or jwt_decoded["is_admin"]:
                recipe.delete()
                return success_response({"message" : "La receta ha sido eliminada con éxito."})
            
        return error_response("Ha ocurrido un error, inténtalo de nuevo.")
    except Exception as e:
        print(str(e))
        return error_response("Ha ocurrido un error, inténtalo de nuevo.")
    
#------------------Vote and comment controllers--------------------------#
#Cast a vote
def make_vote(request, id_vote):
    try:
        data = json.loads(request.body)
        post_id = int(data.get("post_id"))
        vote_type = int(data.get("vote_type"))

        if data.get("jwt"):
            jwt_decoded = decode_jwt(data.get("jwt"))
        else:
            return error_response("El usuario no ha iniciado sesión.")

        profile = get_if_exists(Profile, {'pk' : jwt_decoded["id"]})
        if not profile:
            return error_response("El usuario no se encuentra registrado.")       

        if id_vote == "recipe":
            recipe = get_if_exists(Recipe, {'pk' : post_id})
            if not recipe:
                return error_response("La receta no se encuentra registrada.")
            
            vote = get_if_exists(RecipeVote, {'recipe' : recipe, 'profile' : profile})
            if vote_type == 0: 
                if vote:
                    vote.delete()
                    return success_response({"message" : "Voto eliminado con éxito."})
            elif vote_type != 0:
                if vote:
                    vote.vote_type = vote_type
                    vote.save()
                else:
                    RecipeVote.objects.create_recipe_vote(recipe, profile, vote_type)
                return success_response({"message" : "Voto registrado con éxito."})
            else: 
                return error_response("Hubo un error, inténtelo de nuevo")
        elif id_vote == "publication":
            publication = Publication.objects.get(pk = post_id)
            if not publication:
                return error_response("La publicación no se encuentra registrada.")
            
            vote = get_if_exists(PublicationVote, {'publication' : publication, 'profile' : profile})
            if vote_type == 0:
                if vote:
                    vote.delete()
                    return success_response({"message" : "Voto eliminado con éxito."})
            elif vote_type != 0:
                if vote:
                    vote.vote_type = vote_type
                    vote.save()
                else:
                    PublicationVote.objects.create_publication_vote(publication, profile, vote_type)
                return success_response({"message" : "Voto registrado con éxito."})
            else: 
                return error_response("Hubo un error, inténtelo de nuevo") 
            
        else:
            return error_response("Hubo un error, inténtelo de nuevo")
    except Exception as e:
        print(e)
        # Catch all other exceptions
        return error_response("Hubo un error, inténtelo de nuevo")

#Create a comment   
def create_comment(request, id_comment):
    try:
        data = json.loads(request.body)
        post_id = int(data.get("post_id"))
        content = data.get("content")

        if data.get("jwt"):
            jwt_decoded = decode_jwt(data.get("jwt"))
            if not jwt_decoded:
                error_response('Ha ocurrido un error, inténta iniciar sesión nuevamente.')
        else:
            return error_response('Ha ocurrido un error, inténtalo más tarde.')

        url = config('FRONT_HOST')

        profile = get_if_exists(Profile, {'pk' : jwt_decoded["id"]})
        if not profile:
            return error_response("El usuario no se encuentra registrado.")
        
        if id_comment == "recipe":
            recipe = get_if_exists(Recipe, {'pk' : post_id})
            if not recipe:
                return error_response("La receta no se encuentra registrada.")            
            
            author = Profile.objects.get(pk = recipe.profile_id)
            RecipeComment.objects.create_recipe_comment(profile, recipe, content)

            url += f'/{id_comment}/{post_id}'
            message = f'El usuario {profile.username} ha comentado en tu receta: {recipe.recipe_title}. {url}.'
            
            Notification.objects.notify_recipe(author, recipe, message)
            
            return success_response({"message" : "¡Comentario creado con éxito!"})
        
        elif id_comment == "publication":
            publication = get_if_exists(Publication, {'pk' : post_id})
            if not publication:
                return error_response("La publicación no se encuentra registrada.")
            
            author = Profile.objects.get(pk = publication.profile_id)

            PublicationComment.objects.create_publication_comment(profile, publication, content)

            url += f'/{id_comment}/{post_id}'
            message = f'El usuario {profile.username} ha comentado en tu publicación: {publication.publication_title}. {url}.'

            Notification.objects.notify_publication(author, publication, message)
            
            return success_response({"message" : "¡Comentario creado con éxito!"})
        
    except Exception as e:
        print(e)
        # Catch all other exceptions
        return error_response("Hubo un error, inténtelo de nuevo")
    
#Reply to a comment
def create_comment_response(request, id_comment):
    try:
        data = json.loads(request.body)
        post_id = int(data.get("post_id"))
        comment_id = data.get("comment_id")
        content = data.get("content")

        if data.get("jwt"):
            jwt_decoded = decode_jwt(data.get("jwt"))
            if not jwt_decoded:
                error_response('Ha ocurrido un error, inténta iniciar sesión nuevamente.')
        else:
            return error_response('Ha ocurrido un error, inténtalo más tarde.')

        url = config('FRONT_HOST')

        profile = get_if_exists(Profile, {'pk' : jwt_decoded["id"]})
        if not profile:
            return error_response("El usuario no se encuentra registrado.")
        
        if id_comment == "recipe":
            recipe = get_if_exists(Recipe, {'pk' : post_id})
            if not recipe:
                return error_response("La receta no se encuentra registrada.")
            
            recipe_comment = get_if_exists(RecipeComment, {'pk' : comment_id})
            if not recipe_comment:
                return error_response("No existe el comentario al que quiere responder.")
            
            RecipeComment.objects.create_recipe_comment_response(profile, recipe, content, recipe_comment)

            author = Profile.objects.get(pk = recipe_comment.profile_id)

            url += f'/{id_comment}/{post_id}'
            message = f'El usuario {profile.username} ha respondido a tu comentario en la receta: {recipe.recipe_title}. {url}.'

            Notification.objects.notify_recipe(author, recipe, message)
            
            return success_response({"message" : "¡Respuesta creada con éxito!"})
        
        elif id_comment == "publication":
            publication = get_if_exists(Publication, {'pk' : post_id})
            if not publication:
                return error_response("La publicación no se encuentra registrada.")
            
            publication_comment = get_if_exists(PublicationComment, {'pk' : comment_id})
            if not publication_comment:
                return error_response("No existe el comentario al que quiere responder.")
            
            PublicationComment.objects.create_publication_comment_response(profile, publication, content, publication_comment)

            author = Profile.objects.get(pk = publication_comment.profile_id)

            url += f'/{id_comment}/{post_id}'
            message = f'El usuario {profile.username} ha respondido a tu comentario en la publicación: {publication.publication_title}. {url}.'

            Notification.objects.notify_publication(author, publication, message)

            return success_response({"message" : "¡Respuesta creada con éxito!"})
        
    except Exception as e:
        print(e)
        # Catch all other exceptions
        return error_response("Hubo un error, inténtelo de nuevo")

#get user's publication
def get_user_posts(request, user_identifier, identifier):
    try:
        data = json.loads(request.body)
        
        if user_identifier == "profile":
            if data.get("jwt"):
                jwt_decoded = decode_jwt(data.get("jwt"))
                if not jwt_decoded:
                    return error_response('Ha ocurrido un error, inténta iniciar sesión nuevamente.')
            else:
                return error_response("El usuario no ha iniciado sesión.")
            
            profile = get_if_exists(Profile, {'id' : jwt_decoded["id"]})
            if not profile:
                return error_response("El usuario no se encuentra registrado.")
        else:
            profile = get_if_exists(Profile, {'username' : user_identifier})
            if not profile:
                return error_response("El usuario no se encuentra registrado.")        
        if identifier == "recipes":
            posts = get_all_posts([Recipe, RecipeComment, RecipeVote], {'profile' : profile}, identifier, f'{identifier[0:-1]}_creation_date')
        elif identifier == "publications":
            posts = get_all_posts([Publication, PublicationComment, PublicationVote], {'profile' : profile}, identifier, f'{identifier[0:-1]}_creation_date')
        else:
            return error_response("Ha ocurrido un error, inténtalo de nuveo.")
        return success_response({"posts" : posts})
    except Exception as e:
        print(e)
        return error_response(str(e))
    
#get user's saved posts
def get_saved_posts(request, identifier):
    try:
        data = json.loads(request.body)
        
        if data.get("jwt"):
            jwt_decoded = decode_jwt(data.get("jwt"))
            if not jwt_decoded:
                return error_response('Ha ocurrido un error, inténta iniciar sesión nuevamente.')
        else:
            return error_response("El usuario no ha iniciado sesión.")
        
        profile = get_if_exists(Profile, {'id' : jwt_decoded["id"]})
        if not profile:
            return error_response("El usuario no se encuentra registrado.")
        
        if identifier == "recipes":
            posts = get_all_posts([SavedPost, RecipeComment, RecipeVote], {'profile' : profile, 'publication' : None}, identifier, 'recipe', save = True)
        elif identifier == "publications":
            posts = get_all_posts([SavedPost, PublicationComment, PublicationVote], {'profile' : profile, 'recipe' : None}, identifier, 'publication', save = True)
        else:
            return error_response("Ha ocurrido un error, inténtalo de nuveo.")
            
        return success_response({"posts" : posts})
    except Exception as e:
        print(e)
        return error_response(str(e))

#Save posts controller
def save_posts(request, identifier):
    if identifier == "recipe":
        return save_recipe(request)
    elif identifier == "publication":
        return save_publication(request)
    else: 
        return error_response(f'{identifier} no es un identificador válido.')