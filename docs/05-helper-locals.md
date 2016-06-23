{%= apidocs('./examples/05-helper-locals/assemblefile.js') %}

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
