/*!
 * context-workshop (https://github.com/jonschlinkert/context-workshop)
 *
 * Copyright (c) 2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var debug = require('debug')('context-workshop');

module.exports = function(config) {
  return function(app) {
    if (this.isRegistered('context-workshop')) return;
    debug('initializing "%s", from "%s"', __filename, module.parent.id);

    this.define('workshop', function() {
      debug('running workshop');
      
    });
  };
};
