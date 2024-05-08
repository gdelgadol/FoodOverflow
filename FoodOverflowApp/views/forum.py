from ..models import Publication, PublicationComment, PublicationVote
from ..models import Recipe, RecipeComment, RecipeVote
from ..models import Profile, Avatar, SavedPost
from ..models import Notification
from django.http import JsonResponse
from ..views.token import decode_jwt
from django.db.models import Sum
from decouple import config
from .publications import save_publication
from .recipes import save_recipe

import json

#Delete comments   
def delete_comment(request, identifier):
    try:
        data = json.loads(request.body)

        if data.get("jwt"):
            jwt_decoded = decode_jwt(data.get("jwt"))
        else:
            return JsonResponse({
                "type" : "ERROR",
                "message" : "Ha ocurrido un error, inténtalo de nuevo."
                })
        
        comment_id = data.get("comment_id")

        if identifier == 'publication':
            if PublicationComment.objects.filter(publication_comment_id = comment_id).exists():
                comment = PublicationComment.objects.get(publication_comment_id = comment_id)
            else:
                return JsonResponse({
                    "type" : "ERROR",
                    "message" : "El comentario que estás intentando eliminar no existe."
                    })

            if jwt_decoded["username"] == comment.profile.username:
                comment.delete()
                return JsonResponse({
                    "type" : "SUCCESS",
                    "message" : "El comentario ha sido eliminada con éxito."
                    })
        elif identifier == 'recipe':
            if RecipeComment.objects.filter(recipe_comment_id = comment_id).exists():
                comment = RecipeComment.objects.get(recipe_comment_id = comment_id)
            else:
                return JsonResponse({
                    "type" : "ERROR",
                    "message" : "El comentario que estás intentando eliminar no existe."
                    })

            if jwt_decoded["username"] == comment.profile.username:
                comment.delete()
                return JsonResponse({
                    "type" : "SUCCESS",
                    "message" : "El comentario ha sido eliminado con éxito."
                    })
        return JsonResponse({
            "type" : "ERROR",
            "message" : "Ha ocurrido un error, inténtalo de nuevo."
            })
    except Exception as e:
        print(str(e))
        return JsonResponse({
            "type" : "ERROR",
            "message" : "Ha ocurrido un error, inténtalo de nuevo."
            })

#Delete posts    
def delete_post(request, identifier):
    try:
        data = json.loads(request.body)

        if data.get("jwt"):
            jwt_decoded = decode_jwt(data.get("jwt"))
        else:
            return JsonResponse({
                "type" : "ERROR",
                "message" : "Ha ocurrido un error, inténtalo de nuevo."
                })
        
        post_id = data.get("post_id")

        if identifier == 'publication':
            if Publication.objects.filter(publication_id = post_id).exists():
                publication = Publication.objects.get(publication_id = post_id)
            else:
                return JsonResponse({
                    "type" : "ERROR",
                    "message" : "La publicación que estás intentando eliminar no existe."
                    })

            if jwt_decoded["username"] == publication.profile.username:
                publication.delete()
                return JsonResponse({
                    "type" : "SUCCESS",
                    "message" : "La publicación ha sido eliminada con éxito."
                    })
        elif identifier == 'recipe':
            if Recipe.objects.filter(recipe_id = post_id).exists():
                recipe = Recipe.objects.get(recipe_id = post_id)
            else:
                return JsonResponse({
                    "type" : "ERROR",
                    "message" : "La receta que estás intentando eliminar no existe."
                    })

            if jwt_decoded["username"] == recipe.profile.username:
                recipe.delete()
                return JsonResponse({
                    "type" : "SUCCESS",
                    "message" : "La receta ha sido eliminada con éxito."
                    })
        return JsonResponse({
            "type" : "ERROR",
            "message" : "Ha ocurrido un error, inténtalo de nuevo."
            })
    except Exception as e:
        print(str(e))
        return JsonResponse({
            "type" : "ERROR",
            "message" : "Ha ocurrido un error, inténtalo de nuevo."
            })
    
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
            return JsonResponse({
                "message": "El usuario no ha iniciado sesión.",
                "type" : "ERROR"
                })

        if Profile.objects.filter(pk = jwt_decoded["id"]).exists():
            profile = Profile.objects.get(pk = jwt_decoded["id"])
        else:
            return JsonResponse({
                "message" : "El usuario no se encuentra registrado.", 
                "type" : "ERROR"
                })       

        if id_vote == "recipe":
            if Recipe.objects.filter(pk = post_id).exists():
                recipe = Recipe.objects.get(pk = post_id)
            else:
                return JsonResponse({
                    "message" : "La receta no se encuentra registrada.", 
                    "type" : "ERROR"
                    })
            if vote_type == 0 and RecipeVote.objects.filter(recipe = recipe, profile = profile).exists():
                vote = RecipeVote.objects.get(recipe = recipe, profile = profile)
                vote.delete()
                return JsonResponse({
                    "message" : "Voto eliminado con éxito.",
                    "type" : "SUCCESS"
                    })
            elif vote_type != 0:
                if RecipeVote.objects.filter(recipe = recipe, profile = profile).exists():
                    vote = RecipeVote.objects.get(recipe = recipe, profile = profile)
                    vote.vote_type = vote_type
                    vote.save()
                else:
                    RecipeVote.objects.create_recipe_vote(recipe, profile, vote_type)
                return JsonResponse({
                    "message" : "Voto registrado con éxito.",
                    "type" : "SUCCESS"
                    })
            else: 
                return JsonResponse({
                    "message" : "Hubo un error, inténtelo de nuevo", 
                    "type" : "ERROR"
                    })
        elif id_vote == "publication":
            if Publication.objects.filter(pk = post_id).exists():
                publication = Publication.objects.get(pk = post_id)
            else:
                return JsonResponse({
                    "message" : "La publicación no se encuentra registrada.", 
                    "type" : "ERROR"
                    })
            if vote_type == 0 and PublicationVote.objects.filter(publication = publication, profile = profile).exists():
                vote = PublicationVote.objects.get(publication = publication, profile = profile)
                vote.delete()
                return JsonResponse({
                    "message" : "Voto eliminado con éxito.",
                    "type" : "SUCCESS"
                    })
            elif vote_type != 0:
                if PublicationVote.objects.filter(publication = publication, profile = profile).exists():
                    vote = PublicationVote.objects.get(publication = publication, profile = profile)
                    vote.vote_type = vote_type
                    vote.save()
                else:
                    PublicationVote.objects.create_publication_vote(publication, profile, vote_type)
                return JsonResponse({
                    "message" : "Voto registrado con éxito.",
                    "type" : "SUCCESS"
                    })
            else: 
                return JsonResponse({
                    "message" : "Hubo un error, inténtelo de nuevo", 
                    "type" : "ERROR"
                    })
        else:
            return JsonResponse({
                "message" : "Hubo un error, inténtelo de nuevo", 
                "type" : "ERROR"
                })
    except Exception as e:
        print(e)
        # Catch all other exceptions
        return JsonResponse({
            "message" : "Hubo un error, inténtelo de nuevo",
            "type" : "ERROR"
            })

#Create a comment   
def create_comment(request, id_comment):
    try:
        data = json.loads(request.body)
        post_id = int(data.get("post_id"))
        content = data.get("content")
        jwt_decoded = decode_jwt(data.get("jwt"))

        url = config('FRONT_HOST')

        if Profile.objects.filter(pk = jwt_decoded["id"]).exists():
            profile = Profile.objects.get(pk = jwt_decoded["id"])
        else:
            return JsonResponse({
                "message" : "El usuario no se encuentra registrado.", 
                "type" : "ERROR"
                })
        
        if id_comment == "recipe":
            if Recipe.objects.filter(pk = post_id).exists():
                recipe = Recipe.objects.get(pk = post_id)
            else:
                return JsonResponse({
                    "message" : "La receta no se encuentra registrada.", 
                    "type" : "ERROR"
                    })
            author = Profile.objects.filter(pk = recipe.profile_id)

            RecipeComment.objects.create_recipe_comment(profile, recipe, content)

            url += f'/{id_comment}/{post_id}'
            message = f'El usuario {profile.username} ha comentado en tu receta: {recipe.recipe_title}. {url}.'
            try:
                notification = Notification.objects.notify_recipe(author[0], recipe, message)
                print(notification, "Notificación creada con éxito")
            except Exception as e:
                print(e)
                return JsonResponse({"message": "No se pudo notificar", "type":"ERROR"})
            
            return JsonResponse({"message" : "¡Comentario creado con éxito!", "type" : "SUCCESS"})
        
        elif id_comment == "publication":
            if Publication.objects.filter(pk = post_id).exists():
                publication = Publication.objects.get(pk = post_id)
            else:
                return JsonResponse({
                    "message" : "La publicación no se encuentra registrada.", 
                    "type" : "ERROR"
                    })
            
            author = Profile.objects.filter(pk = publication.profile_id)

            PublicationComment.objects.create_publication_comment(profile, publication, content)

            url += f'/{id_comment}/{post_id}'
            message = f'El usuario {profile.username} ha comentado en tu publicación: {publication.publication_title}. {url}.'
            try:
                notification = Notification.objects.notify_publication(author[0], publication, message)
                print(notification, "Notificación creada con éxito")
            except Exception as e:
                print(e)
                return JsonResponse({"message": "No se pudo notificar", "type":"ERROR"})
            
            return JsonResponse({"message" : "¡Comentario creado con éxito!", "type" : "SUCCESS"})
        
    except Exception as e:
        print(e)
        # Catch all other exceptions
        return JsonResponse({"message" : "Hubo un error, inténtelo de nuevo", "type" : "ERROR"})
    
#Reply to a comment
def create_comment_response(request, id_comment):
    try:
        data = json.loads(request.body)
        post_id = int(data.get("post_id"))
        comment_id = data.get("comment_id")
        content = data.get("content")
        jwt_decoded = decode_jwt(data.get("jwt"))

        url = config('FRONT_HOST')

        if Profile.objects.filter(pk = jwt_decoded["id"]).exists():
            profile = Profile.objects.get(pk = jwt_decoded["id"])
        else:
            return JsonResponse({
                "message" : "El usuario no se encuentra registrado.", 
                "type" : "ERROR"
                })
        
        if id_comment == "recipe":
            if Recipe.objects.filter(pk = post_id).exists():
                recipe = Recipe.objects.get(pk = post_id)
            else:
                return JsonResponse({
                    "message" : "La receta no se encuentra registrada.", 
                    "type" : "ERROR"
                    })
            
            if RecipeComment.objects.filter(pk = comment_id).exists():
                recipe_comment = RecipeComment.objects.get(pk = comment_id)
            else:
                return JsonResponse({
                    "message" : "No existe el comentario al que quiere responder.", 
                    "type" : "ERROR"
                    })
            
            RecipeComment.objects.create_recipe_comment_response(profile, recipe, content, recipe_comment)

            author = Profile.objects.filter(pk = recipe_comment.profile_id)

            url += f'/{id_comment}/{post_id}'
            message = f'El usuario {profile.username} ha respondido a tu comentario en la receta: {recipe.recipe_title}. {url}.'
            print(message)
            try:
                notification = Notification.objects.notify_recipe(author[0], recipe, message)
                print(notification, "Notificación creada con éxito")
            except Exception as e:
                print(e)
                return JsonResponse({"message": "No se pudo notificar", "type":"ERROR"})
            
            return JsonResponse({"message" : "¡Respuesta creada con éxito!", "type" : "SUCCESS"})
        
        elif id_comment == "publication":
            if Publication.objects.filter(pk = post_id).exists():
                publication = Publication.objects.get(pk = post_id)
            else:
                return JsonResponse({
                    "message" : "La publicación no se encuentra registrada.", 
                    "type" : "ERROR"
                    })
            
            if PublicationComment.objects.filter(pk = comment_id).exists():
                publication_comment = PublicationComment.objects.get(pk = comment_id)
            else:
                return JsonResponse({
                    "message" : "No existe el comentario al que quiere responder.", 
                    "type" : "ERROR"
                    })
            
            PublicationComment.objects.create_publication_comment_response(profile, publication, content, publication_comment)

            author = Profile.objects.filter(pk = publication_comment.profile_id)

            url += f'/{id_comment}/{post_id}'
            message = f'El usuario {profile.username} ha respondido a tu comentario en la publicación: {publication.publication_title}. {url}.'
            try:
                notification = Notification.objects.notify_publication(author[0], publication, message)
                print(notification, "Notificación creada con éxito")
            except Exception as e:
                print(e)
                return JsonResponse({"message": "No se pudo notificar", "type":"ERROR"})
            
            return JsonResponse({"message" : "¡Respuesta creada con éxito!", "type" : "SUCCESS"})
        
    except Exception as e:
        print(e)
        # Catch all other exceptions
        return JsonResponse({"message" : "Hubo un error, inténtelo de nuevo", "type" : "ERROR"})

#get user's publication
def get_user_posts(request, user_identifier, identifier):
    try:
        data = json.loads(request.body)
        
        if user_identifier == "profile":
            if data.get("jwt"):
                jwt_decoded = decode_jwt(data.get("jwt"))
            else:
                return JsonResponse({
                    "type" : "ERROR",
                    "message" : "El usuario no ha iniciado sesión."
                })
            
            if Profile.objects.filter(id = jwt_decoded["id"]).exists():
                profile = Profile.objects.get(id = jwt_decoded["id"])
            else:
                return JsonResponse({
                    "type" : "ERROR",
                    "message" : "El usuario no se encuentra registrado."
                })
        else:
            if Profile.objects.filter(username = user_identifier).exists():
                profile = Profile.objects.get(username = user_identifier)
            else:
                return JsonResponse({
                    "type" : "ERROR",
                    "message" : "El usuario no se encuentra registrado."
                })
        
        if identifier == "recipes":
            recipes_query = Recipe.objects.filter(profile = profile).order_by("recipe_creation_date")
            posts = []

            username = profile.username

            if profile.avatar_id:
                profile_avatar = Avatar.objects.get(avatar_id = profile.avatar_id.avatar_id).avatar_url
            else:
                profile_avatar = ""
            
            for recipe in recipes_query:
                num_comments = RecipeComment.objects.filter(recipe = recipe.recipe_id).count()
                score = RecipeVote.objects.filter(recipe = recipe.recipe_id).aggregate(Sum('vote_type'))['vote_type__sum']
                if not score:
                    score = 0
                post_data = {
                    "id": recipe.recipe_id,
                    "userName": username,
                    "profile_avatar" : profile_avatar,
                    "title": recipe.recipe_title,
                    "ingredients" : recipe.recipe_ingredients,
                    "description": recipe.recipe_description,
                    "numComments": num_comments,
                    "score": score,
                    "tagsList": recipe.recipe_tags
                }
                posts.append(post_data)
        elif identifier == "publications":
            publications_query = Publication.objects.filter(profile = profile).order_by("publication_creation_date")
            posts = []

            username = profile.username

            if profile.avatar_id:
                profile_avatar = Avatar.objects.get(avatar_id = profile.avatar_id.avatar_id).avatar_url
            else:
                profile_avatar = ""
            
            for publication in publications_query:
                num_comments = PublicationComment.objects.filter(publication = publication.publication_id).count()
                score = PublicationVote.objects.filter(publication = publication.publication_id).aggregate(Sum('vote_type'))['vote_type__sum']
                if not score:
                    score = 0
                post_data = {
                    "id": publication.publication_id,
                    "userName": username,
                    "profile_avatar" : profile_avatar,
                    "title": publication.publication_title,
                    "description": publication.publication_description,
                    "numComments": num_comments,
                    "score": score,
                    "tagsList": publication.publication_tags
                }
                posts.append(post_data)
        else:
            return JsonResponse({
                "type" : "ERROR",
                "message" : "Ha ocurrido un error, inténtalo de nuveo."
            })
            
        return JsonResponse({
                "type" : "SUCCESS",
                "posts" : posts
            })
    except Exception as e:
        print(e)
        return JsonResponse({
            "type" : "ERROR",
            "message" : str(e)
        })
    
#get user's saved posts
def get_saved_posts(request, identifier):
    try:
        data = json.loads(request.body)
        
        if data.get("jwt"):
            jwt_decoded = decode_jwt(data.get("jwt"))
        else:
            return JsonResponse({
                "type" : "ERROR",
                "message" : "El usuario no ha iniciado sesión."
            })
        
        if Profile.objects.filter(id = jwt_decoded["id"]).exists():
            profile = Profile.objects.get(id = jwt_decoded["id"])
        else:
            return JsonResponse({
                "type" : "ERROR",
                "message" : "El usuario no se encuentra registrado."
            })
        
        if identifier == "recipes":
            saved_recipes = SavedPost.objects.filter(profile = profile, publication = None)
            
            posts = []

            if profile.avatar_id:
                profile_avatar = Avatar.objects.get(avatar_id = profile.avatar_id.avatar_id).avatar_url
            else:
                profile_avatar = ""
            
            for saved_recipe in saved_recipes:
                recipe = saved_recipe.recipe
                num_comments = RecipeComment.objects.filter(recipe = recipe.recipe_id).count()
                score = RecipeVote.objects.filter(recipe = recipe.recipe_id).aggregate(Sum('vote_type'))['vote_type__sum']
                if not score:
                    score = 0
                post_data = {
                    "id": recipe.recipe_id,
                    "userName": profile.username,
                    "profile_avatar" : profile_avatar,
                    "title": recipe.recipe_title,
                    "ingredients" : recipe.recipe_ingredients,
                    "description": recipe.recipe_description,
                    "numComments": num_comments,
                    "score": score,
                    "tagsList": recipe.recipe_tags
                }
                posts.append(post_data)

        elif identifier == "publications":
            saved_publications = SavedPost.objects.filter(profile = profile, recipe = None)
            posts = []

            if profile.avatar_id:
                profile_avatar = Avatar.objects.get(avatar_id = profile.avatar_id.avatar_id).avatar_url
            else:
                profile_avatar = ""
            
            for saved_publication in saved_publications:
                publication = saved_publication.publication
                num_comments = PublicationComment.objects.filter(publication = publication.publication_id).count()
                score = PublicationVote.objects.filter(publication = publication.publication_id).aggregate(Sum('vote_type'))['vote_type__sum']
                if not score:
                    score = 0
                post_data = {
                    "id": publication.publication_id,
                    "userName": profile.username,
                    "profile_avatar" : profile_avatar,
                    "title": publication.publication_title,
                    "description": publication.publication_description,
                    "numComments": num_comments,
                    "score": score,
                    "tagsList": publication.publication_tags
                }
                posts.append(post_data)
        else:
            return JsonResponse({
                "type" : "ERROR",
                "message" : "Ha ocurrido un error, inténtalo de nuveo."
            })
            
        return JsonResponse({
                "type" : "SUCCESS",
                "posts" : posts
            })
    except Exception as e:
        print(e)
        return JsonResponse({
            "type" : "ERROR",
            "message" : str(e)
        })

#Save posts controller
def save_posts(request, identifier):
    if identifier == "recipe":
        return save_recipe(request)
    elif identifier == "publication":
        return save_publication(request)
    else: 
        return JsonResponse({
                "type" : "SUCCESS", 
                "message" : f'{identifier} no es un identificador válido.'
                })