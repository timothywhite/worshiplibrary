from songs_api.models import SetList, SetListArrangement
from rest_framework import serializers

class SetListArrangementSerializer(serializers.ModelSerializer):
	class Meta:
		model = SetListArrangement
		fields = ('id', 'order', 'arrangement')
		
class SetListSerializer(serializers.ModelSerializer):
	setlist_arrangements = SetListArrangementSerializer(many=True,read_only=True)
	class Meta:
		model = SetList
		fields = ('id', 'description', 'date', 'setlist_arrangements')