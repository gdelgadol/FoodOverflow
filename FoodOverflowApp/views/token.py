import json
import jwt
from decouple import config
from django.http import JsonResponse


# Decode the JWT token
def decode_jwt(token):
    #get the secret key
    secret = config('SECRET_JWT_KEY')
    #get the encode algorithm
    algorithm = config('JWT_ALGORITHM')
    #Decode the token
    response = jwt.decode(token, secret, algorithms = [algorithm])
    # return a dict with the decoded data
    return response


# return the information encoded in the front token
def get_user_data(request):
    #get the Json token
    data = json.loads(request.body)
    token = data.get("jwt")

    #Decode the jwt
    decoded = decode_jwt(token)

    #return desired data
    return JsonResponse({'username' : decoded['username']})