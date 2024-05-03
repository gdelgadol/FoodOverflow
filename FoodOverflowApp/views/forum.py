from ..models import Publication, PublicationComment, PublicationVote
from ..models import Recipe, RecipeComment, RecipeVote
from ..models import Profile, Avatar
from ..models import Notification
from django.http import JsonResponse
from ..views.token import decode_jwt
from django.db.models import Sum
from decouple import config

import json

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
            RecipeComment.objects.create_recipe_comment(profile, recipe, content)
            
            return JsonResponse({"message" : "¡Comentario creado con éxito!", "type" : "SUCCESS"})
        
        elif id_comment == "publication":
            if Publication.objects.filter(pk = post_id).exists():
                publication = Publication.objects.get(pk = post_id)
            else:
                return JsonResponse({
                    "message" : "La publicación no se encuentra registrada.", 
                    "type" : "ERROR"
                    })
            PublicationComment.objects.create_publication_comment(profile, publication, content)
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

#Report comments or publications
def report(request, identifier):
    try:
        data = json.loads(request.body)
        
        admins = Profile.objects.filter(is_admin = True)

        id = data.get("id")
        message = data.get("message")

        url = config('FRONT_HOST')

        if not decode_jwt(data.get("jwt")):
            return JsonResponse({
                "type" : "ERROR", 
                "message" : "El usuario debe iniciar sesión para raportar una publicación."
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
            url += f'/{identifier}/{id}'
            message = f'La publicación con id {id} ha sido reportada por {message}. {url}.'
            identifier = "Publicación reportada"
        elif identifier == "recipe":
            if Recipe.objects.filter(recipe_id = id).exists():
                recipe = Recipe.objects.get(recipe_id = id)
            else:
                return JsonResponse({
                    "type" : "ERROR", 
                    "message" : "La receta que estás reportando no existe."
                    })
            url += f'/{identifier}/{id}'
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
            url += f'/publication/{publication_id}'
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
            url += f'/recipe/{recipe_id}'
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