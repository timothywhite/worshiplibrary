define([
	'app',
	//Templates
	//Modules
	'module/extensions'
	],
function(app){
	app.module("Setlist", function(Setlist,app,Backbone,Marionette,$,_){
	    Setlist.Model = Backbone.Model.extend({
	        urlRoot: '/api/setlist/'
	    });
	    Setlist.Collection = Backbone.Collection.extend({
	        url: '/api/setlist/',
	        model: Setlist.Model
	    });
	    
	});
});