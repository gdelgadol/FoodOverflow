from ..models import Publication, PublicationComment, PublicationVote, SavedPost
from ..models import Profile, Avatar
from ..views.token import decode_jwt
from django.db.models import Sum
from django.db.models import Q
from functools import reduce
from .modules import error_response, success_response, get_if_exists
from .modules import format_publications

import json

#------------------Publication controllers--------------------------#

#View details of a specific publication
def get_publication(request):
    try:
        # get the Json Data, Email and Password
        data = json.loads(request.body)
        publication_id = int(data.get("publication_id"))

        publication = get_if_exists(Publication, {'publication_id' : publication_id})
        if not publication:
            return error_response("La publicación que estás intentando ver no existe")

        publication_comments = PublicationComment.objects.filter(publication=publication)
	
        vote_type = 0
        is_saved = False

	    # Extracting vote type
        if (data.get("jwt")):
            jwt_decoded = decode_jwt(data.get("jwt"))
            if not jwt_decoded:
                return error_response("Hubo un error, intenta iniciar sesión nuevamente.")

            profile = get_if_exists(Profile, {'id' : jwt_decoded["id"]})
            
            if profile:
                vote = get_if_exists(PublicationVote, {'publication' : publication, 'profile' : profile})
                if vote:
                    vote_type = vote.vote_type
                if SavedPost.objects.filter(profile = profile, publication = publication).exists():
                    is_saved = True

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
            'username' : publication.profile.username,
            'profile_avatar' : profile_avatar,
            'title' : publication.publication_title,
            'description' : publication.publication_description,
            "numComments": num_comments,
            "score": publication_score,
            "publication_comments": comments_list,
            "vote_type" : vote_type,
            "tagsList": publication.publication_tags,
            "is_saved" : is_saved
            }
        
        return success_response(publication_json)
    except Exception as e:
        print(e)
        # Catch all other exceptions
        return error_response("Hubo un error, inténtelo de nuevo.")
    
#View all publications made by a user
def get_publications(request):
    try:
        data = json.loads(request.body)
        if data.get('search'):
            publications_query = Publication.objects.filter(
                Q(publication_title__icontains = data.get('search'))
                ).distinct()
        else:
            publications_query = Publication.objects.order_by('publication_creation_date').select_related('profile').all()
        posts = format_publications(publications_query)

        return success_response({'posts' : posts, 'number_posts2' : len(posts)})
    except Exception as e:
        print(e)
        return error_response(str(e))

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

        posts = format_publications(publications_query)

        if(len(posts) == 0):
            return error_response("No se encontraron publicaciones con esas etiquetas.")
        
        return success_response({"posts": posts, "number_posts2": len(posts)})
    except Publication.DoesNotExist:
        return error_response("No se encontraron publicaciones")
    except Exception as e:
        return error_response(str(e))

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
            return error_response("Debes iniciar sesión para crear una publicación.")

        if not jwt_token:
            print(jwt_token)
            return error_response("Hubo un error, intenta iniciar sesión nuevamente.")

        username = jwt_token['username']
        user = Profile.objects.get(username = username)
        if not tags_list:
            Publication.objects.create_publication(title, description, user)
        else:
            Publication.objects.create_publication_tags(title, description, user, tags_list)

        return success_response({"message" : "¡Publicación creada con éxito!"})
    except Exception as e:
        print(e)
        # Catch all other exceptions
        return error_response("Hubo un error, inténtelo de nuevo.")

#Save publication controller
def save_publication(request):
    try:
        data = json.loads(request.body)

        if data.get("jwt"):
            jwt_decoded = decode_jwt(data.get("jwt"))
        else:
            return error_response("Hubo un error con la autenticación del usuario.")

        if Profile.objects.filter(id = jwt_decoded["id"]).exists():
            profile = Profile.objects.get(id = jwt_decoded["id"])
        else:
            return error_response("El perfíl no existe en la base de datos.")
        
        if Publication.objects.filter(publication_id = data.get("post_id")).exists():
            publication = Publication.objects.get(publication_id = data.get("post_id"))
        else:
            return error_response("La publicación que intentas guardar no existe.")

        saved_post = get_if_exists(SavedPost, {'profile' : profile , 'publication' : publication})
        if saved_post:
            saved_post.delete()
            return success_response({"message" : "Publicación eliminada de guardados con éxito."})
        else:
            SavedPost.objects.save_publication(profile, publication)
            return success_response({"message" : "Publicación guardada con éxito."})
    except Exception as e:
        print(e)
        return error_response("Hubo un error, inténtelo de nuevo.")