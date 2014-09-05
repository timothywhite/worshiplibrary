from django.shortcuts import render_to_response
from django.conf import settings

def index(request):
	return render_to_response('index.html', {'debug': settings.DEBUG})
