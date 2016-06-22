{%= apidocs('./examples/06-customizing/assemblefile.js') %}

To run this example:

```sh
$ assemble customizing
```

Code snippet from example [assemblefile.js](./examples/06-customizing/assemblefile.js)

```js
// Add a context option
app.option('context', function(view, locals) {
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
