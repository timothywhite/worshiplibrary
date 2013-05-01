(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['editversechord'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<input class='chord-input'type=\"text\" value=\"";
  stack1 = depth0[0];
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\" placeholder=\"enter chords\"/>\r\n<input class='text-input' type=\"text\" value=\"";
  stack1 = depth0[1];
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\" placeholder=\"enter text\"/>\r\n";
  return buffer;}

  buffer += "<pre class=\"chord-edit\">\r\n";
  stack1 = depth0.line_pairs;
  stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n</pre>";
  return buffer;});
})();