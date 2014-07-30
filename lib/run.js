'use strict';

var async = require('async');

/**
 * This method is used to browse all the registered middlewares and call them in
 * a sequential order.
 *
 * @return {null}
 */
function run() {
  var that = this;

  if (!Array.isArray(this._middlewares) || this._middlewares.length === 0) {
    throw new Error('No middlewares were registered');
  }

  async.eachSeries(this._middlewares,
    function iterator(middleware, done) {
      middleware.call(that, that, done);
    }
  );

  return null;
}

module.exports = run;
