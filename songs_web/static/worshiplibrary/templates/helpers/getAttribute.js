define('templates/helpers/getAttribute', ['handlebars'], function(Handlebars) {
	Handlebars.registerHelper('getAttribute', function(model, attribute) {
		var value = model.get(attribute);
		return new Handlebars.SafeString(value);
	});
});
