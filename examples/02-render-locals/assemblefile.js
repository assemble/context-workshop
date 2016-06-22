'use strict';

var assemble = require('assemble');
var utils = require('log-utils');
var app = assemble();

/**
 * Render locals is the data object that is passed into the `.render()` method when rendering views.
 * The following example will show how the render locals will override data from `app.cache.data` when the context is created.
 *
 * @name render-locals
 * @api public
 */

app.task('render-locals', function(cb) {
  console.log();
  console.log();
  app.engine('txt', require('engine-base'));
  app.option('engine', 'txt');

  app.create('partials');
  app.create('pages');

  /**
   * Add "global" data to `app.cache.data` through the `app.data` method.
   * This will be overridden by the render locals when the page is rendered.
   */

  app.data({title: utils.cyan('Site Title')});

  /**
   * Add a simple "button" partial with no other data.
   */

  app.partial('button', {content: 'button: <%= title %>'});

  /**
   * Add a simple "home" page with no other data that includes the 3 "button" partials.
   */

  app.page('home', {
    content: [
      'title: <%= title %>',
      'one:   <%= partial("button") %>',
      'two:   <%= partial("button") %>',
      'three: <%= partial("button") %>'
    ].join('\n')
  });

  var home = app.pages.getView('home');
  console.log('Rendering "home" page with default `app.cache.data`:\n');

  /**
   * Render the "home" page using all the defaults.
   * This will show that the `title` property from `app.cache.data` is used throughout the "home" page and all the "button" partials.
   */

  home.render(function(err, res) {
    if (err) {
      console.log(err, '\n\n');
      return cb();
    }
    console.log(res.content, '\n\n');

    console.log('Rendering "home" page with "render locals" that will override data from `app.cache.data`:\n');

    /**
     * Render the "home" page using render locals.
     * This will show that the `title` property from `app.cache.data` is used throughout the "home" page and all the "button" partials.
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

app.task('default', ['render-locals']);

module.exports = app;
