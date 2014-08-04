'use strict';

var async = require('async');

var Listener = require('./Listener');
var pattern = require('./pattern');
var utils = require('./utils');

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
   * This array stores all the triggers registered by the different middlewares.
   *
   * @private
   * @type {Object[]}
   */
  var _triggers = [];

  /**
   * This array stores all the engines registered by the different middlewares.
   *
   * @private
   * @type {Object[]}
   */
  var _engines = [];

  /**
   * This method is used to register a middleware.
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
   * @returns {Agito}
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

    // Execute each middleware sequentially
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

    // Parse the trigger patterns
    _triggers.forEach(function(trigger) {
      trigger.pattern = pattern.parse(trigger.pattern);
    });

    // Aggregate the triggers to allow a fast access
    _triggers = utils.nestedGroupBy(_triggers, [
      function(trigger) { return trigger.pattern.port; },
      function(trigger) { return trigger.pattern.hostname; },
      function(trigger) { return trigger.pattern.protocol; }
    ]);

    // Create and start a listener for every port
    ports = Object.keys(_triggers);
    listeners = ports.map(function(port) {
      var listener = new Listener(port);
      listener.start();
      return listener;
    });

    return this;
  };

}

module.exports = Agito;
