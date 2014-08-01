'use strict';

var async = require('async');


/**
 * @class
 */
function Agito() {
  if (!(this instanceof Agito)) {
    return new Agito();
  }
}


/**
 * This array will store all the registered middlewares (via the `Agito#use()`
 * method). They will then be consumed by the `Agito#run()` method.
 *
 * @private
 * @type {Function[]}
 */
Agito.prototype._middlewares = [];


/**
 * This array stores all the protocols registered by the different middlewares
 * which were loaded and then executed.
 *
 * @type {Object[]}
 */
Agito.prototype.protocols = [];


/**
 * This array stores all the redirections registered by the different middlewares
 * which were loaded and then executed.
 *
 * @type {Object[]}
 */
Agito.prototype.redirections = [];


/**
 * This method is used to register a middleware to an allocated Agito object.
 *
 * @param {Function} middleware - The middleware to register
 *
 * @return {Agito} Return the Agito object in order to be able to chain calls
 */
Agito.prototype.use = function(middleware) {
  this._middlewares.push(middleware);

  return this;
};


/**
 * This method is used to browse all the registered middlewares and call them in
 * a sequential order.
 *
 * @return {null}
 */
Agito.prototype.run = function() {
  var that = this;

  if (!Array.isArray(this._middlewares) || this._middlewares.length === 0) {
    throw new Error('No middlewares were registered');
  }

  async.eachSeries(this._middlewares,
    function forEach(middleware, done) {
      middleware.call(that, that, done);
    },

    function onAllDone(err) {
      if (err) {
        throw new Error(err);
      }
    }
  );

  return null;
};


module.exports = Agito;
