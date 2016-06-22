'use strict';

var assemble = require('assemble');
var utils = require('log-utils');
var app = assemble();

/**
 * View locals is the data object that is on view objects that will be used to override `app.cache.data`.
 * The following example will show how the view locals will override data from `app.cache.data`, but is overriden by "render locals" when the context is created.
 *
 * @name view-locals
 * @api public
 */

app.task('view-locals', function(cb) {
  console.log();
  console.log();
  app.engine('txt', require('engine-base'));
  app.option('engine', 'txt');

  app.create('partials');
  app.create('pages');

  /**
   * Add "global" data to `app.cache.data` through the `app.data` method.
   * This will be overridden by the render and view locals when the page is rendered.
   */

  app.data({title: utils.cyan('Site Title')});

  /**
   * Add a "button" partial with view locals data.
   * This data is only overriden by "render locals" if the button is rendered directly with `.render` and "render locals" are passed into `.render`.
   */

  app.partial('button', {
    content: 'button: <%= title %>',
    locals: {title: utils.blue('Button Locals Title')}
  });

  /**
   * Add a "home" page with view locals data that includes the 3 "button" partials.
   */

  app.page('home', {
    content: [
      'title: <%= title %>',
      'one:   <%= partial("button") %>',
      'two:   <%= partial("button") %>',
      'three: <%= partial("button") %>'
    ].join('\n'),
    locals: {title: utils.blue('Page Locals Title')}
  });

  var home = app.pages.getView('home');
  console.log('Rendering "home" page with default `app.cache.data`.\nView locals will override `app.cache.data`:\n');

  /**
   * Render the "home" page using all the defaults.
   * This will show that the `title` property from the view locals is used throughout the "home" page and all the "button" partials.
   */

  home.render(function(err, res) {
    if (err) {
      console.log(err, '\n\n');
      return cb();
    }
    console.log(res.content, '\n\n');

    console.log('Rendering "home" page with "render locals" that will override data from `app.cache.data`\nView locals will override "render locals":\n');

    /**
     * Render the "home" page using render locals.
     * This will show that the `title` property from the render locals is in the "home" page, but the "view locals" is used in all of the "button" partials.
     */

    home.render({title: utils.yellow('Render Locals Title')}, function(err, res) {
      if (err) {
        console.log(err, '\n\n');
        return cb();
      }
      console.log(res.content, '\n\n');
      cb();
    });
  });
});

app.task('default', ['view-locals']);

module.exports = app;
