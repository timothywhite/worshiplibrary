define(['app', 'handlebars'], function(app, Handlebars) {
	app.module("Extensions", function(Extensions, app, Backbone, Marionette, $, _) {
		//modify Backbone.sync to include a csrf token from a cookie if present.
		app.addInitializer(function() {
			var csrftokenCookieName = 'csrftoken';
			var oldSync = Backbone.sync;
			Backbone.sync = function(method, model, options) {
				var original = options.beforeSend,
					addCSRFToken = function(xhr) {
						xhr.setRequestHeader('X-CSRFToken', csrftoken);
						if (original) original(xhr);
						return true;
					};
				if (document.cookie && document.cookie !== '') {
					var cookies = document.cookie.split(';');
					for (var i in cookies) {
						cookies[i] = $.trim(cookies[i]);
						if (cookies[i].substring(0, csrftokenCookieName.length + 1) === (csrftokenCookieName + '=')) {
							var csrftoken = decodeURIComponent(cookies[i].substring(csrftokenCookieName.length + 1));
							options.beforeSend = addCSRFToken;
							break;
						}
					}
				}
				return oldSync(method, model, options);
			};
		});
	});
});
