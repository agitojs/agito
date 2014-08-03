'use strict';

describe('port', function() {

  var port = require('../../lib/port');

  it('should expose a `getDefaultPortForProtocol` method', function() {
    expect(port).to.respondTo('getDefaultPortForProtocol');
  });

  it('should expose a `extractSourcePorts` method', function() {
    expect(port).to.respondTo('extractSourcePorts');
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

  describe('#extractSourcePorts()', function() {

    var extractSourcePorts = port.extractSourcePorts;

    it('should return an array', function() {
      var ret = extractSourcePorts([]);

      expect(ret).to.be.an.instanceOf(Array);
    });

    it('should return all the ports in the `from` fields', function() {
      var redirections = [
        { from: { port: 80 },   to: { port: 90 } },
        { from: { port: 8080 }, to: { port: 9090 } }
      ];
      var ret = extractSourcePorts(redirections);

      expect(ret).to.deep.equal([80, 8080]);
    });

    it('should aggregate ports to avoid duplicate', function() {
      var redirections = [
        { from: { port: 80 }, to: { port: 90 } },
        { from: { port: 80 }, to: { port: 9090 } }
      ];
      var ret = extractSourcePorts(redirections);

      expect(ret).to.deep.equal([80]);
    });

    it('should throw an error if form is a not object', function() {
      var redirections = [{}];

      expect(function() {
        extractSourcePorts(redirections);
      }).to.throw(/^redirection.from should be an object: /);
    });

    it('should throw an error if a port is not a number', function() {
      var redirections = [{
        from: { port: undefined }
      }];

      expect(function() {
        extractSourcePorts(redirections);
      }).to.throw(Error, /^Port should be a number: /);
    });

  });

});
