'use strict';

var proxyquire = require('proxyquire');

describe('Agito', function() {

  var Agito = require('../../lib/Agito');
  var agito;

  beforeEach(function() {
    agito = new Agito();
  });

  it('should create an object when using the \'new\' operator', function() {
    expect(agito).to.be.an.instanceOf(Agito);
  });

  it('should create an object even without using the \'new\' operator', function() {
    agito = Agito(); // jshint ignore:line

    expect(agito).to.be.an.instanceOf(Agito);
  });

  it('should expose a `use` method', function() {
    expect(agito).to.respondTo('use');
  });

  it('should expose a `run` method', function() {
    expect(agito).to.respondTo('run');
  });

  describe('#run()', function() {

    it('should throw if no middlewares have been registered', function() {
      expect(function() {
        agito.run();
      }).to.throw(Error, 'No middlewares were registered');
    });

    it('should call every registered middleware once', function() {
      var middleware = sinon.spy(function() { return this.done(); });
      agito
        .use(middleware)
        .run()
      ;

      expect(middleware).to.have.been.calledOnce; // jshint ignore:line
      var call = middleware.getCall(0);
      expect(Object.keys(call.thisValue)).to.have.length(4);
      expect(call.thisValue.protocols).to.deep.equal([]);
      expect(call.thisValue.triggers).to.deep.equal([]);
      expect(call.thisValue.actions).to.deep.equal([]);
      expect(call.thisValue.done).to.be.a('function');
      expect(call.args).to.have.length(Object.keys(call.thisValue).length);
      expect(call.args[0]).to.deep.equal(call.thisValue.protocols);
      expect(call.args[1]).to.deep.equal(call.thisValue.triggers);
      expect(call.args[2]).to.deep.equal(call.thisValue.actions);
      expect(call.args[3]).to.deep.equal(call.thisValue.done);
    });

    it('should return an Agito instance', function() {
      var ret = agito
        .use(function() { return this.done(); })
        .run()
      ;

      expect(ret).to.be.null; // jshint ignore:line
    });

    it('should throw if one middleware returns an error', function() {
      agito.use(function() { return this.done('Middleware error'); });

      expect(function() {
        agito.run();
      }).to.throw(Error, 'Middleware error');
    });

    it('should run one listener per port', function() {
      var ListenerSpy = function() {};
      ListenerSpy.prototype.start = sinon.spy();
      var Agito = proxyquire('../../lib/Agito', { // expected shadowing
        './Listener': ListenerSpy
      });

      var triggers = [
        { pattern: 'http://example.com:80' },
        { pattern: 'http://example.com:81' },
        { pattern: 'http://example.com:82' }
      ];
      (new Agito())
        .use(function() {
          Array.prototype.push.apply(this.triggers, triggers);
          this.done();
        })
        .run()
      ;

      expect(ListenerSpy.prototype.start).to.have.callCount(triggers.length);
    });

  });

});
