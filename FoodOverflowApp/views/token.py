import json
import jwt
from decouple import config
from ..models import Profile, Avatar
from ..models import Publication, Recipe, PublicationComment, RecipeComment, PublicationVote, RecipeVote, SavedPost
from .modules import error_response, success_response, get_if_exists
from django.forms.models import model_to_dict


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
        return {'username' : profile.username, 'email' : profile.email, 'id': profile.id, "is_admin" : profile.is_admin}
    except Exception as e:
        print(str(e))
        return None

def get_jwt(request):
    try:
        data = json.loads(request.body)
        if not data.get("jwt"):
            return error_response("Ha ocurrido un error, intentalo de nuevo.")
        token = data.get("jwt")

        #Decode the jwt
        decoded = decode_jwt(token)

        #get profile
        if Profile.objects.filter(username = decoded["username"]).exists():
            profile = Profile.objects.get(username = decoded["username"])
        else: 
            return error_response("El usuario que estás intentando buscar no existe.")
    
        return success_response({
            "username" : profile.username,
            "email" : profile.email,
            "is_admin" : profile.is_admin
        })
    
    except Exception as e:
        print(str(e))
        return error_response("Ha ocurrido un error, intentalo de nuevo.")

# return the information encoded in the front token
def get_user_data(request, identifier):
    try:
        profile_info = {}

        if identifier == "profile":
            #get the Json token
            data = json.loads(request.body)
            if not data.get("jwt"):
                return error_response("Ha ocurrido un error, intentalo de nuevo.")
            token = data.get("jwt")

            #Decode the jwt
            decoded = decode_jwt(token)

            #get profile
            profile = get_if_exists(Profile, {'username' : decoded["username"]})
            if profile:
                profile_info['email'] = profile.email 
                profile_info['id'] = profile.id
                profile_info["saved_posts"] = SavedPost.objects.filter(profile = profile).count()
            else: 
                return error_response("El usuario que estás intentando buscar no existe.")

        else:
            profile = get_if_exists(Profile, {'username' : identifier})
            if not profile: 
                return error_response("El usuario que estás intentando buscar no existe.")

        if profile.avatar_id:
            profile_info["avatar"] = Avatar.objects.get(avatar_id = profile.avatar_id.avatar_id).avatar_url
        else:
            profile_info["avatar"] = ""
            
        profile_info["username"] = profile.username
        profile_info["description"] = profile.description                            
        profile_info["profile_publications"] = Publication.objects.filter(profile = profile).count()
        profile_info["commented_publications"] = PublicationComment.objects.filter(profile = profile).count()
        profile_info["voted_publications"] = PublicationVote.objects.filter(profile = profile).count()
        profile_info["profile_recipes"] = Recipe.objects.filter(profile = profile).count()
        profile_info["commented_recipes"] = RecipeComment.objects.filter(profile = profile).count()
        profile_info["voted_recipes"] = RecipeVote.objects.filter(profile = profile).count()

        #return desired data
        return success_response(profile_info)
    except Exception as e:
        print(str(e))
        return error_response("Ha ocurrido un error, intentalo de nuevo.")
    
#get all avatars
def get_avatars(request):
    try:
        avatares = Avatar.objects.all()
        avatars = []

        for avatar in avatares:
            avatars.append(model_to_dict(avatar))

        return success_response({'avatars' : avatars})
    except Exception as e:
        print(e)
        return error_response("Ha ocurrido un error, intentalo de nuevo.")
