from ..models import Recipe, RecipeComment, RecipeVote, SavedPost
from ..models import Profile, Avatar
from ..models import Notification
from django.http import JsonResponse
from ..views.token import decode_jwt
from django.db.models import Sum
from django.db.models import Q
from functools import reduce

import json

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
        is_saved = False

        # Extracting vote type
        if (data.get("jwt")):
            jwt_decoded = decode_jwt(data.get("jwt"))

            if not jwt_decoded:
                return JsonResponse({"message" : "Hubo un error, intenta iniciar sesión nuevamente.", "type" : "ERROR"})

            if Profile.objects.filter(id = jwt_decoded["id"]).exists():
                profile = Profile.objects.get(id = jwt_decoded["id"])
            
                if RecipeVote.objects.filter(recipe = recipe, profile = profile).exists():
                    vote_type = RecipeVote.objects.get(recipe = recipe, profile = profile).vote_type
                if SavedPost.objects.filter(profile = profile, recipe = recipe).exists():
                    is_saved = True

        # Extracting relevant data from the comments
        num_comments = recipe_comments.count()
        comments_list = []

        for comment in recipe_comments:

            profile_avatar = Avatar.objects.get(avatar_id = comment.profile.avatar_id.avatar_id).avatar_url
            
            comment_data = {
                'comment_id': comment.recipe_comment_id,
                'comment_content': comment.comment_body,
                'comment_user': comment.profile.username,
                'comment_user_avatar': profile_avatar   # Assuming user is related to the comment
                # Add more fields if needed
            }
            recipe_comments_response = RecipeComment.objects.filter(recipe=recipe, comment_response_id = comment.recipe_comment_id)
            response_list = []
            for response in recipe_comments_response:

                profile_avatar = Avatar.objects.get(avatar_id = response.profile.avatar_id.avatar_id).avatar_url

                response_data = {
                'response_id': response.recipe_comment_id,
                'response_content': response.comment_body,
                'response_user': response.profile.username,
                'response_user_avatar': profile_avatar    # Assuming user is related to the comment
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
            "tagsList": recipe.recipe_tags,
            "is_saved" : is_saved
            }
        
        return JsonResponse(recipe_json)
    except Exception as e:
        print(e)
        # Catch all other exceptions
        return JsonResponse({"message" : "Hubo un error, inténtelo de nuevo", "type" : "ERROR"})
    
def save_recipe(request):
    try:
        data = json.loads(request.body)

        if data.get("jwt"):
            jwt_decoded = decode_jwt(data.get("jwt"))
        else:
            return JsonResponse({"message" : "Hubo un error con la autenticación del usuario.", "type" : "ERROR"})

        if Profile.objects.filter(id = jwt_decoded["id"]).exists():
            profile = Profile.objects.get(id = jwt_decoded["id"])
        else:
            return JsonResponse({"message" : "El perfíl no existe en la base de datos.", "type" : "ERROR"})
        
        if Recipe.objects.filter(recipe_id = data.get("post_id")).exists():
            recipe = Recipe.objects.get(recipe_id = data.get("post_id"))
        else:
            return JsonResponse({"message" : "La receta que intentas guardar no existe.", "type" : "ERROR"})

        if SavedPost.objects.filter(profile = profile , recipe = recipe).exists():
            saved_post = SavedPost.objects.get(profile = profile , recipe = recipe)
            saved_post.delete()
            return JsonResponse({"message" : "Receta eliminada de guardados con éxito.", "type" : "SUCCESS"})
        else:
            SavedPost.objects.save_recipe(profile, recipe)
            return JsonResponse({"message" : "Receta guardada con éxito.", "type" : "SUCCESS"})
    except Exception as e:
        print(e)
        return JsonResponse({"message" : "Hubo un error, inténtelo de nuevo", "type" : "ERROR"})