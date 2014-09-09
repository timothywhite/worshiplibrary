define([
	'app',
	//Templates
	'hbs!template/songsidebar',
	'hbs!template/songsearchentry',
	'hbs!template/arrangementsidebar',
	'hbs!template/arrangementsearchentry',
	//Modules
	'module/song',
	'module/arrangement'
],
function(app, tplSongSidebar, tplSongSearchEntry, tplArrSidebar, tplArrSearchEntry){
	app.module("Sidebar", function(Sidebar,app,Backbone,Marionette,$,_){
		Sidebar.SongView = Backbone.Marionette.ItemView.extend({
			tagName:'li',
			className:'song-search-entry',
			template: tplSongSearchEntry
		});
		Sidebar.SongCompositeView = Backbone.Marionette.CompositeView.extend({
			tagName: 'div',
			className:'well',
			template: tplSongSidebar,
			childView: Sidebar.SongView,
			childViewContainer: 'ul',
			events:{
				'click button.add-new-song' : 'addNewSong',
				'click button.search-songs' : 'searchSongs',
				'keyup' : 'catchKeyup'
			},
			initialize:function(){
				this.collection = new app.Song.Collection();
			},
			catchKeyup: function(e){
				if(e.keyCode == 13){
					if(e.srcElement.className == 'add-new-song'){
						this.addNewSong();
					}else if(e.srcElement.className == 'search-songs'){
						this.searchSongs();
					}
				}
			},
			addNewSong:function(){
				var name = this.$el.find('input.add-new-song').val();
				if (name !== ''){
					var song = new app.Song.Model({name:name});
					song.save(null,{
						success:function(){
							app.songTabManager.addTab({
								title: song.get('name'),
								model: song
							}).showTab({
								id:song.get('id')
							});
						},
						error:function(model, response, options){
							app.vent.trigger('save:error',response.status);
						}
					});
				}
			},
			searchSongs:function(){
				var query = this.$el.find('input.search-songs').val();
				if(query !== ''){
					(function(view){
						view.collection.fetch({
							data:{
								q:query
							},
							success:function(){
								view.$el.find('li.song-search-entry a').click(function(e){
									var id, song;
									e.preventDefault();
									id = $(this).attr('href');
									song = view.collection.findWhere({id:parseInt(id)});
									app.songTabManager.addTab({
										title: song.get('name'),
										model: song
									}).showTab({
										id:song.get('id')
									});
								});
							},
							error:function(model, response, options){
								app.vent.trigger('fetch:error',response.status);
							}
						});
					})(this);
				}
			}
		});
		Sidebar.ArrangementView = Backbone.Marionette.ItemView.extend({
			tagName:'li',
			className:'arrangement-search-entry',
			template: tplArrSearchEntry
		});
		Sidebar.ArrangementCompositeView = Backbone.Marionette.CompositeView.extend({
			tagName: 'div',
			className:'well',
			template: tplArrSidebar,
			childView: Sidebar.ArrangementView,
			childViewContainer: 'ul',
			events:{
				'click button.add-new-arrangement' : 'addNewArrangement',
				'click button.search-arrangements' : 'searchArrangments',
				'keyup' : 'catchKeyup'
			},
			initialize: function(){
				this.collection = new app.Arrangement.Collection();
			},
			addNewArrangement: function(){
				var description = this.$el.find('input.add-new-arrangement').val();
				if (description !== ''){
					var arrangement = new app.Arrangement.Model({description:description});
					arrangement.save(null,{
						success:function(){
							app.arrangementTabManager.addTab({
								title: arrangement.get('description'),
								model: arrangement
							}).showTab({
								id:arrangement.get('id')
							});
						},
						error:function(model, response, options){
							app.vent.trigger('save:error',response.status);
						}
					});
				}
			},
			searchArrangments: function(){
				var query = this.$el.find('input.search-arrangements').val();
				if(query !== ''){
					(function(view){
						view.collection.fetch({
							data:{
								q:query
							},
							success:function(){
								view.$el.find('li.arrangement-search-entry a').click(function(e){
									var id, arrangement;
									e.preventDefault();
									id = $(this).attr('href');
									arrangement = view.collection.findWhere({id:parseInt(id)});
									app.arrangementTabManager.addTab({
										title: arrangement.get('description'),
										model: arrangement
									}).showTab({
										id:arrangement.get('id')
									});
								});
							},
							error:function(model, response, options){
								app.vent.trigger('fetch:error',response.status);
							}
						});
					})(this);
				}
			}
		});
		//initialize sidebars for application
		app.addInitializer(function(){
			var songSidebarView = new Sidebar.SongCompositeView();
			app.songSidebar.show(songSidebarView);
			var arrangementSidebarView = new Sidebar.ArrangementCompositeView();
			app.arrangementSidebar.show(arrangementSidebarView);
		});
	});
});

