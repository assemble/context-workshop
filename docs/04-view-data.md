{%= apidocs('./examples/04-view-data/assemblefile.js') %}

To run this example:

```sh
$ assemble view-data
```

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
