'use strict';

var url = require('url');

var port = require('./port');

/**
 * @private
 */
var redirections = {

  /**
   * This method does an in place normalization of all the given redirections.
   * It uses [url#parse]{@link http://nodejs.org/api/url.html#url_url_parse_urlstr_parsequerystring_slashesdenotehost}
   * to parse both the `from` and the `to` fields.
   *
   * @param {Object[]} redirections
   *
   * @return {null}
   *
   * @throws {Error} if a local URL is found
   * @throws {Error} if the protocol or the hostname cannot be parsed
   * @throws {Error} if the port is not provided and cannot be infered from the
   * protocol
   */
  normalize: function(redirections) {
    redirections.forEach(function(redirection) {
      ['from', 'to'].forEach(function(field) {
        var obj;
        var parsed;
        var tmp;

        if (typeof redirection[field] === 'string') {
          parsed = url.parse(redirection[field]);

          // Throw error on URL like `mailto:xxx`
          if (parsed.slashes !== true) {
            throw new Error('Do not support local URL: ' + JSON.stringify(obj));
          }

          // Assign container
          redirection[field] = {};

          // Fetch protocol
          if (typeof parsed.protocol === 'string' &&
              parsed.protocol.length > 0) {
            redirection[field].protocol = parsed.protocol.split(':')[0];
          }

          // Fetch username and password
          if (typeof parsed.auth === 'string' &&
              parsed.auth.length > 0) {
            tmp = parsed.auth.split(':');
            redirection[field].username = tmp[0];
            if (tmp.length > 1) {
              redirection[field].password = tmp[1];
            }
          }

          // Fetch port
          if (typeof parsed.port === 'string' &&
              parsed.port.length > 0) {
            redirection[field].port = parseInt(parsed.port, 10);
          }

          // Fetch hostname, pathname, search and hash
          ['hostname', 'pathname', 'search', 'hash'].forEach(function(key) {
            if (typeof parsed[key] === 'string' && parsed[key].length > 0) {
              redirection[field][key] = parsed[key];
            }
          });
        }

        // Used to log errors
        obj = (parsed && parsed.href) || redirection[field];

        // Ensure the mandatory fields protocol and hostname are defined
        if (typeof redirection[field].protocol !== 'string' ||
            redirection[field].protocol.length === 0 ||
            typeof redirection[field].hostname !== 'string' ||
            redirection[field].hostname.length === 0) {
          throw new Error('Unable to parse the protocol or the hostname: ' +
                          JSON.stringify(obj));
        }

        // Infer port if needed
        if (typeof redirection[field].port !== 'number') {
          redirection[field].port =
            port.getDefaultPortForProtocol(redirection[field].protocol);

          if (redirection[field].port === null) {
            throw new Error('Unable to infer port from the given protocol: ' +
                            redirection[field].protocol);
          }
        }

      });
    });

    return null;
  }

};

module.exports = redirections;
