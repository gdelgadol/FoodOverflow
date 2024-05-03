from ..models import Publication, PublicationComment, PublicationVote
from ..models import Recipe, RecipeComment, RecipeVote
from ..models import Profile, Avatar
from ..models import Notification
from django.http import JsonResponse
from ..views.token import decode_jwt
from django.db.models import Sum
from django.db.models import Q
from functools import reduce

import json

#------------------Publication controllers--------------------------#

#View details of a specific publication
def get_publication(request):
    try:
        # get the Json Data, Email and Password
        data = json.loads(request.body)
        publication_id = int(data.get("publication_id"))

        if Publication.objects.select_related('profile').filter(publication_id = publication_id).exists():
            publication = Publication.objects.select_related('profile').get(publication_id = publication_id)
        else:
            return JsonResponse({
                "message" : "La publicación que estás intentando ver no existe.", 
                "type" : "ERROR"
                })

        publication_comments = PublicationComment.objects.filter(publication=publication)
	
        vote_type = 0

	    # Extracting vote type
        if (data.get("jwt")):
            jwt_decoded = decode_jwt(data.get("jwt"))

            if not jwt_decoded:
                return JsonResponse({"message" : "Hubo un error, intenta iniciar sesión nuevamente.", "type" : "ERROR"})

            if Profile.objects.filter(id = jwt_decoded["id"]).exists():
                profile = Profile.objects.get(id = jwt_decoded["id"])
            
                if PublicationVote.objects.filter(publication = publication, profile = profile).exists():
                    vote_type = PublicationVote.objects.get(publication = publication, profile = profile).vote_type

        # Extracting relevant data from the comments
        comments_list = []
        publication_comments = PublicationComment.objects.filter(publication=publication, comment_response_id = None)
        num_comments = publication_comments.count()
        for comment in publication_comments:
            
            profile_avatar = Avatar.objects.get(avatar_id = comment.profile.avatar_id.avatar_id).avatar_url

            comment_data = {
                'comment_id': comment.publication_comment_id,
                'comment_content': comment.comment_body,
                'comment_user': comment.profile.username,
                'comment_user_avatar': profile_avatar  # Assuming user is related to the comment
                # Add more fields if needed
            } 
            publication_comments_response = PublicationComment.objects.filter(publication=publication, comment_response_id = comment.publication_comment_id)
            response_list = []
            for response in publication_comments_response:

                profile_avatar = Avatar.objects.get(avatar_id = response.profile.avatar_id.avatar_id).avatar_url

                response_data = {
                'response_id': response.publication_comment_id,
                'response_content': response.comment_body,
                'response_user': response.profile.username,
                'response_user_avatar': profile_avatar  # Assuming user is related to the comment
                # Add more fields if needed
                }
                response_list.append(response_data)
                num_comments += 1
            
            comment_data["response_list"] = response_list

            comments_list.append(comment_data)

        publication_score = PublicationVote.objects.filter(publication = publication.publication_id).aggregate(Sum('vote_type'))['vote_type__sum']

        if not publication_score:
            publication_score = 0

        if publication.profile.avatar_id:
            profile_avatar = Avatar.objects.get(avatar_id = publication.profile.avatar_id.avatar_id).avatar_url
        else:
            profile_avatar = ""
            
        publication_json = {
            "type": "SUCCESS",
            'username' : publication.profile.username,
            'profile_avatar' : profile_avatar,
            'title' : publication.publication_title,
            'description' : publication.publication_description,
            "numComments": num_comments,
            "score": publication_score,
            "publication_comments": comments_list,
            "vote_type" : vote_type,
            "tagsList": publication.publication_tags
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

        return JsonResponse({"type": "SUCCESS", "posts": posts})
    except Exception as e:
        print(e)
        return JsonResponse({"type": "ERROR", "message": str(e)}, status=500)

#Get publications by tags  
def get_publications_tags(request):
    try:
        # Extract tags list from the request body
        request_data = json.loads(request.body)
        tags_list = request_data.get('tagsList', [])
        # Build a query to filter publications based on tags_list
        publications_query = Publication.objects.filter(
            reduce(lambda x, y: x | y, [Q(publication_tags__contains=[tag]) for tag in tags_list])
        ).order_by('publication_creation_date').select_related('profile').all()

        posts = []

        for publication in publications_query:
            username = publication.profile.username
            num_comments = PublicationComment.objects.filter(publication=publication.publication_id).count()
            score = PublicationVote.objects.filter(publication=publication.publication_id).aggregate(
                Sum('vote_type'))['vote_type__sum']
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

        if(len(posts) == 0):
            return JsonResponse({"type": "ERROR", "message":"No se encontraron publicaciones con esas etiquetas"})
        
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
        tags_list = data.get("tags_list")

        
        if data.get("jwt"):
            jwt_token = decode_jwt(data.get("jwt"))
        else:
            return JsonResponse({"message" : "Debes iniciar sesión para crear una publicación.", "type" : "ERROR"})

        if not jwt_token:
            print(jwt_token)
            return JsonResponse({"message" : "Hubo un error, intenta iniciar sesión nuevamente.", "type" : "ERROR"})

        username = jwt_token['username']
        user = Profile.objects.get(username = username)
        if not tags_list:
            Publication.objects.create_publication(title, description, user)
        else:
            Publication.objects.create_publication_tags(title, description, user, tags_list)

        return JsonResponse({"message" : "¡Publicación creada con éxito!", "type" : "SUCCESS"})
    except Exception as e:
        print(e)
        # Catch all other exceptions
        return JsonResponse({"message" : "Hubo un error, inténtelo de nuevo", "type" : "ERROR"})