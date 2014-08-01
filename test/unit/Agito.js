'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
chai.use(require('sinon-chai'));

var AgitoMock = require('./mocks/Agito');

/**
 * Create a spy middleware.
 */
function createMiddleware() {
  return sinon.spy(function middleware(agito, done) { return done(); });
}

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

  describe('#use()', function() {

    var agito;
    var use = Agito.prototype.use;

    beforeEach(function() {
      agito = AgitoMock.create();
    });

    /*
     */
    it('should be a function', function() {
      expect(use).to.be.a('function');
    });

    /*
     */
    it('should register a new middleware', function() {
      var middleware = function() {};
      use.call(agito, middleware);

      expect(agito._middlewares).to.be.an.instanceOf(Array);
      expect(agito._middlewares).to.have.length(1);
      expect(agito._middlewares).to.include(middleware);
    });

    /*
     */
    it('should support several consecutive calls', function() {
      var ret = use.call(
        use.call(agito, function middlewareA() {}),
        function middlewareB() {}
      );

      expect(ret).to.deep.equal(agito);
      expect(ret._middlewares).to.have.length(2);
    });

    /*
     */
    it('should throw if the middleware attribute is not an array or undefined', function() { // jshint ignore:line
      agito._middlewares = null;

      expect(function() {
        agito.use();
      }).to.throw();
    });

  });

  describe('#run()', function() {

    var agito;
    var run = Agito.prototype.run;

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

    /*
     */
    it('should throw if one middleware returns an error', function() {
      agito._middlewares.push(function(agito, done) { return done('Error'); });

      expect(function() {
        run.call(agito);
      }).to.throw();
    });

  });

});
