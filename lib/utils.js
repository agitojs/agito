'use strict';

var _ = require('lodash');

/**
 * @private
 */
var utils = {};

/**
 * This helper is a wrapper around the Lodash method `_.groupBy()`. It permits
 * to realise nested groupBy's. See [here]{@link http://lodash.com/docs#groupBy}
 * for more information about this method.
 *
 * @param {Array|Object|String} collection
 * @param {Function|Object|String|(Function|Object|String)[]} identities
 * @param {*} thisArg
 *
 * @return {Object[]}
 */
utils.nestedGroupBy = function(collection, identities, thisArg) {
  var identity;

  identities = Array.isArray(identities) ? identities : [identities];
  identities = _.compact(identities);

  if (identities.length === 0) {
    return collection;
  }

  identity = identities.shift();
  return _(collection)
    .groupBy(identity, thisArg)
    .forOwn(function(value, key, collection) {
      collection[key] =
        utils.nestedGroupBy(collection[key], identities, thisArg);
    })
    .value()
  ;
};

module.exports = utils;
