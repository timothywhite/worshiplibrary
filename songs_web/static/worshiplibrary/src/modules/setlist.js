define([
	'app',
	//Templates
	'hbs!template/setlist',
	'hbs!template/setlistarrangement',
	//Modules
	'module/extensions'
	],
function(app, tplSetlist, tplSetlistArr){
	app.module("Setlist", function(Setlist,app,Backbone,Marionette,$,_){
	    Setlist.Model = Backbone.Model.extend({
	        urlRoot: '/api/setlist/'
	    });
	    Setlist.Collection = Backbone.Collection.extend({
	        url: '/api/setlist/',
	        model: Setlist.Model
	    });
		Setlist.ArrangementModel = Backbone.Model.extend({
			urlRoot: '/api/setlist/arrangement/'
		});
		Setlist.ArrangementCollection = Backbone.Collection.extend({
			url: '/api/setlist/arrangement/',
			model: Setlist.ArrangementModel
		});
		Setlist.ArrangementView = Backbone.Marionette.ItemView.extend({
			tagName: 'tr',
			template: tplSetlistArr
		});
		Setlist.CompositeView = Backbone.Marionette.CompositeView.extend({
			template: tplSetlist,
			childView: app.Setlist.ArrangementView,
			childViewContainer:'tbody',
			onTabAdd: function(){
				this.collection = new app.Setlist.ArrangementCollection(this.model.get('setlist_arrangements'));
				this.render();
			}
		});
		
		setlist = new Setlist.Model({id:1});
		setlist.fetch({
			success:function(sl){
				app.setlistTabManager.addTab({
					title: sl.get('description'),
					model: sl
				}).showTab({
					id:sl.get('id')
				});
			}
		});
	    
	});
});