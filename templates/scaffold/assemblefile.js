'use strict';

var assemble = require('assemble');
var app = assemble();

/**
 * [Add example docs here]
 *
 * To run this example:
 *
 * ```sh
 * $ assemble <%= name %>
 * ```
 *
 * @name <%= name %>
 * @api public
 */

app.task('<%= name %>', function(cb) {
  console.log('Running', this.name);
  cb();
});

app.task('default', ['<%= name %>']);

module.exports = app;
