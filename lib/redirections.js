'use strict';

var parseUrl = require('url').parse;

module.exports = {

  /**
   * This method does an in place normalization of all the given redirections.
   * It uses [url#parse]{@link http://nodejs.org/api/url.html#url_url_parse_urlstr_parsequerystring_slashesdenotehost}
   * to parse both the `from` and the `to` fields.
   *
   * @param {Object[]} redirections
   *
   * @return {null}
   */
  normalize: function(redirections) {
    redirections.forEach(function(redirection) {
      ['from', 'to'].forEach(function(field) {
        var obj;
        var parsed;
        var tmp;

        if (typeof redirection[field] === 'string') {
          parsed = parseUrl(redirection[field]);

          // Assign container
          redirection[field] = {};

          // Fetch protocol
          if (typeof parsed.protocol === 'string' &&
             parsed.protocol.length > 0) {
            redirection[field].protocol = parsed.protocol.split(':')[0];
          }

          // Fetch username and password
          if (typeof parsed.auth === 'string' &&
             parsed.port.length > 0) {
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

        obj = (parsed && parsed.href) || redirection[field];

        if (typeof redirection[field].protocol !== 'string' ||
            typeof redirection[field].hostname !== 'string') {
          throw new Error('Unable to parse the protocol or the hostname: ' +
                          JSON.stringify(obj));
        }

        if (parsed.slashes !== true) {
          throw new Error('Do not support local URL: ' + JSON.stringify(obj));
        }

      });
    });

    return null;
  }

};
