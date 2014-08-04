'use strict';

var async = require('async');

var Listener = require('./Listener');
var port = require('./port');
var triggers = require('./triggers');

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
   * This array will store all the registered middlewares. They will then be
   * consumed by the `Agito#start()` method.
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
   * This array stores all the triggers registered by the different
   * middlewares.
   *
   * @private
   * @type {Object[]}
   */
  var _triggers = [];

  /**
   * This array stores all the engines regisyered by the different middlewares.
   *
   * @private
   * @type {Object[]}
   */
  var _engines = [];

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
   * in a sequential order. It then extract all the ports found in the triggers
   * and starts a TCP server for each one.
   *
   * @returns {null}
   *
   * @throws {Error} if not middlewares are registered
   * @throws {Error} if a middleware returns an error
   */
  this.start = function() {
    var ports;
    var listeners;

    if (_middlewares.length === 0) {
      throw new Error('No middlewares were registered');
    }

    async.eachSeries(_middlewares,
      function forEach(middleware, done) {
        middleware.call({
          protocols: _protocols,
          triggers: _triggers,
          engines: _engines,
          done: done
        }, _protocols, _triggers, _engines, done);
      },

      function onAllDone(err) {
        if (err) {
          throw new Error(err);
        }
      }
    );

    // In place normalization
    triggers.normalize(_triggers);

    // Grab the ports on which a TCP server will be opened
    ports = port.extractPorts(_triggers);

    // Create and start a listener for every port
    listeners = ports.map(function(port) {
      var listener = new Listener(port);
      listener.start();
      return listener;
    });

    return null;
  };

}

module.exports = Agito;
