app.module("Sidebar", function(Sidebar,app,Backbone,Marionette,$,_){
	Sidebar.SongView = Backbone.Marionette.ItemView.extend({
		tagName:'li',
		className:'song-search-entry',
		template: Handlebars.templates.songsearchentry
	});
	Sidebar.SongCompositeView = Backbone.Marionette.CompositeView.extend({
		tagName: 'div',
		className:'well',
		template: Handlebars.templates.songsidebar,
		itemView: Sidebar.SongView,
		itemViewContainer: 'ul',
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
			name = this.$el.find('input.add-new-song').val();
			if (name != ''){
				song = new app.Song.Model({name:name});
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
			query = this.$el.find('input.search-songs').val();
			if(query != ''){
				(function(view){
					view.collection.fetch({
						data:{
							q:query
						},
						success:function(){
							view.$el.find('li.song-search-entry a').click(function(e){
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
});