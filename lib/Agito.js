'use strict';

var async = require('async');

var Listener = require('./Listener');
var extractSourcePorts = require('./port').extractSourcePorts;
var normalizeRedirections = require('./redirections').normalize;

/**
 * This is the main class and the only one you should use.
 *
 * @class
 *
 * @returns {Agito}
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
   * @private
   * @type {Object[]}
   */
  var _redirections = [];

  /**
   * This method is used to register a middleware to an allocated Agito object.
   *
   * @param {Function} middleware - The middleware to register
   *
   * @returns {Agito} Return the Agito object in order to be able to chain calls
   */
  this.use = function(middleware) {
    _middlewares.push(middleware);

    return this;
  };

  /**
   * This method is used to browse all the registered middlewares and call them
   * in a sequential order.
   *
   * @returns {null}
   *
   * @throws {Error} if not middlewares are registered
   * @throws {Error} if a middleware returns an error
   */
  this.run = function() {
    var ports;
    var listeners;

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

    // Create and start all the listeners
    listeners = ports
      .map(function(port) {
        return new Listener(port);
      })
      .forEach(function(listener) {
        listener.start();
      })
    ;

    return null;
  };

}

module.exports = Agito;
