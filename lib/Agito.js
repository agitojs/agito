'use strict';

function Agito() {
  if (!(this instanceof Agito)) {
    return new Agito();
  }
}

Agito.prototype.use = require('./use');

module.exports = Agito;
