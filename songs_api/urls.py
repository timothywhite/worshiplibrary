from django.conf.urls import patterns, include, url

from rest_framework.urlpatterns import format_suffix_patterns

from songs_api.views import *

urlpatterns = patterns('',
	url(r'^$', 'songs_api.views.api_root'),
	
	url(r'^song/(?P<pk>\d+)$', SongDetail.as_view(), name='song-detail'),
	url(r'^song/$', SongList.as_view(), name='song-list'),
	
	url(r'^author/(?P<pk>\d+)$', AuthorDetail.as_view(), name='author-detail'),
    url(r'^author/$', AuthorList.as_view(), name='author-list'),
	
	url(r'^song/author/(?P<pk>\d+)$', SongAuthorDetail.as_view(), name='songauthor-detail'),
    url(r'^song/author/$', SongAuthorList.as_view(), name='songauthor-list'),
	
	url(r'^verse/(?P<pk>\d+)$', VerseDetail.as_view(), name='verse-detail'),
    url(r'^verse/$', VerseList.as_view(), name='verse-list'),
	
	url(r'^arrangement/(?P<pk>\d+)$', ArrangementDetail.as_view(), name='arrangement-detail'),
	url(r'^arrangement/$', ArrangementList.as_view(), name='arrangement-list'),
	
	url(r'^arrangement/verse/(?P<pk>\d+)$', ArrangementVerseDetail.as_view(), name='arrangementverse-detail'),
	url(r'^arrangement/verse/$', ArrangementVerseList.as_view(), name='arrangementverse-list'),
	
	url(r'^setlist/(?P<pk>\d+)$', SetListDetail.as_view(), name='setlist-detail'),
	url(r'^setlist/$', SetListList.as_view(), name='setlist-list'),
	
	url(r'^setlist/arrangement/(?P<pk>\d+)$', SetListArrangementDetail.as_view(), name='setlistarrangement-detail'),
	url(r'^setlist/arrangement/$', SetListArrangementList.as_view(), name='setlistarrangement-list')
)

# Format suffixes
urlpatterns = format_suffix_patterns(urlpatterns, allowed=['json', 'api'])

# Default login/logout views
urlpatterns += patterns('',
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
)