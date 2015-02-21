from songs_api.models import SetList, SetListArrangement
from rest_framework import serializers

class SetListArrangementSerializer(serializers.ModelSerializer):
	description = serializers.CharField(max_length=255, source='arrangement.description', read_only=True)
	notes = serializers.CharField(max_length=255, source='arrangement.notes', read_only=True)
	class Meta:
		model = SetListArrangement
		fields = ('id', 'order', 'arrangement', 'description', 'notes', 'setlist')
		
class SetListSerializer(serializers.ModelSerializer):
	setlist_arrangements = SetListArrangementSerializer(many=True,read_only=True)
	class Meta:
		model = SetList
		fields = ('id', 'description', 'date', 'setlist_arrangements')