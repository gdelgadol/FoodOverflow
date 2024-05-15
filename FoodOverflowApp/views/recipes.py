from ..models import Recipe, RecipeComment, RecipeVote, SavedPost
from ..models import Profile, Avatar
from ..views.token import decode_jwt
from django.db.models import Sum
from django.db.models import Q
from functools import reduce
from .modules import error_response, success_response, get_if_exists

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
            return error_response("Debes iniciar sesión para crear una publicación.")

        if not jwt_token:
            return error_response("Hubo un error, intenta iniciar sesión nuevamente.")

        user = Profile.objects.get(id = jwt_token['id'])

        if not tags_list:
            Recipe.objects.create_recipe(title, ingredients, instructions, user)
        else:
            Recipe.objects.create_recipe_tags(title, ingredients, instructions, user, tags_list)

        return success_response({"message" : "¡Receta creada con éxito!"})
    except Exception as e:
        print(e)
        # Catch all other exceptions
        return error_response("Hubo un error, inténtelo de nuevo")

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

        return success_response({"posts": posts})
    except Exception as e:
        print(e)
        return error_response(str(e))

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
            error_response("No se encontraron recetas con esas etiquetas.")
        
        return success_response({"posts": posts, "number_posts": len(posts)})
    except Recipe.DoesNotExist:
        return error_response("No se encontraron recetas")
    except Exception as e:
        return error_response(str(e))

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
                return error_response("Hubo un error, intenta iniciar sesión nuevamente.")

            if Profile.objects.filter(id = jwt_decoded["id"]).exists():
                profile = Profile.objects.get(id = jwt_decoded["id"])
                
                vote = get_if_exists(RecipeVote, {'recipe' : recipe, 'profile' : profile})
                if vote:
                    vote_type = vote.vote_type
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
        
        return success_response(recipe_json)
    except Exception as e:
        print(e)
        # Catch all other exceptions
        return error_response("Hubo un error, inténtelo de nuevo")
    
def save_recipe(request):
    try:
        data = json.loads(request.body)

        if data.get("jwt"):
            jwt_decoded = decode_jwt(data.get("jwt"))
        else:
            return error_response("Hubo un error con la autenticación del usuario.")

        if Profile.objects.filter(id = jwt_decoded["id"]).exists():
            profile = Profile.objects.get(id = jwt_decoded["id"])
        else:
            return error_response("El perfíl no existe en la base de datos.")
        
        if Recipe.objects.filter(pk = int(data.get("post_id"))).exists():
            recipe = Recipe.objects.get(pk = int(data.get("post_id")))
        else:
            return error_response("La receta que intentas guardar no existe.")

        if SavedPost.objects.filter(profile = profile , recipe = recipe).exists():
            saved_post = SavedPost.objects.get(profile = profile , recipe = recipe)
            saved_post.delete()
            return success_response({"message" : "Receta eliminada de guardados con éxito."})
        else:
            SavedPost.objects.save_recipe(profile, recipe)
            return success_response({"message" : "Receta guardada con éxito."})
    except Exception as e:
        print(e)
        return error_response("Hubo un error, inténtelo de nuevo")