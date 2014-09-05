define(['app', 'module/extensions', 'module/template'], function(app){
	app.module("Arrangement", function(Arrangement,app,Backbone,Marionette,$,_){

		Arrangement.SongVerseView = Backbone.Marionette.ItemView.extend({
			tagName:'tr',
			template:app.Template.get('arrangementsongverse'),
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
			template:app.Template.get('arrangementsong'),
			tagName:'div',
			className:'accordion-group',
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
			template: app.Template.get('arrangementsonglayout'),
			childView:Arrangement.SongView,
			childViewContainer:'.arrangement-songs',
			events:{
				'click button.add-song':'launchAddSongModal'
			},
			initialize:function(){

			},
			removeSong:function(itemview){
				this.collection.remove({id:itemview.model.get('id')});
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
							song = new app.Song.Model({
								id:data.id,
								name:data.name,
								verses:data.verses.toJSON()
							});
							view.collection.add(song);
								view.$el.find('.alert').fadeIn(400, function(){
								setTimeout(function(){
									view.$el.find('.alert').fadeOut();
								}, 500);
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
			template:app.Template.get('arrangementverse'),
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
			template:app.Template.get('arrangementverselayout'),
			childViewContainer:'tbody',
			childView:Arrangement.VerseView,
			initialize:function(){
				this.on('itemview:verse:remove',this.removeVerse);
				this.on('itemview:verse:up',this.moveUp);
				this.on('itemview:verse:down',this.moveDown);
				this.collection.comparator = function(model) {
				  return model.get('order');
				};
			},
			onBeforeRender:function(){
				this.collection.sort();
			},
			removeVerse:function(itemview){
				this.collection.remove({id:itemview.model.get('id')});
				app.vent.trigger('destroy',itemview.model);
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
				this.set('arrangement_songs', new app.Song.Collection(this.get('arrangement_songs')));
				this.on('change:arrangement_songs', function(model, authors) {
					if(!(model.get('arrangement_songs') instanceof app.Song.Collection)){
						model.set('arrangement_songs', new app.Song.Collection(this.get('arrangement_songs')));
					}
				});
			}
		});
		Arrangement.Layout = Backbone.Marionette.LayoutView.extend({
			template: app.Template.get('arrangement'),
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
					songsLayout.on('itemview:song:remove',function(songview){
						song = songview.model;
						versesLayout.collection.where({song_name:song.get('name')}).forEach(function(model){
							versesLayout.removeVerseByModel(model);
						});
						songsLayout.removeSong(songview);
					});
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
});

