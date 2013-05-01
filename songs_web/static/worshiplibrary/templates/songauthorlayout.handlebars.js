(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['songauthorlayout'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "﻿<h3>Authors</h3>\r\n<table class=\"table table-condensed table-hover\">\r\n	<thead>\r\n		<tr>\r\n			<th>Name</th>\r\n			<th></th>\r\n		</tr>\r\n	</thead>\r\n	<tbody>\r\n	</tbody>\r\n	<tfoot>\r\n		<tr>\r\n			<td colspan=\"2\" class=\"add-author\">\r\n				<button class=\"btn button-add-author\"><i class=\"icon-plus\"></i></button>\r\n			</td>\r\n		</tr>\r\n	</tfoot>\r\n</table>\r\n<div class=\"modal hide fade add-author-modal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\r\n	<div class=\"modal-header\">\r\n		<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">×</button>\r\n		<h3>Add Authors</h3>\r\n	</div>\r\n	<div class=\"modal-body\">\r\n		<input type=\"text\" data-provide=\"typeahead\" class=\"add-existing-author\" placeholder=\"add existing author\">\r\n		<span>or</span>\r\n		<div class=\"input-append\">\r\n			<input class=\"add-new-author\" type=\"text\" placeholder=\"add new author\">\r\n			<button class=\"btn add-new-author\" type=\"button\">Add</button>\r\n		</div>\r\n	</div>\r\n	<div class=\"modal-footer\">\r\n		<button class=\"btn\" data-dismiss=\"modal\" aria-hidden=\"true\">Done</button>\r\n		<div class=\"alert alert-success\">\r\n			<div>Author added</div>\r\n		</div>\r\n	</div>\r\n</div>";});
})();