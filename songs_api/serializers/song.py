from songs_api.models import Song, Verse, Author, SongAuthor
from rest_framework import serializers
		
		
class VerseSerializer(serializers.ModelSerializer):
	class Meta:
		model = Verse
		fields = ('id','song','text','description','chords')
		
		
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
		
		