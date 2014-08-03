'use strict';

var events = require('events');
var net = require('net');

var portfinder = require('portfinder');

describe('Listener', function() {

  var Listener = require('../../lib/Listener');
  var listener;

  beforeEach(function(done) {
    portfinder.getPort(function(err, port) {
      if (err) {
        return done(err);
      }
      listener = new Listener(port);
      done();
    });
  });

  it('should be a function', function() {
    expect(Listener).to.be.a('function');
  });

  it('should create an object when using the \'new\' operator', function() {
    expect(listener).to.be.an.instanceOf(Listener);
  });

  it('should inherit from net.Server', function() {
    expect(listener).to.be.an.instanceOf(net.Server);
  });

  it('should inherit from events.EventEmitter', function() {
    expect(listener).to.be.an.instanceOf(events.EventEmitter);
  });

  it('should throw an error if a port isn\'t provided', function() {
    expect(function() {
      new Listener(); // jshint ignore:line
    }).to.throw(Error, 'A port is needed when instanciating a new listener');
  });

  it('should expose a `start` method', function() {
    expect(listener).to.respondTo('start');
  });

  it('should expose a `stop` method', function() {
    expect(listener).to.respondTo('stop');
  });

  describe('#start()', function() {

    it('should start the server on the given port', function(done) {
      listener.on('listening', done);
      listener.on('error', done);

      listener.start();
    });

  });

  describe('#stop()', function() {

    it('should correctly stop the server', function(done) {
      listener.on('listening', function() { listener.stop(); });
      listener.on('close', done);
      listener.on('error', done);

      listener.start();
    });

  });

});
