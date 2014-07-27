'use strict';

var expect = require('chai').expect;

describe('Agito', function() {

  var Agito = require('../../lib/Agito');

  it('should be a function', function() {
    expect(Agito).to.be.a('function');
  });

  it('should be a new-able', function() {
    new Agito(); // jshint ignore:line
  });

  it('should expose an object with its public properties', function() {
    var agito = new Agito();
    expect(agito).to.be.an('object');
  });

  it('should expose the "use" method', function() {
    var agito = new Agito();
    expect(agito).to.respondTo('use');
  });

});
