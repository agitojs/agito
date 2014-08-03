'use strict';

var net = require('net');

/**
 * This class is a wrapper around a low-level TCP server which will listen on
 * the given port. It processes each request in the following order:
 * - identify the protocol (using the matchers provided by the agito-*-protocol
 *   modules)
 * - hand over the request to the adapted handler
 *
 * @private
 * @class
 * @extends net.Server
 *
 * @param {Number} port - The port on which the newly created listener should be
 * listening
 *
 * @returns {Listener}
 *
 * @throws {Error} if a port isn't provided
 */
function Listener(port) {

  /**
   * Start the server.
   *
   * @param {Function} done - Called when the listener is started.
   *
   * @returns {Listener}
   */
  this.start = function(done) {
    this.listen(port, done);

    return this;
  };

  /**
   * Stop the server.
   *
   * @param {Function} done - Called when the listener is stopped.
   *
   * @returns {null}
   */
  this.stop = function(done) {
    this.close(done);

    return null;
  };

  // Initialization

  if (typeof port !== 'number') {
    throw new Error('A port is needed when instanciating a new listener');
  }

}
Listener.prototype = net.Server.prototype;

module.exports = Listener;
