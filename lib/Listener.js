'use strict';

var events = require('events');
var net = require('net');

var _ = require('lodash');

var EventEmitter = events.EventEmitter;

/**
 * This class is a wrapper around a low-level TCP server which will listen on
 * the given port. It processes each request in the following order:
 * - identify the protocol (using the matchers provided by the agito-*-protocol
 *   modules)
 * - hand over the request to the adapted proxy server (specific for each
 *   protocol)
 *
 * @private
 * @class
 *
 * @param {Object} options
 * @param {Number} options.port - The port on which the newly created listener
 * should be listening
 * @param {Object[]} options.protocols
 *
 * @returns {Listener}
 */
function Listener(options) {

  /**
   * @private
   * @type {Number}
   */
  var _port = options.port;

  /**
   * @private
   * @type {Object[]}
   */
  var _protocols = options.protocols;

  /**
   * @private
   * @type {net.Server}
   */
  var _server = net.createServer(onNewConnection);

  /**
   * Start the server.
   *
   * @param {Function} done - Called when the listener is started.
   *
   * @returns {net.Server}
   */
  this.start = function(done) {
    return _server.listen(_port, done);
  };

  /**
   * Permit to directly register events on the underlying server.
   */
  this.on = EventEmitter.prototype.on.bind(_server);

  /**
   * Stop the server.
   *
   * @param {Function} done - Called when the listener is stopped.
   *
   * @returns {null}
   */
  this.stop = function(done) {
    _server.close(done);

    return null;
  };

  /**
   * Called when a new connection is created.
   *
   * @private
   *
   * @param {net.Socket} connection
   */
  function onNewConnection(connection) {
    connection.once('data', function(chunk) {

      var protocol;
      var proxyConnection;

      // Identify the protocol by running the `match` function on each
      // registered protocol
      protocol = _(_protocols)
        .filter(function(protocol) {
          return protocol.match(chunk.toString());
        })
        .first()
      ;

      if (!protocol) {
        // TODO(aymeric): add log -> 'No matching protocols have been found'
        return connection.destroy();
      }

      proxyConnection = net.connect(protocol.proxy.address, function() {
        proxyConnection.write(chunk);
        connection.pipe(proxyConnection).pipe(connection);
      });

    });
  }

}

module.exports = Listener;
