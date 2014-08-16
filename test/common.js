'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

chai.use(sinonChai);

/**
 * Catch any exception launched by the given function.
 *
 * @param {Function} thrower - The function to mute
 */
function swallow(thrower) {
  try {
    thrower();
  } catch (e) {}
}

global.expect = chai.expect;
global.sinon = sinon;
global.swallow = swallow;
