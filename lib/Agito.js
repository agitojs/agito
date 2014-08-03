'use strict';

var async = require('async');

var extractSourcePorts = require('./port').extractSourcePorts;
var normalizeRedirections = require('./redirections').normalize;

/**
 * @class
 */
function Agito() {

  if (!(this instanceof Agito)) {
    return new Agito();
  }

  /**
   * This array will store all the registered middlewares (via the `Agito#use()`
   * method). They will then be consumed by the `Agito#run()` method.
   *
   * @private
   * @type {Function[]}
   */
  var _middlewares = [];

  /**
   * This array stores all the protocols registered by the different
   * middlewares.
   *
   * @private
   * @type {Object[]}
   */
  var _protocols = [];

  /**
   * This array stores all the redirections registered by the different
   * middlewares.
   *
   * @type {Object[]}
   */
  var _redirections = [];

  /**
   * This method is used to register a middleware to an allocated Agito object.
   *
   * @param {Function} middleware - The middleware to register
   *
   * @return {Agito} Return the Agito object in order to be able to chain calls
   */
  this.use = function(middleware) {
    _middlewares.push(middleware);

    return this;
  };

  /**
   * This method is used to browse all the registered middlewares and call them
   * in a sequential order.
   *
   * @return {null}
   */
  this.run = function() {
    var ports;

    if (_middlewares.length === 0) {
      throw new Error('No middlewares were registered');
    }

    async.eachSeries(_middlewares,
      function forEach(middleware, done) {
        middleware.call({
          protocols: _protocols, redirections: _redirections, done: done
        }, _protocols, _redirections, done);
      },

      function onAllDone(err) {
        if (err) {
          throw new Error(err);
        }
      }
    );

    // In place normalization
    normalizeRedirections(_redirections);

    // Grab the ports on which a TCP server will be opened
    ports = extractSourcePorts(_redirections);

    return null;
  };

}

module.exports = Agito;
