'use strict';

/**
 * This method is used to register a middleware to an allocated Agito object.
 *
 * @param {Function} middleware - The middleware to register
 *
 * @return {Agito} Return the Agito object in order to be able to chain calls
 */
function use(middleware) {
  this.middlewares.push(middleware);

  return this;
}

module.exports = use;
