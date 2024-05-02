from ..models import Publication, PublicationComment, PublicationVote
from ..models import Recipe, RecipeComment, RecipeVote
from ..models import Profile, Avatar
from django.http import JsonResponse
from ..views.token import decode_jwt
from django.db.models import Sum
from django.db.models import Q
from functools import reduce

import json

#------------------Publication controllers--------------------------#

#View details of a specific publication
def get_publication(request):
    try:
        # get the Json Data, Email and Password
        data = json.loads(request.body)
        publication_id = int(data.get("publication_id"))

        if Publication.objects.select_related('profile').filter(publication_id = publication_id).exists():
            publication = Publication.objects.select_related('profile').get(publication_id = publication_id)
        else:
            return JsonResponse({
                "message" : "La publicación que estás intentando ver no existe.", 
                "type" : "ERROR"
                })

        publication_comments = PublicationComment.objects.filter(publication=publication)
	
        vote_type = 0

	    # Extracting vote type
        if (data.get("jwt")):
            jwt_decoded = decode_jwt(data.get("jwt"))

            if not jwt_decoded:
                return JsonResponse({"message" : "Hubo un error, intenta iniciar sesión nuevamente.", "type" : "ERROR"})

            if Profile.objects.filter(id = jwt_decoded["id"]).exists():
                profile = Profile.objects.get(id = jwt_decoded["id"])
            
                if PublicationVote.objects.filter(publication = publication, profile = profile).exists():
                    vote_type = PublicationVote.objects.get(publication = publication, profile = profile).vote_type

        # Extracting relevant data from the comments
        comments_list = []
        publication_comments = PublicationComment.objects.filter(publication=publication, comment_response_id = None)
        num_comments = publication_comments.count()
        for comment in publication_comments:
            
            comment_data = {
                'comment_id': comment.publication_comment_id,
                'comment_content': comment.comment_body,
                'comment_user': comment.profile.username  # Assuming user is related to the comment
                # Add more fields if needed
            } 
            publication_comments_response = PublicationComment.objects.filter(publication=publication, comment_response_id = comment.publication_comment_id)
            response_list = []
            for response in publication_comments_response:
                response_data = {
                'response_id': response.publication_comment_id,
                'response_content': response.comment_body,
                'response_user': response.profile.username  # Assuming user is related to the comment
                # Add more fields if needed
                }
                response_list.append(response_data)
                num_comments += 1
            
            comment_data["response_list"] = response_list

            comments_list.append(comment_data)

        publication_score = PublicationVote.objects.filter(publication = publication.publication_id).aggregate(Sum('vote_type'))['vote_type__sum']

        if not publication_score:
            publication_score = 0

        if publication.profile.avatar_id:
            profile_avatar = Avatar.objects.get(avatar_id = publication.profile.avatar_id.avatar_id).avatar_url
        else:
            profile_avatar = ""
            
        publication_json = {
            "type": "SUCCESS",
            'username' : publication.profile.username,
            'profile_avatar' : profile_avatar,
            'title' : publication.publication_title,
            'description' : publication.publication_description,
            "numComments": num_comments,
            "score": publication_score,
            "publication_comments": comments_list,
            "vote_type" : vote_type,
            "tagsList": publication.publication_tags
            }
        
        return JsonResponse(publication_json)
    except Exception as e:
        print(e)
        # Catch all other exceptions
        return JsonResponse({"message" : "Hubo un error, inténtelo de nuevo", "type" : "ERROR"})
    
#View all publications made by a user
def get_publications(request):
    try:
        publications_query = Publication.objects.order_by('publication_creation_date').select_related('profile').all()
        posts = []

        for publication in publications_query:
            username = publication.profile.username
            num_comments = PublicationComment.objects.filter(publication = publication.publication_id).count()
            score = PublicationVote.objects.filter(publication = publication.publication_id).aggregate(Sum('vote_type'))['vote_type__sum']
            if not score:
                score = 0

            if publication.profile.avatar_id:
                profile_avatar = Avatar.objects.get(avatar_id = publication.profile.avatar_id.avatar_id).avatar_url
            else:
                profile_avatar = ""

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

        return JsonResponse({"type": "SUCCESS", "posts": posts})
    except Exception as e:
        print(e)
        return JsonResponse({"type": "ERROR", "message": str(e)}, status=500)

#Get publications by tags  
def get_publications_tags(request):
    try:
        # Extract tags list from the request body
        request_data = json.loads(request.body)
        tags_list = request_data.get('tagsList', [])
        # Build a query to filter publications based on tags_list
        publications_query = Publication.objects.filter(
            reduce(lambda x, y: x | y, [Q(publication_tags__contains=[tag]) for tag in tags_list])
        ).order_by('publication_creation_date').select_related('profile').all()

        posts = []

        for publication in publications_query:
            username = publication.profile.username
            num_comments = PublicationComment.objects.filter(publication=publication.publication_id).count()
            score = PublicationVote.objects.filter(publication=publication.publication_id).aggregate(
                Sum('vote_type'))['vote_type__sum']
            if not score:
                score = 0
                
            if publication.profile.avatar_id:
                profile_avatar = Avatar.objects.get(avatar_id = publication.profile.avatar_id.avatar_id).avatar_url
            else:
                profile_avatar = ""

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

        if(len(posts) == 0):
            return JsonResponse({"type": "ERROR", "message":"No se encontraron publicaciones con esas etiquetas"})
        
        return JsonResponse({"type": "SUCCESS", "posts": posts})
    except Publication.DoesNotExist:
        return JsonResponse({"type": "ERROR", "message": "No se encontraron publicaciones"}, status=404)
    except Exception as e:
        return JsonResponse({"type": "ERROR", "message": str(e)}, status=500)

#Create a publication
def create_forum_publication(request):
    try:
        data = json.loads(request.body)
        title = data.get("title")
        description = data.get("content")
        tags_list = data.get("tags_list")

        
        if data.get("jwt"):
            jwt_token = decode_jwt(data.get("jwt"))
        else:
            return JsonResponse({"message" : "Debes iniciar sesión para crear una publicación.", "type" : "ERROR"})

        if not jwt_token:
            print(jwt_token)
            return JsonResponse({"message" : "Hubo un error, intenta iniciar sesión nuevamente.", "type" : "ERROR"})

        username = jwt_token['username']
        user = Profile.objects.get(username = username)
        if not tags_list:
            Publication.objects.create_publication(title, description, user)
        else:
            Publication.objects.create_publication_tags(title, description, user, tags_list)

        return JsonResponse({"message" : "¡Publicación creada con éxito!", "type" : "SUCCESS"})
    except Exception as e:
        print(e)
        # Catch all other exceptions
        return JsonResponse({"message" : "Hubo un error, inténtelo de nuevo", "type" : "ERROR"})

#------------------Recipe controllers--------------------------#
#Create a recipe
def create_recipe(request):
    try:
        data = json.loads(request.body)
        title = data.get("title")
        ingredients = data.get("ingredients")
        instructions = data.get("instructions")
        tags_list = data.get("tags_list")
        
        if data.get("jwt"):
            jwt_token = decode_jwt(data.get("jwt"))
        else:
            return JsonResponse({"message" : "Debes iniciar sesión para crear una publicación.", "type" : "ERROR"})

        if not jwt_token:
            return JsonResponse({"message" : "Hubo un error, intenta iniciar sesión nuevamente.", "type" : "ERROR"})

        user = Profile.objects.get(id = jwt_token['id'])

        if not tags_list:
            Recipe.objects.create_recipe(title, ingredients, instructions, user)
        else:
            Recipe.objects.create_recipe_tags(title, ingredients, instructions, user, tags_list)

        return JsonResponse({"message" : "¡Receta creada con éxito!", "type" : "SUCCESS"})
    except Exception as e:
        print(e)
        # Catch all other exceptions
        return JsonResponse({"message" : "Hubo un error, inténtelo de nuevo", "type" : "ERROR"})

#View all recipes done by a user
def get_recipes(request):
    try:
        recipes_query = Recipe.objects.order_by('recipe_creation_date').select_related('profile').all()
        posts = []

        for recipe in recipes_query:
            username = recipe.profile.username
            num_comments = RecipeComment.objects.filter(recipe = recipe.recipe_id).count()
            score = RecipeVote.objects.filter(recipe = recipe.recipe_id).aggregate(Sum('vote_type'))['vote_type__sum']
            if not score:
                score = 0

            if recipe.profile.avatar_id:
                profile_avatar = Avatar.objects.get(avatar_id = recipe.profile.avatar_id.avatar_id).avatar_url
            else:
                profile_avatar = ""

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

        return JsonResponse({"type": "SUCCESS", "posts": posts})
    except Recipe.DoesNotExist:
        return JsonResponse({"type": "ERROR", "message": "No se encontraron recetas"}, status=404)
    except Exception as e:
        return JsonResponse({"type": "ERROR", "message": str(e)}, status=500)

def get_recipe_tags(request):
    try:
        request_data = json.loads(request.body)
        tags_list = request_data.get('tagsList', [])

        recipe_query = Recipe.objects.filter(
            reduce(lambda x, y: x | y, [Q(recipe_tags__contains=[tag]) for tag in tags_list])
        ).order_by('recipe_creation_date').select_related('profile').all()

        posts = []

        for recipe in recipe_query:
            username = recipe.profile.username
            num_comments = RecipeComment.objects.filter(recipe=recipe.recipe_id).count()
            score = RecipeVote.objects.filter(recipe=recipe.recipe_id).aggregate(
                Sum('vote_type'))['vote_type__sum']
            if not score:
                score = 0

            if recipe.profile.avatar_id:
                profile_avatar = Avatar.objects.get(avatar_id = recipe.profile.avatar_id.avatar_id).avatar_url
            else:
                profile_avatar = ""

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

        if(len(posts) == 0):
            return JsonResponse({"type": "ERROR", "message":"No se encontraron recetas con esas etiquetas"})
        
        return JsonResponse({"type": "SUCCESS", "posts": posts})
    except Recipe.DoesNotExist:
        return JsonResponse({"type": "ERROR", "message": "No se encontraron recetas"}, status=404)
    except Exception as e:
        return JsonResponse({"type": "ERROR", "message": str(e)}, status=500)

#View details of a specific recipe
def get_recipe(request):
    try:
        # get the Json Data, Email and Password
        data = json.loads(request.body)
        recipe_id = int(data.get("recipe_id"))

        recipe = Recipe.objects.select_related('profile').get(recipe_id = recipe_id)
        
        recipe_comments = RecipeComment.objects.filter(recipe=recipe, comment_response_id = None)
        
        vote_type = 0

        # Extracting vote type
        if (data.get("jwt")):
            jwt_decoded = decode_jwt(data.get("jwt"))

            if not jwt_decoded:
                return JsonResponse({"message" : "Hubo un error, intenta iniciar sesión nuevamente.", "type" : "ERROR"})

            if Profile.objects.filter(id = jwt_decoded["id"]).exists():
                profile = Profile.objects.get(id = jwt_decoded["id"])
            
                if RecipeVote.objects.filter(recipe = recipe, profile = profile).exists():
                    vote_type = RecipeVote.objects.get(recipe = recipe, profile = profile).vote_type

        # Extracting relevant data from the comments
        num_comments = recipe_comments.count()
        comments_list = []

        for comment in recipe_comments:
            
            comment_data = {
                'comment_id': comment.recipe_comment_id,
                'comment_content': comment.comment_body,
                'comment_user': comment.profile.username  # Assuming user is related to the comment
                # Add more fields if needed
            }
            recipe_comments_response = RecipeComment.objects.filter(recipe=recipe, comment_response_id = comment.recipe_comment_id)
            response_list = []
            for response in recipe_comments_response:
                response_data = {
                'response_id': response.recipe_comment_id,
                'response_content': response.comment_body,
                'response_user': response.profile.username  # Assuming user is related to the comment
                # Add more fields if needed
                }
                response_list.append(response_data)
                num_comments += 1
            
            comment_data["response_list"] = response_list

            comments_list.append(comment_data)

        recipe_score = RecipeVote.objects.filter(recipe = recipe.recipe_id).aggregate(Sum('vote_type'))['vote_type__sum']

        if not recipe_score:
            recipe_score = 0

        if recipe.profile.avatar_id:
            profile_avatar = Avatar.objects.get(avatar_id = recipe.profile.avatar_id.avatar_id).avatar_url
        else:
            profile_avatar = ""

        recipe_json = {
            "type": "SUCCESS",
            'username' : recipe.profile.username,
            'profile_avatar' : profile_avatar,
            'title' : recipe.recipe_title,
            'ingredients' : recipe.recipe_ingredients,
            'description' : recipe.recipe_description,
            "numComments": num_comments,
            "score": recipe_score,
            "recipe_comments": comments_list,
            "vote_type" : vote_type,
            "tagsList": recipe.recipe_tags
            }
        
        return JsonResponse(recipe_json)
    except Exception as e:
        print(e)
        # Catch all other exceptions
        return JsonResponse({"message" : "Hubo un error, inténtelo de nuevo", "type" : "ERROR"})

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
                "message" : "Ha ocurrido un error, intentalo de nuveo."
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