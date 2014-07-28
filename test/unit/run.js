'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
chai.use(require('sinon-chai'));

/**
 * Stub a spy middleware.
 */
function createMiddleware() {
  return sinon.spy(function middleware(agito, done) { return done(); });
}

describe('Agito#run()', function() {

  var run = require('../../lib/run');

  /*
   */
  it('should be a function', function() {
    expect(run).to.be.a('function');
  });

  /*
   */
  it('should throw if the middleware container is not an array', function() {
    expect(function() {
      run.call({ middlewares: {} });
    }).to.throw();
  });

  /*
   */
  it('should throw if no middlewares has been registered', function() {
    expect(function() {
      run.call({ middlewares: [] });
    }).to.throw();
  });

  /*
   */
  it('should call every registered middlewares once', function() {
    var agito = {
      middlewares: [1, 2, 3].map(function() { return createMiddleware(); })
    };
    run.call(agito);

    agito.middlewares.forEach(function(middleware) {
      expect(middleware).to.have.been.calledOn(agito);
      expect(middleware).to.have.been.calledWith(agito);
    });
  });

  /*
   */
  it('should return null to avoid accidental chaining', function() {
    var agito = { middlewares: [ createMiddleware() ] };
    var ret = run.call(agito);

    expect(ret).to.equal(null);
  });

});
