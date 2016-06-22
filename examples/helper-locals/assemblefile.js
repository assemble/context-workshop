'use strict';

var assemble = require('assemble');
var app = assemble();

/**
 * [Add example docs here]
 *
 * To run this example:
 *
 * ```sh
 * $ assemble helper-locals
 * ```
 *
 * @name helper-locals
 * @api public
 */

app.task('helper-locals', function(cb) {
  console.log();
  console.log();
  var extend = require('extend-shallow');
  app.engine('txt', require('engine-base'));
  app.option('engine', 'txt');

  app.create('partials');
  app.create('pages');

  /**
   * Data
   */

  app.data({title: 'Site Title'});

  /**
   * Custom `context` function
   */


  // app.option('context', function(view, locals) {
  //   return extend({}, this.cache.data, view.context(), locals);
  // });

  /**
   * Partial (view.locals, view.data)
   */

  app.partial('button', {
    content: 'button: <%= title %>',
    locals: {title: 'Button Locals Title'},
    data: {title: 'Button Data Title'}
  });

  /**
   * Page
   */

  app.page('home', {
    content: 'title: <%= title %>, \n one: <%= partial("button", obj) %>\n two:   <%= partial("button", {title: "Helper Locals Title"}) %>\n three: <%= partial("button") %>',
    locals: {title: 'Page Locals Title'},
    data: {title: 'Page Data Title'}
  });

  app.page('about', {
    content: 'title: <%= title %>, \n one: <%= partial("button", obj) %>\n two:   <%= partial("button", {title: "Helper Locals Title"}) %>\n three: <%= partial("button") %>'
  });

  /**
   * Render
   */

  app.pages.getView('about')
    .render({title: 'Render Locals Title'}, function(err, res) {
    // .render({title: 'Render Locals Title'}, function(err, res) {
      if (err) {
        console.log(err);
        console.log();
        console.log();
        cb();
        return;
      }
      console.log(res.content);
      console.log();
      console.log();
      cb();
    });

});

app.task('default', ['helper-locals']);

module.exports = app;
