'use strict';

var url = require('url');

var port = require('./port');

/**
 * @private
 */
var pattern = {};

/**
 * This method parses a given pattern. It relies on
 * [url#parse]{@link http://nodejs.org/api/url.html#url_url_parse_urlstr_parsequerystring_slashesdenotehost}.
 *
 * @param {String} inputPattern - The pattern to parse
 *
 * @return {Object} The parsed pattern
 *
 * @throws {Error} if a local URL is found
 * @throws {Error} if the protocol or the hostname cannot be parsed
 * @throws {Error} if the port is not provided and cannot be infered from the
 * protocol
 */
pattern.parse = function(inputPattern) {
  var parsed;
  var ret;
  var tmp;

  ret = inputPattern;
  if (typeof inputPattern === 'string') {
    ret = {};
    parsed = url.parse(inputPattern);

    // Throw error on URL like `mailto:xxx`
    if (parsed.slashes !== true) {
      throw new Error('Do not support local URL: ' + inputPattern);
    }

    // Fetch protocol
    ret.protocol = parsed.protocol.split(':')[0];

    // Fetch username and password
    if (typeof parsed.auth === 'string' && parsed.auth.length > 0) {
      tmp = parsed.auth.split(':');
      ret.username = tmp[0];
      if (tmp.length > 1) {
        ret.password = tmp[1];
      }
    }

    // Fetch port
    if (typeof parsed.port === 'string' && parsed.port.length > 0) {
      ret.port = parseInt(parsed.port, 10);
    }

    // Fetch hostname, pathname, search and hash
    ['hostname', 'pathname', 'search', 'hash'].forEach(function(key) {
      if (typeof parsed[key] === 'string' && parsed[key].length > 0) {
        ret[key] = parsed[key];
      }
    });
  }

  // Ensure the mandatory protocol and hostname are defined
  if (typeof ret.protocol !== 'string' || ret.protocol.length === 0 ||
      typeof ret.hostname !== 'string' || ret.hostname.length === 0) {
    throw new Error('Unable to parse the protocol or the hostname: ' +
                    JSON.stringify(inputPattern));
  }

  // Infer port if needed
  if (typeof ret.port !== 'number') {
    ret.port = port.getDefaultPortForProtocol(ret.protocol);

    if (ret.port === null) {
      throw new Error('Unable to infer port from the given protocol: ' +
                      ret.protocol);
    }
  }

  return ret;
};

module.exports = pattern;
