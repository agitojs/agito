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
 * This array will store all the registered middlewares (via  the `Agito#use()`
 * method). They will then be consumed by the `Agito#run()` method.
 *
 * @private
 * @type {Function[]}
 */
Agito.prototype._middlewares = [];

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
