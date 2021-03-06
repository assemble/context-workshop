{%= apidocs('./examples/02-render-locals/assemblefile.js') %}

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
