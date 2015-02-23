require.config({
	baseUrl: "/static/worshiplibrary/",
	paths: {
		app: "src/application",
		module: "src/modules",
		text: "bower_components/text/text",
		template: "templates",
		backbone: "bower_components/backbone/backbone",
		bootstrap: "bower_components/bootstrap/dist/js/bootstrap",
		handlebars: "bower_components/handlebars/handlebars",
		hbs: "bower_components/hbs/hbs",
		jquery: "bower_components/jquery/dist/jquery",
		marionette: "bower_components/marionette/lib/core/backbone.marionette",
		"backbone.babysitter": "bower_components/backbone.babysitter/lib/backbone.babysitter",
		"backbone.wreqr": "bower_components/backbone.wreqr/lib/backbone.wreqr",
		underscore: "bower_components/underscore/underscore",
		"bootstrap3-typeahead": "bower_components/bootstrap3-typeahead/bootstrap3-typeahead",
		requirejs: "bower_components/requirejs/require"
	},
	shim: {
		jquery: {
			exports: "$"
		},
		underscore: {
			exports: "_"
		},
		backbone: {
			deps: [
				"underscore",
				"jquery"
			],
			exports: "Backbone"
		},
		bootstrap: {
			deps: [
				"jquery"
			]
		},
		handlebars: {
			exports: "Handlebars"
		}
	},
	hbs: {
		templateExtension: "handlebars"
	},
	packages: [

	]
});

require([
	'app',
	'module/extensions',
	'module/sidebar',
	'module/tabs',
	'module/song',
	'module/verse',
	'module/arrangement',
	'module/setlist',
]);
