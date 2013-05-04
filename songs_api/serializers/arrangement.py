from songs_api.models import Arrangement, ArrangementVerse
from rest_framework import serializers

from songs_api.serializers.song import SongSerializer

class SetListRelatedField(serializers.RelatedField):
	def to_native(self, value):
		return {
			'id':value.id,
			'setlist':value.setlist.id,
			'date':value.setlist.date,
			'description':value.setlist.description
		}
		
		
class ArrangementVerseSerializer(serializers.ModelSerializer):
	class Meta:
		model = ArrangementVerse
		fields = ('id','transposition','order','arrangement', 'verse');
		
		
class ArrangementVerseRelatedField(serializers.RelatedField):
	def to_native(self,value):
		data = ArrangementVerseSerializer(value).data
		data['description'] = value.verse.description
		data['text'] = value.verse.text
		data['verse'] = value.verse.id
		data['song_name'] = value.verse.song.name
		return data
		
		
class ArrangementSerializer(serializers.ModelSerializer):
	setlists = SetListRelatedField(many=True,read_only=True)
	last_setlist_date = serializers.DateField(source='last_setlist_date', read_only=True)
	arrangement_verses = ArrangementVerseRelatedField(many=True, read_only=True)
	arrangement_songs = SongSerializer(many=True, read_only=True)
	class Meta:
		model = Arrangement
		fields = ('id','notes','description','last_setlist_date','arrangement_verses','arrangement_songs','setlists')
		read_only_fields = ('verses',)
		