# context-workshop [![NPM version](https://img.shields.io/npm/v/context-workshop.svg?style=flat)](https://www.npmjs.com/package/context-workshop) [![NPM downloads](https://img.shields.io/npm/dm/context-workshop.svg?style=flat)](https://npmjs.org/package/context-workshop) [![Build Status](https://img.shields.io/travis/jonschlinkert/context-workshop.svg?style=flat)](https://travis-ci.org/jonschlinkert/context-workshop)

One of assemble's biggest strengths is granular control over `context`. This workshop explains how context is created, as well as where, when and why the context works the way it does at each point in the render cycle.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install context-workshop --save
```

## What is context?

Context is an object that is created in-memory for rendering templates. Context is created by merging objects in the order [specified below](#how-are-the-objects-merged). The context merging presidence is [customizable](#customizing-context) by the user.

***

## What objects are used to create the context?

* `app.cache.data` (from `app.data()`)
  - main data object that is useful for "global" data.
  - usually includes properties like `site` (this is controlled by the user)

* `view.locals`
  - individual view "local" data
  - overrides `app.cache.data` at the individual view level
  - added through middleware or when creating a view with `views.addView()`

* `view.data` (front-matter)
  - individual view data object
  - overrides `app.cache.data` and `view.locals`
  - may be specified as view "front-matter" that is parsed in `onLoad` middleware
  - usually includes properties like `title` and `layout` to override "global" data at the view (page) level

* `render` locals
  - local data object specified when calling the `.render()` method.
  - useful for specifying data that may not exist on `view.locals` or `view.data`

* `helper` locals
  - local data object specified when calling a view helper in another template
  - works with the built-in "singular" view helper (e.g. `{{partial "foo" locals}}`)
  - will override all other data.

***

## How are the objects merged?

There is a default order of operations when it comes to merging the data context. The order is [customizable](#customizing-context) by the user.

* `app.cache.data`
* `view.locals`
* `render.locals`
* `view.data`
* `helper-locals`

The context is created by merging the objects in the specified order through the various methods discribed in [Customizing context](#customizing-context):

```js
// merges the view context first
// e.g.: `merge(view.locals, locals, view.data)`
var context = view.context(locals);

// merges the `app.cache.data`
context = merge({}, app.cache.data, context);
```

In addition to the main context, helpers may use the `this.ctx()` method to merge in helper locals that are passed.
The built-in singular helpers like `{{partial}}` use this method to ensure helper locals are used.

```handlebars
{{partial "button" locals}}
```

This will result in the `locals` object being merged onto the context when rendering the "button" partial.
The default behaviour for merging the helper context is:

```js
// merge the current "view" front-matter with current context built above
context = merge({}, context, page.data);
// merge in the partial locals and front-matter
context = merge({}, context, button.locals, button.data);
// merge in helper locals and options.hash
context = merge({}, context, locals, options.hash);
```

***

## Customizing context

Customize how the context object is created.

* `view.context`
  - method that takes optional `locals` object
  - merges data by doing `return merge(view.locals, locals, view.data)`
  - may override directly to change the behaviour

* `app.context`
  - method that takes `view` and optional `locals` object
  - calls the `view.context` before merging data
  - merges data by doing `return merge({}, this.cache.data, view.context(locals))`

* `options.context`: Customize how the context object is created.
  - may override functionality through the `context` option:

```js
app.option('context', function(view, locals) {
  // this is the app
  return merge({}, this.cache.data, view.context(), locals);
});
```

* `options.helperContext`: Custom how the helper context is created.
  - may override the functionality used in the `this.ctx()` method in helpers through the `helperContext` option:

```js
app.option('helperContext', function(view, locals, options) {
  return merge({}, view.context(), locals);
});
```

## Examples

### Installing

Clone this project and install the npm modules to run the examples:

```sh
# clone the project
$ git clone https://github.com/assemble/context-workshop
# cd into the folder
$ cd context-workshop
# install npm modules
$ npm install
# install assemble globally if not already installed
$ npm install --global assemble
```

### Running

Each example may be run by using `assemble`:

```sh
$ assemble <example>
```

To view a list of examples run the default assemble command:

```sh
$ assemble
```

To interactively choose an example to run use the `-i` option:

```sh
$ assemble -i
```

### [app-cache-data](examples/01-app-cache-data/assemblefile.js#L15)

Assemble will use `app.cache.data` when rendering views (pages).
To add data to `app.cache.data` use the `app.data()` api. See [base-data](https://github.com/node-base/base-data) for all the available options for `app.data()`.

To run this example:

```sh
$ assemble app-cache-data
```

![image](https://cloud.githubusercontent.com/assets/995160/16308022/6e9e6ef0-3931-11e6-82d2-a595b0f798fc.png)

Code snippet from example [assemblefile.js](./examples/01-app-cache-data/assemblefile.js)

```js
// add app-cache-data
app.data({title: 'Site Title'});

// create a simple "button" partial
app.partial('button', {content: 'button: <%= title %>'});

// create a simple "home" page containing 3 "button" partials
app.page('home', {
  content: [
    'title: <%= title %>',
    'one:   <%= partial("button") %>',
    'two:   <%= partial("button") %>',
    'three: <%= partial("button") %>'
  ].join('\n')
});

// render the "home" page with no additional data
var home = app.pages.getView('home');
home.render(function(err, res) {
  if (err) return console.error(err);
  console.log(res.content);
});
```

### [render-locals](examples/02-render-locals/assemblefile.js#L15)

Render locals is the data object that is passed into the `.render()` method when rendering views.
The following example will show how the render locals will override data from `app.cache.data` when the context is created.

To run this example:

```sh
$ assemble render-locals
```

![image](https://cloud.githubusercontent.com/assets/995160/16308107/b3287bce-3931-11e6-8c56-2676d4515c24.png)

Code snippet from example [assemblefile.js](./examples/02-render-locals/assemblefile.js)

```js
// add app-cache-data
app.data({title: 'Site Title'});

// create a simple "button" partial
app.partial('button', {content: 'button: <%= title %>'});

// create a simple "home" page containing 3 "button" partials
app.page('home', {
  content: [
    'title: <%= title %>',
    'one:   <%= partial("button") %>',
    'two:   <%= partial("button") %>',
    'three: <%= partial("button") %>'
  ].join('\n')
});

// render the "home" page with no additional data
var home = app.pages.getView('home');
home.render(function(err, res) {
  if (err) return console.log(err);
  console.log(res.content);

  home.render({title: 'Render Locals Title'}, function(err, res) {
    if (err) return console.log(err);
    console.log(res.content);
  });
});
```

### [view-locals](examples/03-view-locals/assemblefile.js#L15)

View locals is the data object that is on view objects that will be used to override `app.cache.data`.
The following example will show how the view locals will override data from `app.cache.data`, but is overridden by "render locals" when the context is created.

To run this example:

```sh
$ assemble view-locals
```

![image](https://cloud.githubusercontent.com/assets/995160/16308141/cf0ef08e-3931-11e6-9bbf-008ad3efcbc8.png)

Code snippet from example [assemblefile.js](./examples/03-view-locals/assemblefile.js)

```js
// add app-cache-data
app.data({title: 'Site Title'});

// Add a "button" partial with view locals data.
// This data is only overridden by "render locals" if the button is rendered directly with `.render` and "render locals" are passed into `.render`.

app.partial('button', {
  content: 'button: <%= title %>',
  locals: {title: 'Button Locals Title'}
});

// Add a "home" page with view locals data that includes the 3 "button" partials.
app.page('home', {
  content: [
    'title: <%= title %>',
    'one:   <%= partial("button") %>',
    'two:   <%= partial("button") %>',
    'three: <%= partial("button") %>'
  ].join('\n'),
  locals: {title: 'Page Locals Title'}
});

var home = app.pages.getView('home');
home.render(function(err, res) {
  if (err) return console.error(err);
  console.log(res.content);

  home.render({title: 'Render Locals Title'}, function(err, res) {
    if (err) return console.error(err);
    console.log(res.content);
  });
});
```

### [view-data](examples/04-view-data/assemblefile.js#L15)

View data is the data object that is on view objects that will be used to override `app.cache.data`.
The following example will show how the view data will override data from `app.cache.data` and "render locals" when the context is created.

To run this example:

```sh
$ assemble view-data
```

![image](https://cloud.githubusercontent.com/assets/995160/16308172/eac00a7a-3931-11e6-8006-152eb63185a3.png)

Code snippet from example [assemblefile.js](./examples/04-view-data/assemblefile.js)

```js
// add app-cache-data
app.data({title: 'Site Title'});

// Add a "button" partial with view locals data and view data.
// The view data will override `app.cache.data`, "render locals", and "view locals".
app.partial('button', {
  content: 'button: <%= title %>',
  locals: {title: 'Button Locals Title'},
  data: {title: 'Button Data Title'}
});

// Add a "home" page with view locals data and view data that includes the 3 "button" partials.
app.page('home', {
  content: [
    'title: <%= title %>',
    'one:   <%= partial("button") %>',
    'two:   <%= partial("button") %>',
    'three: <%= partial("button") %>'
  ].join('\n'),
  locals: {title: 'Page Locals Title'},
  data: {title: 'Page Data Title'}
});

var home = app.pages.getView('home');
home.render(function(err, res) {
  if (err) return console.error(err);
  console.log(res.content);

  home.render({title: 'Render Locals Title'}, function(err, res) {
    if (err) return console.error(err);
    console.log(res.content);
  });
});
```

### [helper-locals](examples/05-helper-locals/assemblefile.js#L15)

Helper locals is the data object that is passed into the built-in view helpers. This data will override all other data for that specific view.
The following example will show how the helper locals will override all other data when rendering a partial view.

To run this example:

```sh
$ assemble helper-locals
```

![image](https://cloud.githubusercontent.com/assets/995160/16308201/0bf8ee1e-3932-11e6-81e8-9eae38234e95.png)

Code snippet from example [assemblefile.js](./examples/05-helper-locals/assemblefile.js)

```js
// add app-cache-data
app.data({title: utils.cyan('Site Title')});

// Add a "button" partial with view locals data and view data.
// The view data will override `app.cache.data`, "render locals", and "view locals".
// When "helper locals" is passed to the "partial" helper, all data on the view will be overridden.
app.partial('button', {
  content: 'button: <%= title %>',
  locals: {title: 'Button Locals Title'},
  data: {title: 'Button Data Title'}
});

// Add a "home" page with view locals data and view data that includes the 3 "button" partials.
// Button "one" will be rendered without passing any helper locals.
// Button "two" will be rendered with the "home" page's data passed as the helper locals.
// Button "three" will be rendered with a "custom" property from the "render locals" passed as the helper locals.
app.page('home', {
  content: [
    'title: <%= title %>',
    'one:   <%= partial("button") %>',
    'two:   <%= partial("button", obj) %>', // "obj" is the built-in global object from engine-base
    `three: <%= partial("button", {title: 'Helper Locals Title'}) %>`
  ].join('\n'),
  locals: {title: 'Page Locals Title'},
  data: {title: 'Page Data Title'}
});

var home = app.pages.getView('home');
home.render(function(err, res) {
  if (err) return console.error(err);
  console.log(res.content);

  home.render({title: 'Render Locals Title'}, function(err, res) {
    if (err) return console.error(err);
    console.log(res.content);
  });
});
```

### [customizing](examples/06-customizing/assemblefile.js#L15)

Context is customizable by adding optional functions to the `app.options` object.
This examples shows the ways to customize the context.

To run this example:

```sh
$ assemble customizing
```

![image](https://cloud.githubusercontent.com/assets/995160/16308576/88c480b0-3933-11e6-8873-2e40ddaefaf5.png)

Code snippet from example [assemblefile.js](./examples/06-customizing/assemblefile.js)

```js
// Add a context option
app.option('context', function(view, locals) {
  // override all the other data with the "render locals"
  return extend({}, this.cache.data, view.context(), locals);
});

// add app-cache-data
app.data({title: 'Site Title'});

// create a simple "button" partial
app.partial('button', {content: 'button: {{ title }}'});

// create a simple "home" page containing 3 "button" partials
app.page('home', {
  content: [
    'title: {{ title }}',
    'one:   {{ partial("button") }}',
    'two:   {{ partial("button") }}',
    'three: {{ partial("button") }}'
  ].join('\n')
});

// render the "home" page with no additional data
var home = app.pages.getView('home');
home.render(function(err, res) {
  if (err) return console.error(err);
  console.log(res.content);
});
```

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/jonschlinkert/context-workshop/issues/new).

## Building docs

Generate readme and API documentation with [verb](https://github.com/verbose/verb):

```sh
$ npm install verb && npm run docs
```

Or, if [verb](https://github.com/verbose/verb) is installed globally:

```sh
$ verb
```

## Running tests

Install dev dependencies:

```sh
$ npm install -d && npm test
```

## Author

**Jon Schlinkert**

* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License

Copyright © 2016, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT license](https://github.com/jonschlinkert/context-workshop/blob/master/LICENSE).

***

_This file was generated by [verb](https://github.com/verbose/verb), v0.9.0, on June 23, 2016._