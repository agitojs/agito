'use strict';

function Agito() {
  if (!(this instanceof Agito)) {
    return new Agito();
  }

  this.middlewares = [];
}

Agito.prototype.use = require('./use');
Agito.prototype.run = require('./run');

module.exports = Agito;
