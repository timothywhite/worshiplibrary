(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['arrangementsonglayout'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<h3>Songs</h3>\n<div class=\"accordion arrangement-songs\" id=\"arrangement-songs-";
  foundHelper = helpers.id;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "\">\r\n\r\n</div>\n<button class=\"btn add-song\"><i class=\"icon-plus\"></i></button>\n<div class=\"modal hide fade add-song-modal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n	<div class=\"modal-header\">\n		<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">×</button>\n		<h3>Add Songs</h3>\n	</div>\n	<div class=\"modal-body\">\n		<input type=\"text\" data-provide=\"typeahead\" class=\"add-song\" placeholder=\"add song\">\n	</div>\n	<div class=\"modal-footer\">\n		<button class=\"btn\" data-dismiss=\"modal\" aria-hidden=\"true\">Done</button>\n		<div class=\"alert alert-success\">\n			<div>Song Added</div>\n		</div>\n	</div>\n</div>";
  return buffer;});
})();