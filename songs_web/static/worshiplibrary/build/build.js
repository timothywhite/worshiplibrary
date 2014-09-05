{
	baseUrl: "../assets/js",
	paths: {
		'app': '../../src/application',
		'module': '../../src/modules',
		'text': 'text',
		'template': '../../templates',
		'requireLib': 'require',
		'handlebars': 'handlebars/handlebars.runtime',
		'handlebars-compiler': 'handlebars'
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
		templateExtension: '.handlebars',
		compilerPath: 'handlebars'
	},
	include: 'requireLib',
	out: 'app-build.js',
	name: '../../main',
}
