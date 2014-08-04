'use strict';

var url = require('url');

var port = require('./port');

/**
 * @private
 */
var triggers = {};

/**
 * This method does an in place normalization of all the given triggers. It
 * uses [url#parse]{@link http://nodejs.org/api/url.html#url_url_parse_urlstr_parsequerystring_slashesdenotehost}
 * to parse the string at the `pattern` key if needed.
 *
 * @param {Object[]} triggers
 *
 * @return {null}
 *
 * @throws {Error} if a local URL is found
 * @throws {Error} if the protocol or the hostname cannot be parsed
 * @throws {Error} if the port is not provided and cannot be infered from the
 * protocol
 */
triggers.normalize = function(triggers) {
  triggers.forEach(function(trigger) {
      var obj;
      var parsed;
      var tmp;

      if (typeof trigger.pattern === 'string') {
        parsed = url.parse(trigger.pattern);

        // Throw error on URL like `mailto:xxx`
        if (parsed.slashes !== true) {
          throw new Error('Do not support local URL: ' + JSON.stringify(obj));
        }

        // Assign container
        trigger.pattern = {};

        // Fetch protocol
        if (typeof parsed.protocol === 'string' &&
            parsed.protocol.length > 0) {
          trigger.pattern.protocol = parsed.protocol.split(':')[0];
        }

        // Fetch username and password
        if (typeof parsed.auth === 'string' &&
            parsed.auth.length > 0) {
          tmp = parsed.auth.split(':');
          trigger.pattern.username = tmp[0];
          if (tmp.length > 1) {
            trigger.pattern.password = tmp[1];
          }
        }

        // Fetch port
        if (typeof parsed.port === 'string' &&
            parsed.port.length > 0) {
          trigger.pattern.port = parseInt(parsed.port, 10);
        }

        // Fetch hostname, pathname, search and hash
        ['hostname', 'pathname', 'search', 'hash'].forEach(function(key) {
          if (typeof parsed[key] === 'string' && parsed[key].length > 0) {
            trigger.pattern[key] = parsed[key];
          }
        });
      }

      // Used to log errors
      obj = (parsed && parsed.href) || trigger.pattern;

      // Ensure the mandatory protocol and hostname are defined
      if (typeof trigger.pattern.protocol !== 'string' ||
          trigger.pattern.protocol.length === 0 ||
          typeof trigger.pattern.hostname !== 'string' ||
          trigger.pattern.hostname.length === 0) {
        throw new Error('Unable to parse the protocol or the hostname: ' +
                        JSON.stringify(obj));
      }

      // Infer port if needed
      if (typeof trigger.pattern.port !== 'number') {
        trigger.pattern.port =
          port.getDefaultPortForProtocol(trigger.pattern.protocol);

        if (trigger.pattern.port === null) {
          throw new Error('Unable to infer port from the given protocol: ' +
                          trigger.pattern.protocol);
        }
      }
  });

  return null;
};

module.exports = triggers;
