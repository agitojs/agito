'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
chai.use(require('sinon-chai'));

var AgitoMock = require('./mocks/Agito');

/**
 * Stub a spy middleware.
 */
function createMiddleware() {
  return sinon.spy(function middleware(agito, done) { return done(); });
}

describe('Agito#run()', function() {

  var agito;
  var run = require('../../lib/run');

  beforeEach(function() {
    agito = AgitoMock.create();
  });

  /*
   */
  it('should be a function', function() {
    expect(run).to.be.a('function');
  });

  /*
   */
  it('should throw if the middleware container is not an array', function() {
    agito._middlewares = null;

    expect(function() {
      run.call(agito);
    }).to.throw();
  });

  /*
   */
  it('should throw if no middlewares have been registered', function() {
    expect(function() {
      run.call(agito);
    }).to.throw();
  });

  /*
   */
  it('should call every registered middleware once', function() {
    agito._middlewares = [1, 2, 3].map(function() { return createMiddleware(); });
    run.call(agito);

    agito._middlewares.forEach(function(middleware) {
      expect(middleware).to.have.been.calledOn(agito);
      expect(middleware).to.have.been.calledWith(agito);
    });
  });

  /*
   */
  it('should return null to avoid accidental chaining', function() {
    agito._middlewares = [createMiddleware()];
    var ret = run.call(agito);

    expect(ret).to.equal(null);
  });

});
