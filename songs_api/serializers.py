from songs_api.models import *
from rest_framework import serializers


class VerseSerializer(serializers.ModelSerializer):
	class Meta:
		model = Verse
		fields = ('id','song','text','description','chords')

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
	
# class SongArrangementSerializer(serializers.ModelSerializer):
	# class Meta:
		# model = SongArrangement
		# fields = ('id','song','arrangement')
		
class SongArrangementRelatedField(serializers.RelatedField):
	def to_native(self,value):
		return {
			'id':value.id,
			'song':value.song.id,
			'arrangement':value.arrangement.id,
			'name':value.song.name,
			'verses': VerseSerializer(value.song.verses.all(),many=True).data
		}
		
class SetListArrangementSerializer(serializers.ModelSerializer):
	class Meta:
		model = SetListArrangement
		fields = ('order','setlist','arrangement')
		
		
class AuthorSerializer(serializers.ModelSerializer):
	class Meta:
		model = Author
		fields = ('id','name')
		
class SongAuthorSerializer(serializers.ModelSerializer):
	class Meta:
		model = SongAuthor
		fields = ('id','order','song','author')
		
class SongAuthorRelatedField(serializers.RelatedField):
	def to_native(self, value):
		return {
			'id':value.id,
			'author':value.author.id,
			'song':value.song.id,
			'name':value.author.name,
			'order':value.order
		}
class SongArrangementRelatedField(serializers.RelatedField):
	def to_native(self, value):
		return {
			'id':value.id,
			'arrangement':value.id,
			'notes': value.notes,
			'description':value.description,
			'last_setlist_date':value.last_setlist_date
		}
		
class SongSerializer(serializers.ModelSerializer):
	verses = VerseSerializer(many=True,read_only=True)
	song_arrangements = SongArrangementRelatedField(many=True,read_only=True)
	song_authors = SongAuthorRelatedField(many=True,read_only=True)
	class Meta:
		model = Song
		fields = ('id','name','copyright','display_ccli','song_authors','verses','song_arrangements')
		
		
class ArrangementSerializer(serializers.ModelSerializer):
	setlists = SetListRelatedField(many=True,read_only=True)
	last_setlist_date = serializers.DateField(source='last_setlist_date', read_only=True)
	arrangement_verses = ArrangementVerseRelatedField(many=True, read_only=True)
	arrangement_songs = SongSerializer(many=True, read_only=True)
	class Meta:
		model = Arrangement
		fields = ('id','notes','description','last_setlist_date','arrangement_verses','arrangement_songs','setlists')
		read_only_fields = ('verses',)
		
		
class SetListSerializer(serializers.ModelSerializer):
	arrangements = ArrangementSerializer(many=True,read_only=True)
	class Meta:
		model = SetList
		fields = ('description','date','arrangements')