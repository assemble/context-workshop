'use strict';

var fs = require('fs');
var examples = fs.readdirSync('examples');

var assemble = require('assemble');
var questions = require('base-questions');
var app = assemble();
app.use(questions());

/**
 * Register each example as a task to make it available to run from the root.
 */

examples.forEach(function(example) {
  app.task(example, {silent: true}, function(cb) {
    var exampleApp = require('./examples/' + example + '/assemblefile.js');
    exampleApp.build('default', cb);
  });
  app.task(example.slice(3), {silent: true}, [example]);
});

/**
 * List each example that available to run
 */

app.task('default', {silent: true}, function(cb) {
  if (app.option('i')) {
    app.choices('choose-example', 'Choose an example to run:', examples.map(function(example) {
      return example.slice(3);
    }));

    app.ask('choose-example', {save: false}, function(err, answers) {
      if (err) return cb(err);
      var tasks = arrayify(answers && answers['choose-example']);
      if(tasks.length === 0) {
        return cb();
      }
      app.build(tasks, cb);
    });
    return;
  }

  console.log(`
  Specify an example to run:

    $ assemble <example>

  Available examples:

    ${examples.map(function(example) {
      return `$ assemble ${example.slice(3)}`;
    }).join('\n    ')}

  Interactively choose an example to run with \`-i\`:

    $ assemble -i

  `);
  cb();
});

function arrayify(val) {
  return val ? (Array.isArray(val) ? val : [val]) : [];
}

module.exports = app;
