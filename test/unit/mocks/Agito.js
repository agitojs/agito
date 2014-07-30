'use strict';

var AgitoMock = {
  create: function() {
    return {
      _middlewares: [],
      protocols: [],
      redirections: []
    };
  }
};

module.exports = AgitoMock;
