'use strict';

var async = require('async');

/**
 * This method is used to browse all the registered and call them in a
 * sequential order.
 */
function run() {
  var that = this;

  if (!Array.isArray(this.middlewares) || this.middlewares.length === 0) {
    throw new Error('No middlewares were registered');
  }

  async.eachSeries(this.middlewares,
    function iterator(middleware, done) {
      middleware.call(that, that, done);
    }
  );

}

module.exports = run;
