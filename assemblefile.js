'use strict';

var assemble = require('assemble');
var app = assemble();

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


app.option('context', function(view, locals) {
  return extend({}, this.cache.data, view.context(), locals);
});

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

/**
 * Render
 */

app.pages.getView('home')
  .render({title: 'Render Locals Title'}, function(err, res) {
  // .render({title: 'Render Locals Title'}, function(err, res) {
    if (err) return console.log(err);
    console.log(res.content);
  });

