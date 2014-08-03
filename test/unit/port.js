'use strict';

describe('port', function() {

  var port = require('../../lib/port');

  it('should expose a `getDefaultPortForProtocol` method', function() {
    expect(port).to.respondTo('getDefaultPortForProtocol');
  });

  it('should expose a `extractPorts` method', function() {
    expect(port).to.respondTo('extractPorts');
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

  describe('#extractPorts()', function() {

    var extractPorts = port.extractPorts;

    it('should return an array', function() {
      var ret = extractPorts([]);

      expect(ret).to.be.an.instanceOf(Array);
    });

    it('should return all the ports', function() {
      var triggers = [
        { pattern: { port: 80 } },
        { pattern: { port: 8080 } }
      ];
      var ret = extractPorts(triggers);

      expect(ret).to.deep.equal([80, 8080]);
    });

    it('should aggregate ports to avoid duplicate', function() {
      var triggers = [
        { pattern: { port: 80 } },
        { pattern: { port: 80 } }
      ];
      var ret = extractPorts(triggers);

      expect(ret).to.deep.equal([80]);
    });

    it('should throw an error if a pattern is not an object', function() {
      var triggers = [
        { pattern: undefined }
      ];

      expect(function() {
        extractPorts(triggers);
      }).to.throw(/^trigger.pattern should be an object: /);
    });

    it('should throw an error if a port is not a number', function() {
      var triggers = [
        { pattern: { port: undefined } }
      ];

      expect(function() {
        extractPorts(triggers);
      }).to.throw(Error, /^trigger.pattern.port should be a number: /);
    });

  });

});
