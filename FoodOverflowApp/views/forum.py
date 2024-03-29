from ..models import Publication
from ..models import Profile
from django.http import JsonResponse
from ..views.token import decode_jwt
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
    num_comments = 0
    publication_score = 0

    publication_json = {
        'username' : publication.profile.username,
        'title' : publication.publication_description,
        'description' : publication.publication_description,
        "num_comments": num_comments,
        "score": publication_score
        }
    
    return JsonResponse(publication_json)


def get_forum_posts(request):
    try:
        publications_query = Publication.objects.order_by('publication_creation_date').select_related('profile').all()
        posts = []

        for publication in publications_query:
            username = publication.profile.username
            num_comments = 0
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
        # Catch all other exceptions
        return JsonResponse({"message" : "Hubo un error, inténtelo de nuevo", "type" : "ERROR"})
    



