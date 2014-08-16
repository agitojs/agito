'use strict';

var _ = require('lodash');
var async = require('async');

var Listener = require('./Listener');
var pattern = require('./pattern');
var util = require('./util');

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
   * This array stores all the actions registered by the different middlewares.
   *
   * @private
   * @type {Object[]}
   */
  var _actions = [];

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
   * in a sequential order. It then extracts all the ports found in the triggers
   * and starts a TCP server for each one.
   *
   * @param {Function} onEngineReady - Called when the engine is ready
   *
   * @returns {null}
   */
  this.start = function(onEngineReady) {
    onEngineReady = onEngineReady || function() {};

    if (_middlewares.length === 0) {
      return onEngineReady(new Error('No middlewares were registered'));
    }

    // Execute each middleware sequentially
    async.eachSeries(_middlewares,

      function forEachMiddleware(middleware, done) {
        middleware.call({
          protocols: _protocols,
          triggers: _triggers,
          actions: _actions,
          done: done
        }, _protocols, _triggers, _actions, done);
      },

      function whenDone(err) {
        if (err) {
          return onEngineReady(err);
        }

        // Parse the trigger patterns
        _triggers.forEach(function(trigger) {
          trigger.pattern = pattern.parse(trigger.pattern);
        });

        // Aggregate:
        //   - the triggers by protocol and port
        //   - the actions by protocol
        _triggers = util.nestedGroupBy(_triggers, [
          function(trigger) { return trigger.pattern.protocol; },
          function(trigger) { return trigger.pattern.port; }
        ]);
        _actions = util.nestedGroupBy(_actions, [
          function(action) { return action.protocol; }
        ]);

        // For each protocol, start the proxy servers
        async.each(_protocols,

          function forEachProtocol(protocol, done) {
            var triggers = _triggers[protocol.name] || [];
            var actions = _actions[protocol.name] || [];

            protocol.proxy.start.call({
              triggers: triggers,
              actions: actions,
              done: done
            }, triggers, actions, done);
          },

          function whenDone(err) {
            var ports;

            if (err) {
              return onEngineReady(err);
            }

            // Create and start a listener on every port
            ports = _(_triggers)
              .map(function(triggers) {
                return Object.keys(triggers); // keys are the ports
              })
              .flatten()
              .uniq()
              .map(function(port) { return parseInt(port, 10); })
              .value();
            async.map(ports,
              function forEachPort(port, done) {
                var listener = new Listener({
                  port: port,
                  protocols: _protocols
                });
                return listener.start(done);
              },

              function whenDone(err, listeners) {
                return onEngineReady(err, listeners);
              }
            );

          }

        );

      }

    );

    return null;
  };

}

module.exports = Agito;
