'use strict';

require('mocha');
var assert = require('assert');
var workshop = require('./');

describe('context-workshop', function() {
  it('should export a function', function() {
    assert.equal(typeof workshop, 'function');
  });

  it('should export an object', function() {
    assert(workshop);
    assert.equal(typeof workshop, 'object');
  });

  it('should throw an error when invalid args are passed', function(cb) {
    try {
      workshop();
      cb(new Error('expected an error'));
    } catch (err) {
      assert(err);
      assert.equal(err.message, 'expected first argument to be a string');
      assert.equal(err.message, 'expected callback to be a function');
      cb();
    }
  });
});
