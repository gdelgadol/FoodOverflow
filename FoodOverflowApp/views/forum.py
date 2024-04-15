from ..models import Publication, PublicationComment, PublicationVote
from ..models import Recipe, RecipeComment, RecipeVote
from ..models import Profile
from django.http import JsonResponse
from ..views.token import decode_jwt
from django.db.models import Sum
import json

#------------------Publication controllers--------------------------#

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

#View details of a specific publication
def get_publication(request):
    try:
        # get the Json Data, Email and Password
        data = json.loads(request.body)
        publication_id = int(data.get("publication_id"))

        publication = Publication.objects.select_related('profile').get(publication_id = publication_id)

        publication_comments = PublicationComment.objects.filter(publication=publication)
        
        # Extracting relevant data from the comments
        comments_list = []
        for comment in publication_comments:
            if (comment.comment_response):
                comment_data = {
                    'comment_id': comment.publication_comment_id,
                    'comment_content': comment.comment_body,
                    'comment_user': comment.profile.username,  # Assuming user is related to the comment
                    'comment_response': comment.comment_response.publication_comment_id
                    # Add more fields if needed
                }
            else:
                comment_data = {
                'comment_id': comment.publication_comment_id,
                'comment_content': comment.comment_body,
                'comment_user': comment.profile.username,  # Assuming user is related to the comment
                # Add more fields if needed
                }
            comments_list.append(comment_data)

        num_comments = publication_comments.count()

        publication_score = PublicationVote.objects.filter(publication = publication.publication_id).aggregate(Sum('vote_type'))['vote_type__sum']

        if not publication_score:
            publication_score = 0

        publication_json = {
            "type": "SUCCESS",
            'username' : publication.profile.username,
            'title' : publication.publication_title,
            'description' : publication.publication_description,
            "numComments": num_comments,
            "score": publication_score,
            "publication_comments": comments_list
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

#Create a publication
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

#------------------Recipe controllers--------------------------#
#Create a recipe
def create_recipe(request):
    try:
        data = json.loads(request.body)
        title = data.get("title")
        ingredients = data.get("ingredients")
        instructions = data.get("instructions")
        jwt_token = decode_jwt(data.get("jwt"))
        
        user = Profile.objects.get(id = jwt_token['id'])
        Recipe.objects.create_recipe(title, ingredients, instructions, user)
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
        
        recipe_comments = RecipeComment.objects.filter(recipe=recipe)
        
        # Extracting relevant data from the comments
        comments_list = []
        for comment in recipe_comments:
            if (comment.comment_response):
                comment_data = {
                    'comment_id': comment.recipe_comment_id,
                    'comment_content': comment.comment_body,
                    'comment_user': comment.profile.username,  # Assuming user is related to the comment
                    'comment_response': comment.comment_response.recipe_comment_id
                    # Add more fields if needed
                }
            else:
                comment_data = {
                'comment_id': comment.recipe_comment_id,
                'comment_content': comment.comment_body,
                'comment_user': comment.profile.username,  # Assuming user is related to the comment
                # Add more fields if needed
                }
            comments_list.append(comment_data)

        num_comments = recipe_comments.count()

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
            "score": recipe_score,
            "recipe_comments": comments_list
            }
        
        return JsonResponse(publication_json)
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
        jwt_decoded = decode_jwt(data.get("jwt"))

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
            if vote_type == 0 and RecipeVote.objects.filter(recipe = recipe, profile = profile):
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