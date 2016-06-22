'use strict';

var fs = require('fs');
var examples = fs.readdirSync('examples');

var assemble = require('assemble');
var app = assemble();

/**
 * Register each example as a task to make it available to run from the root.
 */

examples.forEach(function(example) {
  app.task(example, {silent: true}, function(cb) {
    var exampleApp = require('./examples/' + example + '/assemblefile.js');
    exampleApp.build('default', cb);
  });
});

/**
 * List each example that available to run
 */

app.task('default', {silent: true}, function(cb) {
  console.log(`
  Specify an example to run:

    $ assemble <example>

  Available examples:

    ${examples.map(function(example) {
      return `$ assemble ${example}`;
    }).join('\n    ')}
  `);
  cb();
});

module.exports = app;
