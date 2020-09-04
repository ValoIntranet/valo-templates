declare const Handlebars: any;

// In the HTML template you can use it as follows: {{customLogger itemValue}}
Handlebars.registerHelper("customLogger", function(value: string) {
  console.log("Custom Logger:", value);
});