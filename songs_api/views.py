from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.template import Context, Template
from django.template.loader import get_template
from django.db.models import Q

from songs_api.models import *
from songs_api.serializers import *

from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.reverse import reverse
from rest_framework.response import Response
	
	
@api_view(['GET'])
def api_root(request,format=None):
	return Response({
		'song':reverse('song-list',request=request),
		'verse':reverse('verse-list',request=request),
		'author':reverse('author-list',request=request),
		'songauthor':reverse('songauthor-list',request=request),
		'arrangement':reverse('arrangement-list',request=request),
		'arrangementverse':reverse('arrangementverse-list',request=request),
		'setlist':reverse('setlist-list',request=request),
		'setlistarrangement':reverse('setlistarrangement-list',request=request),
	})
	
class SongDetail(generics.RetrieveUpdateDestroyAPIView):
	"""
	API endpoint that represents a song.
	"""
	model = Song
	serializer_class = SongSerializer
	
class SongList(generics.ListCreateAPIView):
	"""
	API endpoint that represents a list of songs.
	"""
	model = Song
	serializer_class = SongSerializer
	def get_queryset(self):
		if 'q' in self.request.GET:
			query = self.request.GET['q']
			return Song.objects.filter(Q(verses__text__icontains=query) | Q(name__icontains=query)).distinct()
		else:
			return Song.objects.all()
			
class AuthorDetail(generics.RetrieveUpdateDestroyAPIView):
	"""
	API endpoint that represents an author.
	"""
	model = Author
	serializer_class = AuthorSerializer
	
class AuthorList(generics.ListCreateAPIView):
	"""
	API endpoint that represents a list of authors.
	"""
	model = Author
	serializer_class = AuthorSerializer
	
	def get_queryset(self):
		if 'q' in self.request.GET:
			return Author.objects.filter(name__icontains=self.request.GET['q'])
		else:
			return Author.objects.all();
			
class SongAuthorDetail(generics.RetrieveUpdateDestroyAPIView):
	"""
	API endpoint that represents a song author.
	"""
	model = SongAuthor
	serializer_class = SongAuthorSerializer
	
class SongAuthorList(generics.ListCreateAPIView):
	"""
	API endpoint that represents a list of song authors.
	"""
	model = SongAuthor
	serializer_class = SongAuthorSerializer
	
class VerseDetail(generics.RetrieveUpdateDestroyAPIView):
	"""
	API endpoint that represents a verse.
	"""
	model = Verse
	serializer_class = VerseSerializer
	
class VerseList(generics.ListCreateAPIView):
	"""
	API endpoint that represents a list of verses.
	"""
	model = Verse
	serializer_class = VerseSerializer
		
class ArrangementDetail(generics.RetrieveUpdateDestroyAPIView):
	"""
	API endpoint that represents a arrangement.
	"""
	model = Arrangement
	serializer_class = ArrangementSerializer
	
class ArrangementList(generics.ListCreateAPIView):
	"""
	API endpoint that represents a list of arrangement.
	"""
	model = Arrangement
	serializer_class = ArrangementSerializer
		
class ArrangementVerseDetail(generics.RetrieveUpdateDestroyAPIView):
	"""
	API endpoint that represents an arrangement verse.
	"""
	model = ArrangementVerse
	serializer_class = ArrangementVerseSerializer
	
class ArrangementVerseList(generics.ListCreateAPIView):
	"""
	API endpoint that represents a list of arrangement verses.
	"""
	model = ArrangementVerse
	serializer_class = ArrangementVerseSerializer
		
class SetListDetail(generics.RetrieveUpdateDestroyAPIView):
	"""
	API endpoint that represents a set list.
	"""
	model = SetList
	serializer_class = SetListSerializer
	
class SetListList(generics.ListCreateAPIView):
	"""
	API endpoint that represents a list of set list.
	"""
	model = SetList
	serializer_class = SetListSerializer
		
class SetListArrangementDetail(generics.RetrieveUpdateDestroyAPIView):
	"""
	API endpoint that represents a set list.
	"""
	model = SetList
	serializer_class = SetListArrangementSerializer
	
class SetListArrangementList(generics.ListCreateAPIView):
	"""
	API endpoint that represents a list of set list.
	"""
	model = SetListArrangement
	serializer_class = SetListArrangementSerializer
	
