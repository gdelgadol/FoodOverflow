from ..models import Publication
from ..models import Profile
from django.http import JsonResponse
#from jwt import decode as decode_jwt
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

    return


def get_forum_posts(request):
    try:
        publications_query = Publication.objects.select_related('profile').all()
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
