require.config({
	baseUrl: "/static/worshiplibrary/assets/js",
	paths: {
		'app': '../../src/application',
		'module': '../../src/modules',
		'text': 'text',
		'template': '../../templates'
	},
	shim: {
		'jquery': {
			exports: '$'
		},
		'underscore': {
			exports: '_'
		},
		'backbone': {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone',
		},
		'bootstrap': {
			deps: ['jquery']
		},
		'handlebars': {
			exports: 'Handlebars'
		}
	},
	packages: [
		{
			name: 'hbs',
			location: 'hbs',
			main: 'hbs'
		}
	],
	hbs: {
		templateExtension: '.handlebars'
	}
});

require([
	'app',
	'module/extensions',
	'module/sidebar',
	'module/tabs',
	'module/song',
	'module/verse',
	'module/arrangement',
]);
