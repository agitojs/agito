'use strict';

var fs = require('fs');
var net = require('net');
var path = require('path');

var portfinder = require('portfinder');

/**
 * Create a TCP connection and send dummy data.
 *
 * @param {Object} options
 * @param {String} options.host
 * @param {Number} options.port
 * @param {String} data - The data to send
 * @param {Function} done - Called when the request is finished
 *
 * @return {null}
 */
function emitTCPRequest(options, data, done) {
  var connection = net.createConnection(options, function() {
    connection.write(data);
    connection.end();
    setTimeout(done, 10);
  });

  return null;
}

/**
 * Create a temporary server listening on a Unix socket.
 *
 * @param {String} socketPath - Where to create the socket
 *
 * @return {net.Socket}
 */
function createUnixSocket(socketPath) {
  try {
    fs.unlinkSync(socketPath);
  } catch (e) {}

  return net.createServer().listen(socketPath);
}

describe('Listener', function() {

  var Listener = require('../../lib/Listener');
  var listener;
  var port;
  var protocols;

  beforeEach(function(done) {
    var unixSocketPath = path.join(__dirname, 'tmp.sock');
    createUnixSocket(unixSocketPath);
    protocols = [false, false, false, true].map(function(ret) {
      return {
        match: sinon.spy(function() { return ret; }),
        proxy: {
          address: unixSocketPath
        }
      };
    });

    portfinder.getPort(function(err, p) {
      port = p;

      if (err) {
        return done(err);
      }
      listener = new Listener({
        port: port,
        protocols: protocols
      });

      return done();
    });
  });

  afterEach(function() {
    swallow(function() {
      listener.stop();
    });
  });

  it('should create an object when using the \'new\' operator', function() {
    expect(listener).to.be.an.instanceOf(Listener);
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

    it('should return null', function(done) {
      listener.on('listening', function() {
        var ret = listener.stop();

        expect(ret).to.be.null; // jshint ignore:line
        done();
      });

      listener.start();
    });

    it('should correctly stop the server', function(done) {
      listener.on('listening', function() { listener.stop(); });
      listener.on('close', done);
      listener.on('error', done);

      listener.start();
    });

  });

  describe('on each request', function() {

    var dummyRequestData = 'dummy';

    it('should call the `match` function of every registered protocol', function(done) {
      listener.start();

      emitTCPRequest({ port: port }, dummyRequestData, function onEnd() {
        protocols.forEach(function(protocol, index) {
          expect(protocol.match).to.have.been.calledOnce; // jshint ignore:line
          expect(protocol.match).to.have.been.calledWithExactly(dummyRequestData);
          if (index < protocols.length - 1) { // all except the last one
            expect(protocol.match).to.have.returned(false);
          }
        });
        expect(protocols[protocols.length - 1].match).to.have.returned(true);

        return done();
      });
    });

    it('should not forward the request to a protocol\'s proxy if the protocol is not recognized', function(done) {
      portfinder.getPort(function(err, port) {
        listener = new Listener({
          port: port,
          protocols: []
        });

        listener.start(function() {
          sinon.spy(net, 'connect');
          emitTCPRequest({ port: port }, 'dummy', function onEnd() {
            expect(net.connect).not.to.have.been.called; // jshint ignore:line
            net.connect.restore();
            return done();
          });
        });
      });
    });

  });

});
