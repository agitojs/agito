'use strict';

/**
 * @private
 * @exports port
 */
var port = {

  /**
   * Store the relation between a given protocol and its default port. Data came
   * from [here]{@link http://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers}.
   *
   * @const {Object}
   */
  protocols: {
    http:  80,
    https: 443,
    git:   9418
  },

  /**
   * Infer the default port for a given protocol.
   *
   * @param {String} protocol
   *
   * @returns {Number}
   * @returns {null} if the protocol is not found
   */
  getDefaultPortForProtocol: function(protocol) {
    if (typeof port.protocols[protocol] === 'number') {
      return port.protocols[protocol];
    }

    return null;
  },

  /**
   * List all the ports used in triggers.
   *
   * @param {Object[]} triggers
   *
   * @returns {Number[]} - All the ports.
   *
   * @throws {Error} if trigger is not an object
   * @throws {Error} if a trigger port is not a number
   */
  extractPorts: function(triggers) {
    return triggers
      .map(function(trigger) {
        if (typeof trigger.pattern !== 'object') {
          throw new Error('trigger.pattern should be an object: ' + trigger);
        }
        if (typeof trigger.pattern.port !== 'number') {
          throw new Error('trigger.pattern.port should be a number: ' +
                          trigger.pattern);
        }
        return trigger.pattern.port;
      })
      .reduce(function(acc, port) {
        if (acc.indexOf(port) === -1) {
          acc.push(port);
        }
        return acc;
      }, [])
    ;
  }

};

module.exports = port;
