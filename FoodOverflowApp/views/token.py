import json
import jwt
from decouple import config
from django.http import JsonResponse
from ..models import Profile
from ..models import Publication, Recipe, PublicationComment, RecipeComment, PublicationVote, RecipeVote


# Decode the JWT token
def decode_jwt(token):
    try:
        #get the secret key
        secret = config('SECRET_JWT_KEY')
        #get the encode algorithm
        algorithm = config('JWT_ALGORITHM')
        #Decode the token
        response = jwt.decode(token, secret, algorithms = [algorithm])

        profile = Profile.objects.get(username = response["username"])
        # return a dict with the decoded data
        return {'username' : profile.username, 'email' : profile.email, 'id': profile.id}
    except:
        return None


# return the information encoded in the front token
def get_user_data(request):
    #get the Json token
    data = json.loads(request.body)
    token = data.get("jwt")

    #Decode the jwt
    decoded = decode_jwt(token)

    #get profile
    profile = Profile.objects.get(username = decoded["username"])

    profile_publications = Publication.objects.filter(profile = profile).count()
    commented_publications = PublicationComment.objects.filter(profile = profile).count()
    voted_publications = PublicationVote.objects.filter(profile = profile).count()
    profile_recipes = Recipe.objects.filter(profile = profile).count()
    commented_recipes = RecipeComment.objects.filter(profile = profile).count()
    voted_recipes = RecipeVote.objects.filter(profile = profile).count()
    saved_posts = 0

    #return desired data
    return JsonResponse({'username' : profile.username, 
                         'email' : profile.email, 
                         'id': profile.id, 
                         'profile_publications' : profile_publications,
                         'commented_publications' : commented_publications,
                         'voted_publications' : voted_publications,
                         'profile_recipes' : profile_recipes,
                         'commented_recipes'  : commented_recipes ,
                         'voted_recipes' : voted_recipes,
                         'saved_posts' : saved_posts})