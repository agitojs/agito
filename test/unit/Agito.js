'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
chai.use(require('sinon-chai'));

describe('Agito', function() {

  var Agito = require('../../lib/Agito');
  var agito;

  beforeEach(function() {
    agito = new Agito();
  });

  /*
   */
  it('should be a function', function() {
    expect(Agito).to.be.a('function');
  });

  /*
   */
  it('should create an object using the \'new\' operator', function() {
    expect(agito).to.be.an.instanceOf(Agito);
  });

  /*
   */
  it('should create an object even without using the \'new\' operator', function() { // jshint ignore:line
    agito = Agito(); // jshint ignore:line

    expect(agito).to.be.an.instanceOf(Agito);
  });

  /*
   */
  it('should expose a `protocol` array', function() {
    expect(agito).to.have.property('protocols');
    expect(agito.protocols).to.be.an.instanceOf(Array);
    expect(agito.protocols).to.be.empty; // jshint ignore:line
  });

  it('should expose a `redirection` array', function() {
    expect(agito).to.have.property('redirections');
    expect(agito.redirections).to.be.an.instanceOf(Array);
    expect(agito.redirections).to.be.empty; // jshint ignore:line
  });

  /*
   */
  it('should expose a `use` method', function() {
    expect(agito).to.respondTo('use');
  });

  /*
   */
  it('should expose a `run` method', function() {
    expect(agito).to.respondTo('run');
  });

  describe('#run()', function() {

    /*
     */
    it('should throw if no middlewares have been registered', function() {
      expect(function() {
        agito.run();
      }).to.throw();
    });

    /*
     */
    it('should call every registered middleware once', function() {
      var middleware = sinon.spy(function(agito, done) { return done(); });
      agito
        .use(middleware)
        .run()
      ;

      expect(middleware).to.have.been.calledOn(agito);
      expect(middleware).to.have.been.calledWith(agito);
    });

    /*
     */
    it('should return null to avoid accidental chaining', function() {
      var ret = agito
        .use(function(agito, done) { return done(); })
        .run()
      ;

      expect(ret).to.be.null; // jshint ignore:line
    });

    /*
     */
    it('should throw if one middleware returns an error', function() {
      agito.use(function(agito, done) { return done('Error'); });

      expect(function() {
        agito.run();
      }).to.throw();
    });

  });

});
