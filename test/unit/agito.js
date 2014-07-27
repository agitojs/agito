'use strict';

var chai = require('chai');
var expect = chai.expect;

describe('agito', function() {

  var agito = require('../../lib/agito.js');

  it('should export an object', function() {
    expect(agito).to.be.an('object');
  });

});
