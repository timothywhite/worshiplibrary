
app.module("Arrangement", function(Arrangement,app,Backbone,Marionette,$,_){

	Arrangement.SongModel = Backbone.Model.extend({
		urlRoot: '/api/song/arrangement/',
		defaults:{
			'id':null,
			'song':null,
			'arrangement':null,
			'name':'',
			'verses':[]
		},
		initialize:function(){
			this.set('verses', new app.Verse.Collection(this.get('verses')));
			this.on('change:verses', function(model, authors) {
				if(!(model.get('verses') instanceof app.Verse.Collection)){
					model.set('verses', new app.Verse.Collection(model.get('verses')));
				}
			});
		}
	});
	Arrangement.SongCollection = Backbone.Collection.extend({
		url:'/api/song/arrangement/',
		model:Arrangement.SongModel
	});
	Arrangement.SongVerseView = Backbone.Marionette.ItemView.extend({
		tagName:'tr',
		template:Handlebars.templates.arrangementsongverse,
		events:{
			'click .view-verse':'showPreview',
			'click .add-verse':'addVerse'
		},
		addVerse:function(){
			this.trigger('verse:add');
		},
		showPreview:function(){
			this.$el.find('.view-verse-modal').modal('show');
		},
		onBeforeRender:function(){
			this.model.set('chordmode',true);
			this.model.setLines();
		}
	});
	Arrangement.SongView = Backbone.Marionette.CompositeView.extend({
		template:Handlebars.templates.arrangementsong,
		tagName:'div',
		className:'accordion-group',
		itemViewContainer:'tbody',
		itemView: Arrangement.SongVerseView,
		events:{
			'click .view-song':'viewSong',
			'click .remove-song':'removeSong'
		},
		removeSong:function(){
			this.trigger('song:remove');
		},
		viewSong:function(){
			song = new app.Song.Model({id:this.model.get('song')});
			song.fetch({
				success:function(model, response, options){
					app.vent.trigger('tab:show',model);
				}
			})
		},
		initialize:function(){
			this.collection = this.model.get('verses');
		}
	});
	Arrangement.SongCompositeView = Backbone.Marionette.CompositeView.extend({
		template: Handlebars.templates.arrangementsonglayout,
		itemView:Arrangement.SongView,
		itemViewContainer:'.arrangement-songs',
		events:{
			'click button.add-song':'launchAddSongModal'
		},
		initialize:function(){
			this.on('itemview:song:remove',this.removeSong);
		},
		removeSong:function(itemview){
			this.collection.remove({id:itemview.model.get('id')});
			app.vent.trigger('destroy',itemview.model);
			this.render();
		},
		launchAddSongModal:function(){
			this.$el.find('.add-song-modal').modal('show');
		},
		onShow:function(){
			this.setupModal();
		},
		onRender:function(){
			this.setupModal();
		},
		setupModal: function(){
			var responseData = [];
			(function(view){
				$('input.add-song').typeahead({
					source:function (query, process){
						acCollection = new app.Song.Collection();
						acCollection.fetch({
							data:{
								q: $('input.add-song').val()
							},
							success:function(collection, response, options){
								
								responseData = collection.toJSON();
								process(_.pluck(responseData,'name'));
							},
							error:function(collection, response, options){
								app.vent.trigger('fetch:error',response.status);
							}
						});
					},
					updater: function (name) {
						data = _.find(responseData, function(song){ return song['name'] == name; });
						song = new Arrangement.SongModel({
							song:data['id'],
							arrangement:view.model.get('id'),
							name:data['name'],
							verses:data['verses'].toJSON(),
						});
						song.save(null,{
							success:function(model,response,options){
								view.collection.add(song);
								view.$el.find('.alert').fadeIn(400, function(){
									setTimeout(function(){
										view.$el.find('.alert').fadeOut();
									}, 500);
								});
							},
							error:function(model,response,options){
								app.vent.trigger('save:error',response.status);
							}
						});
						return "";
					}
				});
			})(this);
		},
	});
	Arrangement.VerseModel = Backbone.Model.extend({
		urlRoot: '/api/arrangement/verse/',
		defaults:{
			id: null, 
			description: '', 
			transposition: 0, 
			order: 0, 
			text:'',
			song_name:'',
			arrangement: null, 
			verse: null
		}
	});
	Arrangement.VerseCollection = Backbone.Collection.extend({
		url:'/api/arrangement/verse/',
		model:Arrangement.VerseModel
	});
	Arrangement.VerseView = Backbone.Marionette.ItemView.extend({
		template:Handlebars.templates.arrangementverse,
		tagName:'tr',
		events:{
			'click .button-remove':'remove',
			'click .button-up':'moveUp',
			'click .button-down':'moveDown'
		},
		remove:function(){
			this.trigger('verse:remove');
		},
		moveUp:function(){
			this.trigger('verse:up');
		},
		moveDown:function(){
			this.trigger('verse:down');
		}
	});
	Arrangement.VerseCompositeView = Backbone.Marionette.CompositeView.extend({
		template:Handlebars.templates.arrangementverselayout,
		itemViewContainer:'tbody',
		itemView:Arrangement.VerseView,
		initialize:function(){
			this.on('itemview:verse:remove',this.remove);
			this.on('itemview:verse:up',this.moveUp);
			this.on('itemview:verse:down',this.moveDown);
			this.collection.comparator = function(model) {
			  return model.get('order');
			};
		},
		onBeforeRender:function(){
			this.collection.sort();
		},
		remove:function(itemview){
			this.collection.remove({id:itemview.model.get('id')});
			app.vent.trigger('destroy',itemview.model);
			this.collection.forEach(function(verse,index){
				verse.set('order',index);
				app.vent.trigger('save',verse);
			});
			this.render();
		},
		moveUp:function(itemview){
			src = itemview.model.get('order');
			if (src != 0){
				dst = src - 1;
				dstModel = this.collection.findWhere({order:dst});
				srcModel = this.collection.findWhere({order:src});
				dstModel.set('order',src);
				srcModel.set('order',dst);
				app.vent.trigger('save',dstModel);
				app.vent.trigger('save',srcModel);
				this.collection.sort();
				this.render();
			}
		
		},
		moveDown:function(itemview){
			src = itemview.model.get('order');
			if (src != (this.collection.length - 1)){
				dst = src + 1;
				dstModel = this.collection.findWhere({order:dst});
				srcModel = this.collection.findWhere({order:src});
				dstModel.set('order',src);
				srcModel.set('order',dst);
				app.vent.trigger('save',dstModel);
				app.vent.trigger('save',srcModel);
				this.collection.sort();
				this.render();
			}
		}
	});
	Arrangement.Model = Backbone.Model.extend({
		urlRoot: '/api/arrangement/',
		defaults:{
			id:null,
			notes:'',
			description:'',
			last_setlist_date:'',
			arrangement_songs:[],
			arrangement_verses:[],
			setlists: []
		},
		initialize:function(){
			this.set('arrangement_verses', new Arrangement.VerseCollection(this.get('arrangement_verses')));
			this.on('change:arrangement_verses', function(model, authors) {
				if(!(model.get('arrangement_verses') instanceof Arrangement.VerseCollection)){
					model.set('arrangement_verses', new Arrangement.VerseCollection(this.get('arrangement_verses')));
				}
			});
			this.set('arrangement_songs', new Arrangement.SongCollection(this.get('arrangement_songs')));
			this.on('change:arrangement_songs', function(model, authors) {
				if(!(model.get('arrangement_songs') instanceof Arrangement.SongCollection)){
					model.set('arrangement_songs', new Arrangement.SongCollection(this.get('arrangement_songs')));
				}
			});
		}
	});
	Arrangement.Layout = Backbone.Marionette.Layout.extend({
		template: Handlebars.templates.arrangement,
		events:{
			'click .button-rename-arrangement':'showRenameModal',
			'click button.rename-arrangement':'renameArrangement',
			'change textarea':'updateNotes'
		},
		regions:{
			songs:'.songs',
			verses:'.verses'
		},
		showRenameModal:function(){
			this.$el.find('.rename-arrangement-modal').on('shown',function(){
				$('input.rename-arrangement').focus();
				$('input.rename-arrangement').select();
			});
			this.$el.find('.rename-arrangement-modal').modal('show');
			this.$el.find('input.rename-arrangement').val(this.model.get('description'));
		},
		renameArrangement:function(){
			descr = this.$el.find('input.rename-arrangement').val();
			this.model.set('description',descr);
			app.vent.trigger('save',this.model);
			this.$el.find('h2').html(descr);
		},
		updateNotes:function(){
			this.model.set('notes',this.$el.find('textarea').val());
			app.vent.trigger('save',this.model);
		},
		onTabAdd: function(){
			versesLayout = new Arrangement.VerseCompositeView({
				collection:this.model.get('arrangement_verses')
			});
			this.verses.show(versesLayout);
			songsLayout = new Arrangement.SongCompositeView({
				collection:this.model.get('arrangement_songs'),
				model: this.model
			});
			(function(view){
				songsLayout.on('itemview:itemview:verse:add',function(songview,verseview){
					song = songview.model;
					verse = verseview.model;
					arrangementverse = new Arrangement.VerseModel({
						description: verse.get('description'),
						'song_name':song.get('name'),
						order:versesLayout.collection.length,
						arrangement: view.model.get('id'),
						verse:verse.get('id')
					});
					app.vent.trigger('save',arrangementverse);
					versesLayout.collection.add(arrangementverse);
				});
			})(this);
			this.songs.show(songsLayout);
		}
	});
});