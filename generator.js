'use strict';
var path = require('path');

module.exports = function(app) {
  app.task('example', function(cb) {
    app.engine('*', require('engine-base'));
    app.question('name', 'What is the name of the example?');
    app.ask('name', {save: false}, function(err, answers) {
      if (err) return cb(err);
      if (answers && answers.name) {
        var dest = app.option('dest') || path.join('examples', answers.name);
        app.src(['templates/scaffold/**/*'])
          .pipe(app.renderFile('*', {name: answers.name}))
          .pipe(app.conflicts(dest))
          .pipe(app.dest(dest))
          .once('error', cb)
          .once('end', cb);
        return;
      }
      cb(new Error('Expected a name for the example'));
    });
  });
}
