(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['arrangementsong'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"accordion-heading\">\r\n	<button class=\"btn remove-song\"><i class=\"icon-remove\"></i></button>\r\n	<button class=\"btn view-song\"><i class=\"icon-eye-open\"></i></button>\r\n	<a class=\"accordion-toggle collapsed\" data-toggle=\"collapse\" data-parent=\"#arrangement-songs-";
  foundHelper = helpers.arrangement;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.arrangement; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "\" href=\"#arrangement-song-";
  foundHelper = helpers.id;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "\">\r\n		";
  foundHelper = helpers.name;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "\r\n	</a>\r\n</div>\r\n<div class=\"accordion-body collapse\" id=\"arrangement-song-";
  foundHelper = helpers.id;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "\" >\r\n	<div class=\"accordion-inner\">\n		<table class=\"table table-condensed table-hover\">\n			<thead>\n				<tr>\n					<th>Verses</th>\n				</tr>\r\n				<tr></tr>\n			</thead>\n			<tbody>\n			</tbody>\n			<tfoot></tfoot>\n		</table>\n	</div>\r\n</div>";
  return buffer;});
})();