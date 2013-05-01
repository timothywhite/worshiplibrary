(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['arrangement'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"row-fluid\">\n	<h2>";
  foundHelper = helpers.description;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.description; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</h2>\n	<div class=\"btn-group\">\n		<button class=\"btn button-rename-arrangement\" title=\"rename\"><i class=\"icon-repeat\"></i></button>\n		<button class=\"btn button-remove-arrangement\" title=\"remove\"><i class=\"icon-remove\"></i></button>\n	</div>\n	<hr>\n</div>\n<div class=\"row-fluid songs\"></div>\n<div class=\"row-fluid verses\"></div>\n<div class=\"row-fluid\">\n	<h3>Notes</h3>\n	<textarea class='copyright' style=\"width:97%;height:100px;\">";
  foundHelper = helpers.notes;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.notes; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</textarea>\n</div><!--end row-->\n\n\n<div class=\"modal hide fade rename-arrangement-modal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n	<div class=\"modal-header\">\n		<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">×</button>\n		<h3>Rename Arrangement</h3>\n	</div>\n	<div class=\"modal-body\">\n		<input class=\"rename-arrangement\" type=\"text\" placeholder=\"enter arrangement description\">\n	</div>\n	<div class=\"modal-footer\">\n		<button class=\"btn rename-arrangement\" data-dismiss=\"modal\" aria-hidden=\"true\">Save</button>\n	</div>\n</div>";
  return buffer;});
})();