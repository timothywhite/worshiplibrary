require.config({
	baseUrl: "/static/worshiplibrary/assets/js",
		paths: {
			'app': '../../src/application',
			'module': '../../src/modules',
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
	}
});

require([
	'app',
	'module/extensions',
	'module/template',
	'module/sidebar',
	'module/tabs',
	'module/song',
	'module/verse',
	'module/arrangement',
]);
