app.module("Verse", function(Verse,app,Backbone,Marionette,$,_){
	Verse.Model = Backbone.Model.extend({
		urlRoot:'/api/verse/',
		defaults:{
			id:null,
			song:null,
			text:"",
			chords:"",
			description:"",
			chordmode: false,
			editmode: false
		},
		initialize:function(){
			this.on('change:lines',this.syncLinesToText);
			this.on('change:chordlines',this.syncChordLinesToChords);
		},
		syncLinesToText:function(){
			newtext = _.filter(this.get('lines'),function(line){
				return line != '';
			}).join('\n');
			if(this.get('text') != newtext){
				this.set('text',newtext);
			}
		},
		syncChordLinesToChords:function(){
			newtext = _.filter(this.get('chordlines'),function(line){
				return line != '';
			}).join('\n');
			if(this.get('chords') != newtext){
				this.set('chords',newtext);
			}
		},
		setLines:function(){
			this.set('lines',_.filter(this.get('text').split('\n'), function(line){
				return line != '';
			}));
			if(this.get('chordmode')){
				this.set('chordlines',_.filter(this.get('chords').split('\n'), function(line){
					return line != '';
				}));
				this.set('line_pairs',_.zip(this.get('chordlines'),this.get('lines')));
				if(this.get('line_pairs').length == 0){
					this.set('line_pairs',[['','']]);
				}
			}
		}
	});
	Verse.Collection = Backbone.Collection.extend({
		url:'/api/verse/',
		model: Verse.Model
	});
	Verse.View = Backbone.Marionette.ItemView.extend({
		initialize: function(){
		},
		events:{
			'change input':'updateChordsheet',
			'change textarea':'updateText'
		},
		getTemplate:function(){
			if(this.model.get('chordmode')){
				if (this.model.get('editmode')){
					return app.Template.get('editversechord');
				}else{
					return app.Template.get('versechord');
				}
			}else{
				if (this.model.get('editmode')){
				return app.Template.get('editverse');
				}else{
					return app.Template.get('verse');
				}
			}
			
		},
		onTabPaneRender:function(){
			this.$el.find('textarea').each(function(index,textarea){
				textarea = $(textarea);
				lh = $(textarea).css('line-height');
				lh = parseInt(lh,10);
				lines = $(textarea).html().split('\n').length;
				$(textarea).css('height', lh * lines);
			});
		},
		onBeforeRender:function(){
			this.model.setLines();
		},
		onRender:function(){
			
		},
		updateChordsheet:function(){
			chordlines = this.$el.find('.chord-input').map(function(){return $(this).val()}).toArray();
			this.model.set('chordlines',chordlines);
			lines = this.$el.find('.text-input').map(function(){return $(this).val()}).toArray();
			this.model.set('lines',lines);
			app.vent.trigger('save',this.model);
		},
		updateText:function(){
			text = this.$el.find('textarea').val();
			this.model.set('text',text);
			app.vent.trigger('save',this.model);
		}
	});
	Verse.Layout = Backbone.Marionette.Layout.extend({
		template: app.Template.get('verselayout'),
		events:{
			'click .button-edit':'editModeToggle',
			'click .button-chords':'chordModeOn',
			'click .button-text':'chordModeOff',
			'click .button-add':'showAddModal',
			'click  button.add-new-verse':'addVerse',
			'click .button-rename':'showRenameModal',
			'click  button.rename-verse':'renameVerse',
			'click .button-remove':'confirmRemove',
			'click  button.remove-verse':'removeVerse',
			'keyup': 'catchKeyup'
		},
		initialize: function(options){
			this.song_id = options['song_id'];
			this.editmode = false;
			this.chordmode = false;
		},
		catchKeyup: function(e){
			if(e.keyCode == 13){
				if(e.srcElement.className == 'rename-verse'){
					this.$el.find('.rename-verse-modal').modal('hide');
					this.renameVerse();
				}else if(e.srcElement.className == 'add-new-verse'){
					this.addVerse();
				}
			}
		},
		addVerse:function(){
			description = this.$el.find('input.add-new-verse').val();
			verse = new Verse.Model({
				description: description,
				chords: '\n',
				lines:'\n',
				song: this.song_id,
				editmode: this.editmode,
				chordmode: this.chordmode
			});
			(function(view){
				verse.save(null,{
					success:function(){
						view.collection.add(verse);
						view.tabManager.addTab({
							model:verse,
							title: verse.get('description')
						});
						view.$el.find('input.add-new-verse').val('');
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
			})(this);
		},
		confirmRemove:function(){
			this.$el.find('.remove-verse-modal').modal('show');
		},
		removeVerse:function(){
			activeModel = this.tabManager.getActivePane();
			this.tabManager.closeTab({id:activeModel.get('id')});
			app.vent.trigger('destroy',activeModel);
		},
		renameVerse:function(){
			description = this.$el.find('input.rename-verse').val();
			activeModel = this.tabManager.getActivePane();
			activeModel.set('description',description);
			this.tabManager.renameTab({id:activeModel.get('id'),title:description});
			app.vent.trigger('save',activeModel);
		},
		showAddModal:function(){
			this.$el.find('.add-verse-modal').on('shown',function(){
				$('input.add-new-verse').focus();
			});
			this.$el.find('.add-verse-modal').modal('show');
		},
		showRenameModal:function(){
			this.$el.find('.rename-verse-modal').on('shown',function(){
				$('input.rename-verse').focus();
				$('input.rename-verse').select();
			});
			activeModel = this.tabManager.getActivePane();
			this.$el.find('input.rename-verse').val(activeModel.get('description'));
			this.$el.find('.rename-verse-modal').modal('show');
		},
		editModeToggle:function(){
			if(!this.editmode){
				this.tabManager.getPanes().forEach(function(pane){
					pane.set('editmode',true);
				});
			}else{
				this.tabManager.getPanes().forEach(function(pane){
					pane.set('editmode',false);
				});
			}
			this.editmode = !this.editmode;
			this.tabManager.renderPanes();
		},
		chordModeOn:function(){
			this.tabManager.getPanes().forEach(function(pane){
					pane.set('chordmode',true);
			});
			this.chordmode = true;
			this.tabManager.renderPanes();
		},
		chordModeOff:function(){
			this.tabManager.getPanes().forEach(function(pane){
					pane.set('chordmode',false);
			});
			this.chordmode = false;
			this.tabManager.renderPanes();
		},
		onShow:function(){
			if(this.collection){
				tabManager = new app.Tab.TabManager({
					type: 'verse',
					panesEl: this.$el.find('.verse-content'),
					tabsEl:this.$el.find('.verse-tabs'),
					paneView: Verse.View,
					closeable: false
				});
				this.collection.forEach(function(verse){
					tabManager.addTab({
						title: verse.get('description'),
						model: verse
					});
				});
				this.tabManager = tabManager;
				this.$el.find('.btn').tooltip({
					container: 'body'
				});
			}
		}
	});
});