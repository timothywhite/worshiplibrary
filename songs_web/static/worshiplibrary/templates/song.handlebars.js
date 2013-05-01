(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['song'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return " checked=\"checked\" ";}

  buffer += "<div class=\"row-fluid\">\n	<h2>";
  foundHelper = helpers.name;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</h2>\n	<div class=\"btn-group\">\n		<button class=\"btn button-rename-song\" title=\"rename\"><i class=\"icon-repeat\"></i></button>\n		<button class=\"btn button-remove-song\" title=\"remove\"><i class=\"icon-remove\"></i></button>\n	</div>\n	<hr>\n</div>\n<div class=\"row-fluid verses\"></div>\n<div class=\"row-fluid authors\"></div>\n<div class=\"row-fluid arrangements\"></div>\n<div class=\"row-fluid\">\n	<h3>Copyright</h3>\n	<textarea class='copyright' style=\"width:97%;height:100px;\">";
  foundHelper = helpers.copyright;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.copyright; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</textarea>\n	<label class=\"checkbox\">\n      <input class='display-ccli'";
  stack1 = depth0.display_ccli;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "type=\"checkbox\"> Display CCLI\n    </label>\n</div><!--end row-->\n\n<div class=\"modal hide fade rename-song-modal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n	<div class=\"modal-header\">\n		<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">×</button>\n		<h3>Rename Song</h3>\n	</div>\n	<div class=\"modal-body\">\n		<input class=\"rename-song\" type=\"text\" placeholder=\"enter song title\">\n	</div>\n	<div class=\"modal-footer\">\n		<button class=\"btn rename-song\" data-dismiss=\"modal\" aria-hidden=\"true\">Save</button>\n	</div>\n</div>\n<div class=\"modal hide fade remove-song-modal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n	<div class=\"modal-header\">\n		<h3>Remove Song</h3>\n	</div>\n	<div class=\"modal-body\">\n		Are you sure you want to completely delete this song forever in an irreversible fashion?\n	</div>\n	<div class=\"modal-footer\">\n		<button class=\"btn btn-danger remove-song\" data-dismiss=\"modal\" aria-hidden=\"true\">Yes, delete this song forever.</button>\n		<button class=\"btn\" data-dismiss=\"modal\" aria-hidden=\"true\">NO! Get me outta here!</button>\n	</div>\n</div>";
  return buffer;});
})();