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
  it('should create an object even without using the \'new\' operator', function() {
    agito = Agito(); // jshint ignore:line

    expect(agito).to.be.an.instanceOf(Agito);
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
      }).to.throw(Error, 'No middlewares were registered');
    });

    /*
     */
    it('should call every registered middleware once', function() {
      var middleware = sinon.spy(function() { return this.done(); });
      agito
        .use(middleware)
        .run()
      ;

      expect(middleware).to.have.been.calledOnce; // jshint ignore:line
      var call = middleware.getCall(0);
      expect(Object.keys(call.thisValue)).to.have.length(3);
      expect(call.thisValue.protocols).to.deep.equal([]);
      expect(call.thisValue.redirections).to.deep.equal([]);
      expect(call.thisValue.done).to.be.a('function');
      expect(call.args).to.have.length(Object.keys(call.thisValue).length);
      expect(call.args[0]).to.deep.equal(call.thisValue.protocols);
      expect(call.args[1]).to.deep.equal(call.thisValue.redirections);
      expect(call.args[2]).to.deep.equal(call.thisValue.done);
    });

    /*
     */
    it('should return null to avoid accidental chaining', function() {
      var ret = agito
        .use(function() { return this.done(); })
        .run()
      ;

      expect(ret).to.be.null; // jshint ignore:line
    });

    /*
     */
    it('should throw if one middleware returns an error', function() {
      agito.use(function() { return this.done('Middleware error'); });

      expect(function() {
        agito.run();
      }).to.throw(Error, 'Middleware error');
    });

  });

});
