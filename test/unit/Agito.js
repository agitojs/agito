'use strict';

var expect = require('chai').expect;

describe('Agito', function() {

  var Agito = require('../../lib/Agito');

  /*
   */
  it('should be a function', function() {
    expect(Agito).to.be.a('function');
  });

  /*
   */
  it('should create an object using the "new" operator', function() {
    var agito = new Agito();

    expect(agito).to.be.an.instanceOf(Agito);
  });

  /*
   */
  it('should create an object even without the "new" operator', function() {
    var agito = Agito(); // jshint ignore:line

    expect(agito).to.be.an.instanceOf(Agito);
  });

  /*
   */
  it('should expose a middleware container (privately)', function() {
    var agito = new Agito();

    expect(agito).to.have.property('_middlewares');
    expect(agito._middlewares).to.be.an.instanceOf(Array);
    expect(agito._middlewares).to.be.empty; // jshint ignore:line
  });

  /*
   */
  it('should expose a protocol container (publicly)', function() {
    var agito = new Agito();

    expect(agito).to.have.property('protocols');
    expect(agito.protocols).to.be.an.instanceOf(Array);
    expect(agito.protocols).to.be.empty; // jshint ignore:line
  });

  it('should expose a redirection container (publicly)', function() {
    var agito = new Agito();

    expect(agito).to.have.property('redirections');
    expect(agito.redirections).to.be.an.instanceOf(Array);
    expect(agito.redirections).to.be.empty; // jshint ignore:line
  });

  /*
   */
  it('should expose the "use" method', function() {
    var agito = new Agito();

    expect(agito).to.respondTo('use');
  });

  /*
   */
  it('should expose the "run" method', function() {
    var agito = new Agito();

    expect(agito).to.respondTo('run');
  });

});