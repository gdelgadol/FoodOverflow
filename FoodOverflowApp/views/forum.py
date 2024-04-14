from ..models import Publication, PublicationComment, PublicationVote
from ..models import Recipe, RecipeComment, RecipeVote
from ..models import Profile
from django.http import JsonResponse
from ..views.token import decode_jwt
from django.db.models import Sum
import json


# View the main page publications
def get_first_n_publications(request):
    # get the Json Data, Email and Password
    data = json.loads(request.body)
    page = int(data.get("page"))
    num_of_searchs = int(data.get("num_of_searchs"))
    filter = data.get("filter")

    start = (page-1)*num_of_searchs-1
    end = page*num_of_searchs-1

    publications_querries = Publication.objects.order_by(filter)[start : end]

    publications = {}

    count = 0
    for publication_querrie in publications_querries:
        username = Profile.objects.get(pk = publication_querrie.profile_id).username
        publication = {'author' : username, 
                       'title' : publication_querrie.publication_title,
                       'content' : publication_querrie.publication_description,
                       'id' : publication_querrie.publication_id}
        publications['publication_'+str(count)] = publication
        count+=1

    print(publications)
    return JsonResponse(publications)

def get_publication(request):
    # get the Json Data, Email and Password
    data = json.loads(request.body)
    publication_id = int(data.get("publication_id"))

    publication = Publication.objects.select_related('profile').get(publication_id = publication_id)
    num_comments = PublicationComment.objects.filter(publication = publication.publication_id).count()
    publication_score = PublicationVote.objects.filter(publication = publication.publication_id).aggregate(Sum('vote_type'))['vote_type__sum']

    if not publication_score:
        publication_score = 0

    publication_json = {
        "type": "SUCCESS",
        'username' : publication.profile.username,
        'title' : publication.publication_title,
        'description' : publication.publication_description,
        "numComments": num_comments,
        "score": publication_score
        }
    
    return JsonResponse(publication_json)

def get_forum_posts(request):
    try:
        publications_query = Publication.objects.order_by('publication_creation_date').select_related('profile').all()
        posts = []

        for publication in publications_query:
            username = publication.profile.username
            num_comments = PublicationComment.objects.filter(publication = publication.publication_id).count()
            score = PublicationVote.objects.filter(publication = publication.publication_id).aggregate(Sum('vote_type'))['vote_type__sum']
            if not score:
                score = 0
            post_data = {
                "id": publication.publication_id,
                "userName": username,
                "title": publication.publication_title,
                "description": publication.publication_description,
                "numComments": num_comments,
                "score": score,
            }
            posts.append(post_data)

        return JsonResponse({"type": "SUCCESS", "posts": posts})
    except Publication.DoesNotExist:
        return JsonResponse({"type": "ERROR", "message": "No se encontraron publicaciones"}, status=404)
    except Exception as e:
        return JsonResponse({"type": "ERROR", "message": str(e)}, status=500)
    
def create_forum_publication(request):
    try:
        data = json.loads(request.body)
        title = data.get("title")
        description = data.get("content")
        jwt_token = decode_jwt(data.get("jwt"))
        
        username = jwt_token['username']
        user = Profile.objects.get(username = username)
        Publication.objects.create_publication(title, description, user)
        return JsonResponse({"message" : "¡Publicación creada con éxito!", "type" : "SUCCESS"})
    except Exception as e:
        print(e)
        # Catch all other exceptions
        return JsonResponse({"message" : "Hubo un error, inténtelo de nuevo", "type" : "ERROR"})

def create_recipe_post(request):
    try:
        data = json.loads(request.body)
        title = data.get("title")
        ingredients = data.get("ingredients")
        instructions = data.get("instructions")
        jwt_token = decode_jwt(data.get("jwt"))
        
        user = Profile.objects.get(id = jwt_token['id'])
        Recipe.objects.create_publication(title, ingredients, instructions, user)
        return JsonResponse({"message" : "¡Receta creada con éxito!", "type" : "SUCCESS"})
    except Exception as e:
        print(e)
        # Catch all other exceptions
        return JsonResponse({"message" : "Hubo un error, inténtelo de nuevo", "type" : "ERROR"})
    
def get_all_recipes(reqest):
    try:
        recipes_query = Recipe.objects.order_by('publication_creation_date').select_related('profile').all()
        posts = []

        for recipe in recipes_query:
            username = recipe.profile.username
            num_comments = RecipeComment.objects.filter(recipe = recipe.recipe_id).count()
            score = RecipeComment.objects.filter(recipe = recipe.recipe_id).aggregate(Sum('vote_type'))['vote_type__sum']
            if not score:
                score = 0
            post_data = {
                "id": recipe.recipe_id,
                "userName": username,
                "title": recipe.recipe_title,
                "ingredients" : recipe.recipe_ingredients,
                "descriptions": recipe.recipe_description,
                "numComments": num_comments,
                "score": score,
            }
            posts.append(post_data)

        return JsonResponse({"type": "SUCCESS", "posts": posts})
    except Publication.DoesNotExist:
        return JsonResponse({"type": "ERROR", "message": "No se encontraron publicaciones"}, status=404)
    except Exception as e:
        return JsonResponse({"type": "ERROR", "message": str(e)}, status=500)

def get_recipe(request):
    # get the Json Data, Email and Password
    data = json.loads(request.body)
    recipe_id = int(data.get("recipe_id"))

    recipe = Recipe.objects.select_related('profile').get(recipe_id = recipe_id)
    num_comments = RecipeComment.objects.filter(recipe = recipe.recipe_id).count()
    recipe_score = RecipeVote.objects.filter(recipe = recipe.recipe_id).aggregate(Sum('vote_type'))['vote_type__sum']

    if not recipe_score:
        recipe_score = 0

    publication_json = {
        "type": "SUCCESS",
        'username' : recipe.profile.username,
        'title' : recipe.recipe_title,
        'ingredients' : recipe.recipe_ingredients,
        'description' : recipe.recipe_description,
        "numComments": num_comments,
        "score": recipe_score
        }
    
    return JsonResponse(publication_json)