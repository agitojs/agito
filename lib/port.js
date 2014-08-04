'use strict';

/**
 * @private
 */
var port = {};

/**
 * Store the relation between a given protocol and its default port. Data came
 * from [here]{@link http://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers}.
 *
 * @const {Object}
 */
port.protocols = {
  http:  80,
  https: 443,
  git:   9418
};

/**
 * Infer the default port for a given protocol.
 *
 * @param {String} protocol
 *
 * @returns {Number}
 * @returns {null} if the protocol is not found
 */
port.getDefaultPortForProtocol = function(protocol) {
  if (typeof port.protocols[protocol] === 'number') {
    return port.protocols[protocol];
  }

  return null;
};

module.exports = port;
