import json
from django.test import TestCase, RequestFactory
from django.http import JsonResponse
from unittest.mock import patch, MagicMock
from FoodOverflowApp.models import Publication, Profile, PublicationComment, PublicationVote
from FoodOverflowApp.views import get_publications

class GetPublicationsTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    @patch('FoodOverflowApp.views.Publication.objects')
    @patch('FoodOverflowApp.views.PublicationComment.objects')
    @patch('FoodOverflowApp.views.PublicationVote.objects')
    def test_get_publications_success(self, mock_publication_vote, mock_publication_comment, mock_publication):

        mock_publication_order_by = mock_publication.order_by.return_value
        mock_publication_order_by.select_related.return_value.all.return_value = [
            Publication(publication_id=1, publication_title="Title 1", publication_description="Description 1", publication_tags="Tag1, Tag2", profile=Profile(username="user1")),
            Publication(publication_id=2, publication_title="Title 2", publication_description="Description 2", publication_tags="Tag1, Tag3", profile=Profile(username="user2"))
        ]

        mock_publication_comment.filter.return_value.count.side_effect = [2, 1]

        mock_publication_vote.filter.return_value.aggregate.return_value = {'vote_type__sum': 5}

        request = self.factory.get('/publications/')
        response = get_publications(request)

        expected_response = {
            "type": "SUCCESS",
            "posts": [
                {
                    "id": 1,
                    "userName": "user1",
                    "title": "Title 1",
                    "description": "Description 1",
                    "numComments": 2,
                    "score": 5,
                    "tagsList": "Tag1, Tag2"
                },
                {
                    "id": 2,
                    "userName": "user2",
                    "title": "Title 2",
                    "description": "Description 2",
                    "numComments": 1,
                    "score": 5,
                    "tagsList": "Tag1, Tag3"
                }
            ]
        }

        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content), expected_response)
        print("Se obtuvo:\n", json.loads(response.content))
        print("Se esperaba:\n", expected_response)
        print("--------------------------------------------------------------")

    @patch('FoodOverflowApp.views.Publication.objects')
    def test_get_publications_no_publications(self, mock_publication):

        mock_publication.order_by.return_value.select_related.return_value.all.return_value = []

        request = self.factory.get('/publications/')
        response = get_publications(request)

        expected_response = {'type': 'SUCCESS', 'posts': []}

        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content), expected_response)
        print("Se obtuvo:\n", json.loads(response.content))
        print("Se esperaba:\n", expected_response)
        print("--------------------------------------------------------------")

    @patch('FoodOverflowApp.views.Publication.objects')
    @patch('FoodOverflowApp.views.PublicationComment.objects')
    @patch('FoodOverflowApp.views.PublicationVote.objects')
    def test_get_publications_exception(self, mock_publication_vote, mock_publication_comment, mock_publication):

        mock_publication_order_by = mock_publication.order_by.return_value
        mock_publication_order_by.select_related.side_effect = Exception("Test Exception")

        request = self.factory.get('/publications/')
        response = get_publications(request)

        expected_response = {
            "type": "ERROR",
            "message": "Test Exception"
        }

        self.assertEqual(response.status_code, 500)
        self.assertEqual(json.loads(response.content), expected_response)
        print("Se obtuvo:\n", json.loads(response.content))
        print("Se esperaba:\n", expected_response)
        print("--------------------------------------------------------------")

    @patch('FoodOverflowApp.views.Publication.objects')
    @patch('FoodOverflowApp.views.PublicationComment.objects')
    @patch('FoodOverflowApp.views.PublicationVote.objects')
    def test_get_publications_empty_vote_score(self, mock_publication_vote, mock_publication_comment, mock_publication):

        mock_publication_order_by = mock_publication.order_by.return_value
        mock_publication_order_by.select_related.return_value.all.return_value = [
            Publication(publication_id=1, publication_title="Title 1", publication_description="Description 1", publication_tags="Tag1, Tag2", profile=Profile(username="user1"))
        ]

        mock_publication_comment.filter.return_value.count.return_value = 2

        mock_publication_vote.filter.return_value.aggregate.return_value = {'vote_type__sum': None}

        request = self.factory.get('/publications/')
        response = get_publications(request)

        expected_response = {
            "type": "SUCCESS",
            "posts": [
                {
                    "id": 1,
                    "userName": "user1",
                    "title": "Title 1",
                    "description": "Description 1",
                    "numComments": 2,
                    "score": 0,
                    "tagsList": "Tag1, Tag2"
                }
            ]
        }

        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content), expected_response)
        print("Se obtuvo:\n", json.loads(response.content))
        print("Se esperaba:\n", expected_response)
        print("--------------------------------------------------------------")

    @patch('FoodOverflowApp.views.Publication.objects')
    @patch('FoodOverflowApp.views.PublicationComment.objects')
    @patch('FoodOverflowApp.views.PublicationVote.objects')
    def test_get_publications_exception_during_comment_counting(self, mock_publication_vote, mock_publication_comment, mock_publication):

        mock_publication_order_by = mock_publication.order_by.return_value
        mock_publication_order_by.select_related.return_value.all.return_value = [
            Publication(publication_id=1, publication_title="Title 1", publication_description="Description 1", publication_tags="Tag1, Tag2", profile=Profile(username="user1"))
        ]


        mock_publication_comment.filter.side_effect = Exception("Test Exception")

        request = self.factory.get('/publications/')
        response = get_publications(request)

        expected_response = {
            "type": "ERROR",
            "message": "Test Exception"
        }

        self.assertEqual(response.status_code, 500)
        self.assertEqual(json.loads(response.content), expected_response)
        print("Se obtuvo:\n", json.loads(response.content))
        print("Se esperaba:\n", expected_response)
        print("--------------------------------------------------------------")



