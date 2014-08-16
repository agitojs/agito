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

  it('should expose a `start` method', function() {
    expect(agito).to.respondTo('start');
  });

  describe('#start()', function() {

    it('should return null to avoid accidental chained calls', function() {
      var ret = agito
        .use(function() { return this.done(); })
        .start();

      expect(ret).to.be.null; // jshint ignore:line
    });

    it('should pass an error to the callback if now middlewares were registered', function(done) {
      agito.start(function(err) {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.message).to.equal('No middlewares were registered');
        done();
      });
    });

    it('should call every registered middleware once', function() {
      var middleware = sinon.spy(function() { return this.done(); });
      agito
        .use(middleware)
        .start();

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

    it('should forward every error middlewares could have emitted back to the callback', function(done) {
      agito.use(function() { return this.done('Middleware error'); });

      agito.start(function(err) {
        expect(err).to.equal('Middleware error');
        done();
      });
    });

    it('should start one proxy per protocol', function(done) {
      var protocol = {
        proxy: {
          start: sinon.spy(function() { return this.done(); })
        }
      };
      agito
        .use(function() {
          this.protocols.push(protocol);
          return this.done();
        })
        .start(function(err) {
          if (err) { return done(err); }

          expect(protocol.proxy.start).to.have.been.calledOnce; // jshint ignore:line
          var call = protocol.proxy.start.getCall(0);
          expect(Object.keys(call.thisValue)).to.have.length(3);
          expect(call.thisValue.triggers).to.deep.equal([]);
          expect(call.thisValue.actions).to.deep.equal([]);
          expect(call.thisValue.done).to.be.a('function');
          expect(call.args).to.have.length(Object.keys(call.thisValue).length);
          expect(call.args[0]).to.deep.equal(call.thisValue.triggers);
          expect(call.args[1]).to.deep.equal(call.thisValue.actions);
          expect(call.args[2]).to.deep.equal(call.thisValue.done);
          return done();
        });
    });

    it('should forward protocols\' proxies error to the callback', function(done) {
      var protocol = {
        proxy: {
          start: function() { return this.done('Protocol\'s proxy error'); }
        }
      };
      agito
        .use(function() {
          this.protocols.push(protocol);
          return this.done();
        })
        .start(function(err) {
          expect(err).to.equal('Protocol\'s proxy error');
          return done();
        });
    });

    it('should only pass the corresponding actions to the protocol\'s proxy', function(done) {
      var actions = [
        { protocol: 'http' },
        { protocol: 'https' },
        { protocol: 'ftp' }
      ];
      var protocol = {
        name: 'http',
        proxy: {
          start: sinon.spy(function() { return this.done(); })
        }
      };
      agito
        .use(function() {
          this.protocols.push(protocol);
          Array.prototype.push.apply(this.actions, actions);
          return this.done();
        })
        .start(function(err) {
          if (err) { return done(err); }

          expect(protocol.proxy.start).to.have.been.calledOnce; // jshint ignore:line
          expect(protocol.proxy.start.getCall(0).thisValue.actions).to.deep.equal([{
            protocol: 'http'
          }]);
          return done();
        });
    });

    it('should start one listener per port', function() {
      var ListenerSpy = function() {};
      ListenerSpy.prototype.start = sinon.spy();
      var Agito = proxyquire('../../lib/Agito', { // expected var shadowing
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
        .start();

      expect(ListenerSpy.prototype.start).to.have.callCount(triggers.length);
    });

  });

});
