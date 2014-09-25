define([
	'app',
	//Templates
	'hbs!template/tab',
	//Modules
	'module/song',
	'module/arrangement',
	'module/setlist'
],
function(app, tplTab){
	app.module('Tab', function(Tab,app,Backbone,Marionette,$,_){
		//Module for handling tabs using the bootstrap tab component.
		Tab.Model = Backbone.Model.extend({
			defaults:{
				'id':'',
				'title':'',
				'type':'',
				'active':true,
				'closeable':true
			}
		});
		Tab.View = Backbone.Marionette.ItemView.extend({
			template: tplTab,
			tagName:'li',
			attributes: function(){
				return {id:this.model.get('type')+'-tab-'+this.model.get('id')};
			},
			events:{
				'click .close-tab':'closeTab',
				'click a':'selectTab'
			},
			closeTab: function(){
				this.trigger('tab:close',this.model.get('id'));
			},
			selectTab: function(){
				this.trigger('tab:select',this.model.get('id'));
			}
		});

		Tab.Collection = Backbone.Collection.extend({
			model: Tab.Model
		});
		Tab.CollectionView = Backbone.Marionette.CollectionView.extend({
			childView: Tab.View,
			onAfterItemAdded: function(){
				var index = this.collection.indexOf(this.collection.findWhere({'active':true}));
				this.$('li:eq('+index+') a').tab('show');
			},
			initialize:function(){
				this.on('childview:tab:close',function(childview,id){this.closeTab(id)});
				this.on('childview:tab:select',function(childview,id){this.selectTab(id)});
			},
			onRender:function(){

			},
			closeTab: function(id){
				var model = this.collection.findWhere({id:id}),
					isActive = model.get('active');
				if (isActive){
					if(this.collection.length != 1){
						var index = this.collection.indexOf(model);
						if(index == (this.collection.length-1)){
							index--;
						}else{
							index++;
						}
						this.collection.at(index).set('active',true);
						this.$('li:eq('+index+') a').tab('show');
					}
				}
				this.collection.remove({id:id});
				this.trigger('tab:close',{id:model.get('id')});
			},
			selectTab: function(id){
				this.resetActiveTab();
				this.collection.findWhere({id:id}).set('active',true);
			},
			addTab: function(tab){
				this.collection.add(tab);
			},
			showTab: function(id){
				this.resetActiveTab();
				var model = this.collection.findWhere({id:id}),
					index = this.collection.indexOf(model);
				model.set('active',true);
				this.$('li:eq('+index+')').removeClass('active');
				this.$('li:eq('+index+') a').tab('show');
			},
			resetActiveTab: function(){
				this.collection.where({active:true}).forEach(function(tab, index, array){
					tab.set('active', false);
				});
			}
		});
		Tab.Pane = {};
		Tab.Pane.CollectionView = Backbone.Marionette.CollectionView.extend({
			className:'tab-content',
			addPane: function(model){
				this.collection.add(model);
			},
			closePane: function(id){
				this.collection.remove({id:id});
			},
			initialize:function(){
				this.on('childview:update',function(){
					this.render();
				});
			}
		});

		Tab.TabManager = function(options){
			this.closeable = options['closeable'] === true;
			this.type = options['type'];
			this.panesEl = options['panesEl'];
			this.tabsEl = options['tabsEl'];

			this.tabView = new Tab.CollectionView({
				collection:new Tab.Collection(),
				el:this.tabsEl
			});
			this.tabPaneView = new app.Tab.Pane.CollectionView({
				collection: new Backbone.Collection(),
				el:this.panesEl,
				childView: options['paneView'].extend({
					tagName: 'div',
					className:'tab-pane',
					attributes:function(){
							return {id:options['type'] + '-pane-' + this.model.get('id')};
					}
				})
			});

			this.addTab = function(options){
				var id = options['model'].get('id');
				if(!this.tabPaneView.collection.findWhere({id:id})){
					this.tabPaneView.addPane(options['model']);
					this.tabView.addTab({
						type: this.type,
						id: options['model'].get('id'),
						title: options['title'],
						closeable: this.closeable
					});
					Marionette.triggerMethod.call(this.tabPaneView.children.findByIndex(this.tabPaneView.children.length-1),'tab:add');
				}
				return this;
			};
			this.showTab = function(options){
				if(this.tabPaneView.collection.findWhere({id:options['id']})){
					this.tabView.showTab(options['id']);
				}
				return this;
			};
			this.closeTab = function(options){
				this.tabView.children.filter(function(view){
					return view.model.get('id') == options['id']
				})
				.map(function(view){
					view.closeTab();
				});
				return this;
			};
			this.renameTab = function(options){
				var id = options['id'],
					title = options['title'];
				this.tabView.collection.findWhere({id:id}).set('title',title);
				this.tabView.render();
			},
			this.getPanes = function(){
				return this.tabPaneView.collection;
			};
			this.getActivePane = function(){
				var activeTab = this.tabView.collection.findWhere({active:true});
				return this.tabPaneView.collection.findWhere({id:activeTab.get('id')});
			};
			this.renderPanes = function(){
				this.tabPaneView.render();
				this.showTab({id:this.tabView.collection.findWhere({active:true}).get('id')});
				this.tabPaneView.children.map(function(view){
					Marionette.triggerMethod.call(view,'tab:pane:render');
				});
			};

			//initialize the manager
			(function(manager){
				manager.tabView.render();
				manager.tabPaneView.render();
				manager.tabView.on('tab:close',function(options){
					manager.tabPaneView.closePane(options['id']);
				});
				if (manager.initialize) manager.initialize();
			})(this);
		}

		//Create tab managers for the application
		app.songTabManager = new Tab.TabManager({
			type: 'song',
			panesEl: '#song-content',
			tabsEl:'#song-tabs',
			paneView: app.Song.Layout,
			closeable: true
		});

		app.arrangementTabManager = new Tab.TabManager({
			type:'arrangement',
			panesEl:'#arrangement-content',
			tabsEl:'#arrangement-tabs',
			paneView:app.Arrangement.Layout,
			closeable: true
		});
		
		app.setlistTabManager = new Tab.TabManager({
			type: 'setlist',
			panesEl: '#setlist-content',
			tabsEl: '#setlist-tabs',
			paneView: app.Setlist.CompositeView,
			closeable: true
		});

	});
});
