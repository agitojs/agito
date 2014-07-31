'use strict';

/**
 * @public
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
 * @public
 * @type {Object[]}
 */
Agito.prototype.protocols = [];

/**
 * This array stores all the redirections registered by the different middlewares
 * which were loaded and then executed.
 *
 * @public
 * @type {Object[]}
 */
Agito.prototype.redirections = [];

/**
 * @public
 * @type {Function}
 */
Agito.prototype.use = require('./use');

/**
 * @public
 * @type {Function}
 */
Agito.prototype.run = require('./run');

module.exports = Agito;
