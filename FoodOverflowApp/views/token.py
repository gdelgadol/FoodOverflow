import json
import jwt
from decouple import config
from django.http import JsonResponse
from ..models import Profile


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

    #return desired data
    return JsonResponse({'username' : profile.username, 'email' : profile.email, 'id': profile.id})