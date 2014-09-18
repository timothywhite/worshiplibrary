define([
	'app',
	//Templates
	'hbs!template/arrangementsongverse',
	'hbs!template/arrangementsong',
	'hbs!template/arrangementsonglayout',
	'hbs!template/arrangementverse',
	'hbs!template/arrangementverselayout',
	'hbs!template/arrangement',
	//Modules
	'module/extensions'
	],
function(app, tplArrSongVerse, tplArrSong, tplArrSongLayout, tplArrVerse, tplArrVerseLayout, tplArr){
	app.module("Arrangement", function(Arrangement,app,Backbone,Marionette,$,_){

		Arrangement.SongVerseView = Backbone.Marionette.ItemView.extend({
			tagName: 'tr',
			template: tplArrSongVerse,
			events: {
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
			template: tplArrSong,
			tagName:'div',
			className:'panel panel-default',
			childViewContainer:'tbody',
			childView: Arrangement.SongVerseView,
			events:{
				'click .view-song':'viewSong',
				'click .remove-song':'removeSong'
			},
			removeSong:function(){
				this.trigger('song:remove');
			},
			viewSong:function(){
				app.vent.trigger('tab:show',this.model);
			},
			initialize:function(){
				this.collection = this.model.get('verses');
			}
		});
		Arrangement.SongCompositeView = Backbone.Marionette.CompositeView.extend({
			template: tplArrSongLayout,
			childView:Arrangement.SongView,
			childViewContainer:'.arrangement-songs',
			events:{
				'click button.add-song':'launchAddSongModal'
			},
			initialize:function(){

			},
			removeSong:function(childview){
				this.collection.remove({id:childview.model.get('id')});
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
				/*(function(view){
					$('input.add-song').typeahead({
						source:function (query, process){
							var acCollection = new app.Song.Collection();
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
							var data = _.find(responseData, function(song){ return song['name'] == name; });
							var song = new app.Song.Model({
								id:data.id,
								name:data.name,
								verses:data.verses.toJSON()
							});
							song.set('arrangement', view.model.get('id'));
							view.collection.add(song);
								view.$el.find('.alert').fadeIn(400, function(){
								setTimeout(function(){
									view.$el.find('.alert').fadeOut();
								}, 500);
							});
							return "";
						}
					});
				})(this);*/
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
			template: tplArrVerse,
			tagName:'tr',
			events:{
				'click .button-remove':'removeVerse',
				'click .button-up':'moveUp',
				'click .button-down':'moveDown'
			},
			removeVerse:function(){
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
			template: tplArrVerseLayout,
			childViewContainer:'tbody',
			childView:Arrangement.VerseView,
			initialize:function(){
				this.on('childview:verse:remove',this.removeVerse);
				this.on('childview:verse:up',this.moveUp);
				this.on('childview:verse:down',this.moveDown);
				this.collection.comparator = function(model) {
				  return model.get('order');
				};
			},
			removeVerse:function(childview){
				this.collection.remove({id:childview.model.get('id')});
				app.vent.trigger('destroy',childview.model);
				this.collection.forEach(function(verse,index){
					verse.set('order',index);
					app.vent.trigger('save',verse);
				});
				this.render();
			},
			removeVerseByModel:function(model){
				this.collection.remove({id:model.get('id')});
				app.vent.trigger('destroy',model);
				this.collection.forEach(function(verse,index){
					verse.set('order',index);
					app.vent.trigger('save',verse);
				});
				this.render();
			},
			moveUp:function(childview){
				var src = childview.model.get('order');
				if (src !== 0){
					var dst = src - 1,
						dstModel = this.collection.findWhere({order:dst}),
						srcModel = this.collection.findWhere({order:src});
					dstModel.set('order',src);
					srcModel.set('order',dst);
					app.vent.trigger('save',dstModel);
					app.vent.trigger('save',srcModel);
					this.collection.sort();
					this.render();
				}

			},
			moveDown:function(childview){
				var src = childview.model.get('order');
				if (src != (this.collection.length - 1)){
					var dst = src + 1,
						dstModel = this.collection.findWhere({order:dst}),
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
				this.set('arrangement_songs', new app.Song.Collection(this.get('arrangement_songs')));
				this.on('change:arrangement_songs', function(model, authors) {
					if(!(model.get('arrangement_songs') instanceof app.Song.Collection)){
						model.set('arrangement_songs', new app.Song.Collection(this.get('arrangement_songs')));
					}
				});
			}
		});
		Arrangement.Collection = Backbone.Collection.extend({
			url: 'api/arrangement/',
			model: Arrangement.Model
		});
		Arrangement.Layout = Backbone.Marionette.LayoutView.extend({
			template: tplArr,
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
				var descr = this.$el.find('input.rename-arrangement').val();
				this.model.set('description',descr);
				app.vent.trigger('save',this.model);
				this.$el.find('h2').html(descr);
			},
			updateNotes:function(){
				this.model.set('notes',this.$el.find('textarea').val());
				app.vent.trigger('save',this.model);
			},
			onTabAdd: function(){
				var model = this.model,
					versesLayout = new Arrangement.VerseCompositeView({
						collection:this.model.get('arrangement_verses')
					}),
					songsLayout = new Arrangement.SongCompositeView({
						collection: new app.Song.Collection(this.model.get('arrangement_songs').map(function(song){
							song.set('arrangement', model.get('id'));
							return song;
						})),
						model: this.model
					});
				(function(view){
					songsLayout.on('childview:song:remove',function(songview){
						var song = songview.model;
						versesLayout.collection.where({song_name:song.get('name')}).forEach(function(model){
							versesLayout.removeVerseByModel(model);
						});
						songsLayout.removeSong(songview);
					});
					songsLayout.on('childview:childview:verse:add',function(songview,verseview){
						var song = songview.model,
							verse = verseview.model,
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
				this.verses.show(versesLayout);
				this.songs.show(songsLayout);
			}
		});
	});
});

