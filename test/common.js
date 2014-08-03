'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

chai.use(sinonChai);

function swallow(thrower) {
  try {
    thrower();
  } catch (e) {}
}

global.expect = chai.expect;
global.sinon = sinon;
global.swallow = swallow;
