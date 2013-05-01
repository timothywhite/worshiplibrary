from django.contrib import admin
from songs_api.models import *

class VerseInline(admin.TabularInline):
	model = Verse
	
class SongAuthorInline(admin.TabularInline):
	model = SongAuthor

class SongAdmin(admin.ModelAdmin):
	inlines = [
		VerseInline,
		SongAuthorInline,
	]
	
admin.site.register(Song, SongAdmin)
admin.site.register(Author)