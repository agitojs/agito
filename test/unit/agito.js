'use strict';

var expect = require('chai').expect;

describe('Agito', function() {

  var Agito = require('../../lib');

  it('should be a function', function() {
    expect(Agito).to.be.a('function');
  });

  it('should be a new-able', function() {
    new Agito(); // jshint ignore:line
  });

});
