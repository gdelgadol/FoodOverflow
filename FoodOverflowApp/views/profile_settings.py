from ..models import Profile
from django.contrib.auth.hashers import check_password
from django.http import JsonResponse
from ..views.token import decode_jwt
import json


def delete_user(request):
    data = json.loads(request.body)
    jwt_token_decoded = decode_jwt(data.get('jwt'))
    user_password = data.get('password')

    if Profile.objects.filter(username = jwt_token_decoded['username']).exists():

        user = Profile.objects.get(username = jwt_token_decoded['username'])

        if check_password(user_password, user.password):
            user.delete()
            return JsonResponse({
                'type' : 'SUCCESS', 
                'message' : 'El usuario ha sido eliminado con éxito.'
                })
        else:
            return JsonResponse({
                'type' : 'ERROR', 
                'message' : 'La contraseña ingresada es incorrecta.'
                })
    else:
        return JsonResponse({
                'type' : 'ERROR', 
                'message' : 'Ha ocurrido un error, intenta nuevamente.'
                })
