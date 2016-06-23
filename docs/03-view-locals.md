{%= apidocs('./examples/03-view-locals/assemblefile.js') %}

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
