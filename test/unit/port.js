'use strict';

describe('port', function() {

  var port = require('../../lib/port');

  it('should expose a `getDefaultPortForProtocol` method', function() {
    expect(port).to.respondTo('getDefaultPortForProtocol');
  });

  describe('#getDefaultPortForProtocol()', function() {

    var getDefaultPortForProtocol = port.getDefaultPortForProtocol;

    it('should return null if the given port doesn\'t exist', function() {
      var ret = getDefaultPortForProtocol('unknown');

      expect(ret).to.be.null; // jshint ignore:line
    });

    it('should return a number if the port exists in the map', function() {
      var ret = getDefaultPortForProtocol('http');

      expect(ret).to.equal(80);
    });

  });

});
