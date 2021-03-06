'use strict';

var assemble = require('assemble');
var utils = require('log-utils');
var app = assemble();

/**
 * Context is customizable by adding optional functions to the `app.options` object.
 * This examples shows the ways to customize the context.
 *
 * @name customizing
 * @api public
 */

app.task('customizing', function(cb) {
  console.log();
  console.log();
  var extend = require('extend-shallow');
  app.engine('txt', require('engine-base'));
  app.option('engine', 'txt');

  app.create('partials');
  app.create('pages');

  /**
   * Add a context option
   * This will override all the other data with the "render locals".
   */

  app.option('context', function(view, locals) {
    return extend({}, this.cache.data, view.context(), locals);
  });

  /**
   * Add "global" data to `app.cache.data` through the `app.data` method.
   * This will be overridden by the render locals and view data when the page is rendered.
   */

  app.data({title: utils.cyan('Site Title')});

  /**
   * Add a "button" partial with view locals data and view data.
   * Since we're using a custom context option, the "render locals" will override the view data.
   * When "helper locals" is passed to the "partial" helper, all data on the view will be overridden.
   */

  app.partial('button', {
    content: 'button: <%= title %>',
    locals: {title: utils.blue('Button Locals Title')},
    data: {title: utils.green('Button Data Title')}
  });

  /**
   * Add a "home" page with view locals data and view data that includes the 3 "button" partials.
   * Button "one" will be rendered without passing any helper locals.
   * Button "two" will be rendered with the "home" page's data passed as the helper locals.
   * Button "three" will be rendered with a "custom" property from the "render locals" passed as the helper locals.
   */

  app.page('home', {
    content: [
      'title: <%= title %>',
      'one:   <%= partial("button") %>',
      'two:   <%= partial("button", obj) %>', // "obj" is the built-in global object from engine-base
      `three: <%= partial("button", {title: '${utils.red('Helper Locals Title')}'}) %>`
    ].join('\n'),
    locals: {title: utils.blue('Page Locals Title')},
    data: {title: utils.cyan('Page Data Title')}
  });

  var home = app.pages.getView('home');
  console.log('Rendering "home" page with default `app.cache.data`.\nView data will override `app.cache.data`.\nHelper locals will override all other data:\n');

  /**
   * Render the "home" page using all the defaults.
   * This will show that the `title` property from the view data is used throughout the "home" page and the "button" partials without helper locals.
   */

  home.render(function(err, res) {
    if (err) {
      console.log(err, '\n\n');
      return cb();
    }
    console.log(res.content, '\n\n');

    console.log('Rendering "home" page with "render locals" that will override data from `app.cache.data`\n"Render locals" will override view data due to custom context option.\nHelper locals will override all other data:\n');

    /**
     * Render the "home" page using render locals.
     * This will show that the `title` property from the view data is in the "home" page and the "button" partials will use their own view data.
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

app.task('default', ['customizing']);

module.exports = app;
