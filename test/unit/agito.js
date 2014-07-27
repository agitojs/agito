'use strict';

var expect = require('chai').expect;

describe('Agito', function() {

  var Agito = require('../../lib/Agito');

  it('should be a function', function() {
    expect(Agito).to.be.a('function');
  });

  it('should create an object using the "new" operator', function() {
    var agito = new Agito();
    expect(agito).to.be.an.instanceOf(Agito);
  });

  it('should create an object even without the "new" operator', function() {
    var agito = Agito(); // jshint ignore:line
    expect(agito).to.be.an.instanceOf(Agito);
  });

  it('should expose the "use" method', function() {
    var agito = new Agito();
    expect(agito).to.respondTo('use');
  });

});
