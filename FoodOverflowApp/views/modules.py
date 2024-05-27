from django.http import JsonResponse
from ..models import Avatar
from ..models import RecipeComment, RecipeVote
from ..models import PublicationComment, PublicationVote
from django.db.models import Sum

#return error
def error_response(message):
    return JsonResponse({
            "type" : "ERROR",
            "message" : message
            })

#return success
def success_response(content):
    return JsonResponse({
            "type" : "SUCCESS",
            **content})

#get if exists
def get_if_exists(model, params):
    if model.objects.filter(**params).exists():
        element = model.objects.get(**params)
        return element
    else:
        return False 

def get_all_posts(models, data, identifier, order_by, save = False):
    queries = models[0].objects.filter(**data).order_by(order_by)
    posts = []

    profile = data['profile']

    username = profile.username
    
    for querie in queries:
        searcher = querie

        if save:
            if identifier == 'recipes':
                searcher = querie.recipe
            elif identifier == 'publications':
                searcher = querie.publication

        if searcher.profile.avatar_id:
            profile_avatar = Avatar.objects.get(avatar_id = searcher.profile.avatar_id.avatar_id).avatar_url
    
        num_comments = models[1].objects.filter(**{identifier[0:-1] : searcher}).count()
        score = models[2].objects.filter(**{identifier[0:-1] : searcher}).aggregate(Sum('vote_type'))['vote_type__sum']
        if not score:
            score = 0
        post_data = {
            "id": searcher.pk,
            "userName": searcher.profile.username,
            "profile_avatar" : profile_avatar,
            "numComments": num_comments,
            "score": score,
        }
        if identifier == 'recipes':
            post_data["title"] = searcher.recipe_title
            post_data["ingredients"] = searcher.recipe_ingredients
            post_data["description"] = searcher.recipe_description
            post_data["tagsList"] = searcher.recipe_tags
        elif identifier == 'publications':
            post_data["title"] = searcher.publication_title
            post_data["description"] = searcher.publication_description
            post_data["tagsList"] = searcher.publication_tags
        posts.append(post_data)
    return posts

def format_recipes(recipes_query):
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
    
    return posts

def format_publications(publications_query):
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
    
    return posts