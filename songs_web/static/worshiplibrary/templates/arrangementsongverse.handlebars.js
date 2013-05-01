(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['arrangementsongverse'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  stack1 = depth0[0];
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\r\n";
  stack1 = depth0[1];
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\r\n";
  return buffer;}

  buffer += "<td>";
  foundHelper = helpers.description;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.description; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</td>\r\n<td class=\"verse-controls\">\r\n	<button class=\"btn add-verse\"><i class=\"icon-plus\"></i></button>\r\n	<button class=\"btn view-verse\"><i class=\"icon-eye-open\"></i></button>\r\n	<div class=\"modal hide fade view-verse-modal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\r\n		<div class=\"modal-header\">\r\n			<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">×</button>\r\n			<h3>Verse Preview</h3>\r\n		</div>\r\n		<div class=\"modal-body\">\r\n			<pre>\r\n";
  stack1 = depth0.line_pairs;
  stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n</pre>\r\n		</div>\r\n		<div class=\"modal-footer\">\r\n			<button class=\"btn rename-song\" data-dismiss=\"modal\" aria-hidden=\"true\">Done</button>\r\n		</div>\r\n	</div>\r\n</td>";
  return buffer;});
})();