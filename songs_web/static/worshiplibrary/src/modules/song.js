
app.module("Song", function(Song,app,Backbone,Marionette,$,_){
	Song.Model = Backbone.Model.extend({
		urlRoot:'/api/song/',
		defaults:{
			id:null,
			name:"",
			copyright:""
		},
		initialize: function() {
			this.on('change:verses', function(model, verses) {
				if(!(model.get('verses') instanceof app.Verse.Collection)){
					model.set('verses', new app.Verse.Collection(verses));
				}
			});
			this.set('verses', new app.Verse.Collection(this.get('verses')));
			this.on('change:song_authors', function(model, authors) {
				if(!(model.get('song_authors') instanceof app.SongAuthor.Collection)){
					model.set('song_authors', new app.SongAuthor.Collection(model.get('song_authors')));
				}
			});
			this.set('song_authors', new app.SongAuthor.Collection(this.get('song_authors')));
			this.on('change:song_arrangements', function(model, arrangements) {
				if(!(model.get('song_arrangements') instanceof app.SongArrangement.Collection)){
					model.set('song_arrangements', new app.SongArrangement.Collection(arrangements));
				}
			});
			this.set('song_arrangements', new app.SongArrangement.Collection(this.get('song_arrangements')));
		}
	});
	
	Song.Collection = Backbone.Collection.extend({
		url: '/api/song/',
		model: app.Song.Model
	});
	
	Song.Layout = Backbone.Marionette.Layout.extend({
		template: Handlebars.templates.song,
		onBeforeClose: function(){
			//TODO: add save code here.
		},
		initialize:function(){
		},
		regions:{
			authors: '.authors',
			verses: '.verses',
			arrangements: '.arrangements'
		},
		events:{
			'click .button-rename-song':'launchRenameModal',
			'click  button.rename-song':'renameSong',
			'keyup input.rename-song':'catchKeyup',
			'click .button-remove-song':'launchConfirmRemoveModal',
			'click  button.remove-song':'removeSong',
			'change .display-ccli':'updateCCLI',
			'change .copyright':'updateCopyright'
		},
		catchKeyup: function(e){
			if(e.keyCode == 13){
				this.renameSong();
				this.$el.find('.rename-song-modal').modal('hide');
			}
		},
		updateCCLI:function(){
			this.model.set('display_ccli',this.$el.find('.display-ccli').is(':checked'));
			app.vent.trigger('save',this.model);
		},
		updateCopyright:function(){
			this.model.set('copyright',this.$el.find('.copyright').val());
			app.vent.trigger('save',this.model);
		},
		removeSong:function(){
			id = this.model.get('id');
			app.vent.trigger('destroy',this.model);
			app.songTabManager.closeTab({id:id});
		},
		launchConfirmRemoveModal:function(){
			//this.$el.find('.remove-song-modal').modal('show');
		},
		renameSong:function(){
			name = this.$el.find('input.rename-song').val();
			if (name != ''){
				this.model.set('name',name);
				app.vent.trigger('save',this.model);
				this.$el.find('h2').html(name);
			}
		},
		launchRenameModal:function(){
			this.$el.find('.rename-song-modal').on('shown',function(){
				$('input.rename-song').focus();
				$('input.rename-song').select();
			});
			this.$el.find('.rename-song-modal').modal('show');
			this.$el.find('input.rename-song').val(this.model.get('name'));
		},
		onTabAdd: function(){
			versesLayout = new app.Verse.Layout({
				collection:this.model.get('verses'),
				song_id: this.model.get('id')
			});
			this.verses.show(versesLayout);
				authorsCompositeView = new app.SongAuthor.CompositeView({
				collection:this.model.get('song_authors'),
				song_id: this.model.get('id')
			});
			this.authors.show(authorsCompositeView);
			
			arrangementsCompositeView = new app.SongArrangement.CompositeView({
				collection:this.model.get('song_arrangements')
			});
			this.arrangements.show(arrangementsCompositeView);
		},
	});
});

app.module("SongArrangement", function(SongArrangement,app,Backbone,Marionette,$,_){
	SongArrangement.Model = Backbone.Model.extend({
		defaults:{
			id:null,
			description:'',
			notes:'',
			arrangement:null,
			song:null,
			last_setlist_date:''
		}
	});
	
	SongArrangement.Collection = Backbone.Collection.extend({
		model: SongArrangement.Model
	});
	
	SongArrangement.View = Backbone.Marionette.ItemView.extend({
		tagName: 'tr',
		template: Handlebars.templates.songarrangement,
		events:{
			'click':'showArrangement'
		},
		showArrangement:function(){
			arrangement = new app.Arrangement.Model({id:this.model.get('arrangement')});
			arrangement.fetch({
				success:function(model,response,options){
					app.vent.trigger('tab:show',model);
				},
				error:function(model,response,options){
					app.vent.trigger('fetch:error',response.status);
				}
			});
		}
	});
	
	SongArrangement.CompositeView = Backbone.Marionette.CompositeView.extend({
		template:Handlebars.templates.songarrangementlayout,
		itemView:SongArrangement.View,
		itemViewContainer:'tbody'
	});
});

app.module("Author", function(Author,app,Backbone,Marionette,$,_){
	Author.Model = Backbone.Model.extend({
		urlRoot: '/api/author/',
		defaults:{
			'id':null,
			'name':''
		}
	});
	Author.Collection = Backbone.Collection.extend({
		url: '/api/author/',
		model: app.Author.Model
	});
});

app.module("SongAuthor", function(SongAuthor,app,Backbone,Marionette,$,_){
	SongAuthor.Model = Backbone.Model.extend({
		urlRoot:'/api/song/author/',
		defaults:{
			'id':null,
			'name':'',
			'order':null,
			'author':null,
			'song':null
		}
	});
	SongAuthor.Collection = Backbone.Collection.extend({
		url:'/api/song/author/',
		model:SongAuthor.Model
	});
	SongAuthor.View = Backbone.Marionette.ItemView.extend({
		tagName:'tr',
		template: Handlebars.templates.songauthor,
		events:{
			'click .button-down':'moveDown',
			'click .button-up':'moveUp',
			'click .button-remove':'remove'
		},
		moveUp: function(){
			this.trigger('author:up');
		},
		moveDown: function(){
			this.trigger('author:down');
		},
		remove: function(){
			this.trigger('author:remove');
		}
	});
	SongAuthor.CompositeView = Backbone.Marionette.CompositeView.extend({
		template:Handlebars.templates.songauthorlayout,
		itemView:SongAuthor.View,
		itemViewContainer:'tbody',
		events:{
			'click .button-add-author':'launchModal',
			'click button.add-new-author':'addNewAuthor',
			'keyup input.add-new-author':'catchKeyup'
		},
		initialize:function(options){
			this.song_id = options['song_id'];
			this.on('itemview:author:up',this.upAuthor);
			this.on('itemview:author:down',this.downAuthor);
			this.on('itemview:author:remove',this.removeAuthor);
			this.collection.comparator = function(model) {
			  return model.get('order');
			};
		},
		catchKeyup: function(e){
			if(e.keyCode == 13){
				this.addNewAuthor();
			}
		},
		onBeforeRender:function(){
			this.collection.sort();
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
				$('input.add-existing-author').typeahead({
					source:function (query, process){
						acCollection = new app.Author.Collection();
						acCollection.fetch({
							data:{
								q: $('input.add-existing-author').val()
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
						id = _.find(responseData, function(author){ return author['name'] == name; })['id'];
						author = new SongAuthor.Model({
							name: name,
							order: view.collection.length,
							author: id,
							song: view.song_id
						});
						app.vent.trigger('save',author);
						
						view.$el.find('.alert').fadeIn(400, function(){
							setTimeout(function(){
								view.$el.find('.alert').fadeOut();
							}, 500);
						});
						
						view.collection.add(author);
						return "";
					}
				});
			})(this);
		},
		launchModal:function(){
			this.$el.find('.add-author-modal').on('shown',function(){
				$('input.add-existing-author').focus();
			});
			this.$el.find('.add-author-modal').modal('show');
		},
		addNewAuthor:function(){
			name = this.$el.find('input.add-new-author').val();
			author = new app.Author.Model({
				name:name
			});
			(function(view){
				author.save(null,{
					success:function(){
						songAuthor = new SongAuthor.Model({
							name: name,
							order: view.collection.length,
							author: author.get('id'),
							song: view.song_id
						});
						app.vent.trigger('save',songAuthor);
						view.collection.add(songAuthor);
						
						view.$el.find('input.add-new-author').val('');
						view.$el.find('.alert').fadeIn(400, function(){
							setTimeout(function(){
								view.$el.find('.alert').fadeOut();
							}, 500);
						});
					},
					error:function(model, response, options){
						app.vent.trigger('save:error',response.status);
					}
				});
			})(this);
		},
		upAuthor:function(itemview){
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
		downAuthor:function(itemview){
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
		},
		removeAuthor:function(itemview){
			this.collection.remove({id:itemview.model.get('id')});
			app.vent.trigger('destroy',itemview.model);
			this.collection.forEach(function(author,index){
				author.set('order',index);
				app.vent.trigger('save',author);
			});
			this.render();
		}
	});
});

