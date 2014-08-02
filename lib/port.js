'use strict';

/**
 * Store the relation between a given protocol and its default port. Data came
 * from [here]{@link http://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers}.
 *
 * @private
 * @const {Object}
 */
var _protocolsPorts = {
  http:  80   ,
  https: 443  ,
  git:   9418
};

module.exports = {

  /**
   * Infer the default port for a given protocol.
   *
   * @param {String} protocol
   *
   * @return {Number}
   * @return {null} if the protocol is not found
   */
  getDefaultPortForProtocol: function(protocol) {
    if (typeof _protocolsPorts[protocol] === 'number') {
      return _protocolsPorts[protocol];
    }

    return null;
  },

  /**
   * List all the ports used in the `from` field.
   *
   * @param {Object[]} redirections
   *
   * @return {Number[]} - All the ports.
   */
  extractSourcePorts: function(redirections) {
    return redirections
      .map(function(redirection) {
        if (typeof redirection.from !== 'object') {
          throw new Error('redirection.from should be an object: ' + redirection);
        }
        if (typeof redirection.from.port !== 'number') {
          throw new Error('Port should be a number: ' + redirection.from);
        }
        return redirection.from.port;
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
