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
  }

};