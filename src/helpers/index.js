/**
 * Helpers
 */

module.exports.register = function (Handlebars, options)  {
  Handlebars.registerHelper('original_basename', function(basename, language) {
    var _basename = this.basename || basename;
    var _language = this.language || language;

    return _basename.replace(new RegExp('-'+_language+'$', 'gi'), '');
  });

  Handlebars.registerHelper('translated_path_key', function() {
    var original_basename = Handlebars.helpers.original_basename(this.basename, this.language);

    return original_basename + ".translated_path";
  });
};
