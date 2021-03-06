from django.db import models

# Create your models here.

class Song(models.Model):
	name = models.CharField(max_length=255)
	authors = models.ManyToManyField('Author', through='SongAuthor')
	copyright = models.TextField(blank=True)
	display_ccli = models.BooleanField(default=True)
	
	@property
	def song_arrangements(self):
		return Arrangement.objects.filter(verses__song = self).distinct()
		
	def __unicode__(self):
		return self.name
	
class Verse(models.Model):
	text = models.TextField(blank=True)
	description = models.CharField(max_length=255)
	song = models.ForeignKey('Song',related_name='verses')
	chords = models.TextField(blank=True)
	
	def __unicode__(self):
		return self.description
		
class Author(models.Model):
	name = models.CharField(max_length=255)
	def __unicode__(self):
		return self.name
	
class SongAuthor(models.Model):
	order = models.IntegerField()
	author = models.ForeignKey('Author',related_name='song_authors')
	song = models.ForeignKey('Song', related_name='song_authors')
	
	def __unicode__(self):
		return self.author.name
	
class Arrangement(models.Model):
	notes = models.CharField(max_length=255, blank=True)
	description = models.CharField(max_length=255)
	verses = models.ManyToManyField('Verse', through='ArrangementVerse')
	
	@property
	def arrangement_songs(self):
		return Song.objects.filter(verses__arrangement_verses__arrangement = self).distinct()
	
	@property
	def last_setlist_date(self):
		setlists = self.setlists.order_by('-setlist__date')[:1]
		if len(setlists) == 1:
			return setlists[0].setlist.date
		else:
			return '---'
	
	def __unicode__(self):
		return self.description
	
	
class ArrangementVerse(models.Model):
	description = models.CharField(max_length=255,blank=True)
	transposition = models.IntegerField(default=0)
	order = models.IntegerField()
	arrangement = models.ForeignKey('Arrangement',related_name='arrangement_verses')
	verse  = models.ForeignKey('Verse', related_name='arrangement_verses')
	
	def __unicode__(self):
		return self.description
	
class SetList(models.Model):
	date = models.DateField()
	description = models.CharField(max_length=255)
	arrangements = models.ManyToManyField('Arrangement', through='SetListArrangement')
	
	def __unicode__(self):
		return self.description
	
class SetListArrangement(models.Model):
	order = models.IntegerField()
	setlist = models.ForeignKey('SetList', related_name='setlist_arrangements')
	arrangement = models.ForeignKey('Arrangement', related_name='setlists')
	
	def __unicode__(self):
		return self.arrangement.description