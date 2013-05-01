(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['songsidebar'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<div class=\"form-inline\">\n	<input class=\"add-new-song\" type=\"text\" placeholder=\"add new song\">\n	<button class=\"btn add-new-song\" type=\"button\">Add</button>\n</div>\n<div class=\"form-inline\">\n	<input class=\"search-songs\" type=\"text\" placeholder=\"search songs\">\n	<button class=\"btn search-songs\" type=\"button\">Search</button>\n</div>\n<ul></ul>";});
})();