'use strict';

describe('triggers', function() {

  var triggers = require('../../lib/triggers');

  it('should expose a `normalize` method', function() {
    expect(triggers).to.respondTo('normalize');
  });

  describe('#normalize()', function() {

    var normalize = triggers.normalize;

    it('should return null to avoid call chain', function() {
      expect(normalize([])).to.be.null; // jshint ignore:line
    });

    it('should properly normalized valid triggers', function() {
      var t = [
        { pattern: 'http://check:aymericbeaumet@github.com:80/hireme?job=nodedev#SFMarch2015'   },
        { pattern: 'https://check:charlinebestard@dribbble.com:443/hireme?job=uiux#SFMarch2015' }
      ];
      normalize(t);

      expect(t).to.deep.equal([
        {
          pattern: {
            protocol: 'http', username: 'check', password: 'aymericbeaumet',
            hostname: 'github.com', port: 80,
            pathname: '/hireme', search: '?job=nodedev', hash: '#SFMarch2015'
          }
        },
        {
          pattern: {
            protocol: 'https', username: 'check', password: 'charlinebestard',
            hostname: 'dribbble.com', port: 443,
            pathname: '/hireme', search: '?job=uiux', hash: '#SFMarch2015'
          }
        }
      ]);
    });

    it('should throw an error if the URL is local', function() {
      var t = [{ pattern: 'http:localurl' }];

      expect(function() {
        normalize(t);
      }).to.throw(Error, /^Do not support local URL: /);
    });

    it('should not fill fields when the related data is not found in the trigger string', function() {
      var t = [{ pattern: 'http://example.com' }];
      normalize(t);

      expect(t[0].pattern).to.have.keys([
        'protocol', 'hostname', 'port', 'pathname'
      ]);
    });

    it('should infer the port from the protocol if not provided', function() {
      var t = [
        { pattern: 'http://example.com' },
        { pattern: 'https://example.com' }
      ];
      normalize(t);

      expect(t[0].pattern.port).to.equal(80);
      expect(t[1].pattern.port).to.equal(443);
    });

    it('should throw an error if the protocol is undefined or empty', function() {
      expect(function() {
        normalize([{ pattern: { protocol: undefined, hostname: 'foo', pathname: 'bar' } }]);
      }).to.throw(Error, /^Unable to parse the protocol or the hostname: /);

      expect(function() {
        normalize([{ pattern: { protocol: '', hostname: 'foo', pathname: 'bar' } }]);
      }).to.throw(Error, /^Unable to parse the protocol or the hostname: /);
    });

    it('should throw an error if the hostname is undefined or empty', function() {
      expect(function() {
        normalize([{ pattern: { protocol: 'http', hostname: undefined, pathname: 'oh' } }]);
      }).to.throw(Error, /^Unable to parse the protocol or the hostname: /);

      expect(function() {
        normalize([{ pattern: { protocol: 'http', hostname: '', pathname: 'oh' } }]);
      }).to.throw(Error, /^Unable to parse the protocol or the hostname: /);
    });

    it('should throw an error if the port isn\'t provided and cannot be infered from the protocol', function() {
      expect(function() {
        normalize([{ pattern: 'unknown://correctdomain.com' }]);
      }).to.throw(Error, /^Unable to infer port from the given protocol: /);
    });

  });

});
