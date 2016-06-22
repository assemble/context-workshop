'use strict';

var assemble = require('assemble');
var utils = require('log-utils');
var app = assemble();

/**
 * View data is the data object that is on view objects that will be used to override `app.cache.data`.
 * The following example will show how the view data will override data from `app.cache.data` and "render locals" when the context is created.
 *
 * To run this example:
 *
 * ```sh
 * $ assemble view-data
 * ```
 *
 * @name view-data
 * @api public
 */

app.task('view-data', function(cb) {
  console.log();
  console.log();
  app.engine('txt', require('engine-base'));
  app.option('engine', 'txt');

  app.create('partials');
  app.create('pages');

  /**
   * Add "global" data to `app.cache.data` through the `app.data` method.
   * This will be overridden by the render locals and view data when the page is rendered.
   *
   * ```js
   * app.data({title: 'Site Title'});
   * ```
   * @api public
   * @name add-app-cache-data
   */

  app.data({title: utils.cyan('Site Title')});

  /**
   * Add a "button" partial with view locals data and view data.
   * The view data will override `app.cache.data`, "render locals", and "view locals".
   *
   * ```js
   * app.partial('button', {
   *   content: 'button: <%= title %>',
   *   locals: 'Button Locals Title',
   *   data: 'Button Data Title'
   * });
   * ```
   * @api public
   * @name add-data-button-partial
   */

  app.partial('button', {
    content: 'button: <%= title %>',
    locals: {title: utils.blue('Button Locals Title')},
    data: {title: utils.green('Button Data Title')}
  });

  /**
   * Add a "home" page with view locals data and view data that includes the 3 "button" partials.
   * @api public
   * @name add-data-home-page
   */

  app.page('home', {
    content: [
      'title: <%= title %>',
      'one:   <%= partial("button") %>',
      'two:   <%= partial("button") %>',
      'three: <%= partial("button") %>'
    ].join('\n'),
    locals: {title: utils.blue('Page Locals Title')},
    data: {title: utils.green('Page Data Title')}
  });

  var home = app.pages.getView('home');
  console.log('Rendering "home" page with default `app.cache.data`.\nView data will override `app.cache.data`:\n');
  /**
   * Render the "home" page using all the defaults.
   * This will show that the `title` property from the view data is used throughout the "home" page and all the "button" partials.
   * @api public
   * @name render-data-home-page-with-default-data
   */

  home.render(function(err, res) {
    if (err) {
      console.log(err, '\n\n');
      return cb();
    }
    console.log(res.content, '\n\n');

    console.log('Rendering "home" page with "render locals" that will override data from `app.cache.data`\nView data will override "render locals":\n');
    /**
     * Render the "home" page using render locals.
     * This will show that the `title` property from the view data is in the "home" page and the "button" partials will use their own view data.
     * @api public
     * @name render-data-home-page-with-render-locals
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

app.task('default', ['view-data']);

module.exports = app;
