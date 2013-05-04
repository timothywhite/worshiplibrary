from songs_api.models import SetList, SetListArrangement
from rest_framework import serializers

from songs_api.serializers.arrangement import ArrangementSerializer

class SetListArrangementSerializer(serializers.ModelSerializer):
	class Meta:
		model = SetListArrangement
		fields = ('order','setlist','arrangement')
		
class SetListSerializer(serializers.ModelSerializer):
	arrangements = ArrangementSerializer(many=True,read_only=True)
	class Meta:
		model = SetList
		fields = ('description','date','arrangements')