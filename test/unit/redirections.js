'use strict';

var chai = require('chai');
var expect = chai.expect;

describe('redirections', function() {

  var redirections = require('../../lib/redirections');

  it('should expose a `normalize` method', function() {
    expect(redirections).to.respondTo('normalize');
  });

  describe('#normalize()', function() {

    var normalize = redirections.normalize;

    it('should return null to avoid call chain', function() {
      expect(normalize([])).to.be.null; // jshint ignore:line
    });

    it('should throw an error if the given redirections are not in an array', function() {
      expect(function() { normalize([]); }).not.to.throw();
      expect(function() { normalize(); }).to.throw(TypeError);
      expect(function() { normalize(null); }).to.throw(TypeError);
      expect(function() { normalize(true); }).to.throw(TypeError);
      expect(function() { normalize(42); }).to.throw(TypeError);
      expect(function() { normalize('test'); }).to.throw(TypeError);
      expect(function() { normalize({}); }).to.throw(TypeError);
    });

    it('should properly normalized correct strings', function() {
      var redirection = [{
        from: 'http://check:aymericbeaumet@github.com:80/hireme?job=nodedev#SFMarch2015',
        to: 'https://check:charlinebestard@dribbble.com:443/hireme?job=uiux#SFMarch2015'
      }];
      normalize(redirection);

      expect(redirection).to.deep.equal([
        {
          from: {
            protocol: 'http', username: 'check', password: 'aymericbeaumet',
            hostname: 'github.com', port: 80,
            pathname: '/hireme', search: '?job=nodedev', hash: '#SFMarch2015'
          },
          to: {
            protocol: 'https', username: 'check', password: 'charlinebestard',
            hostname: 'dribbble.com', port: 443,
            pathname: '/hireme', search: '?job=uiux', hash: '#SFMarch2015'
          }
        }
      ]);
    });

    it('should throw an error if the URL is local', function() {
      expect(function() {
        normalize([{
          from: 'http:hey',
          to: 'http://correct.com' }
        ]);
      }).to.throw(Error, /^Do not support local URL: /);
    });

    it('should not fill fields when the related data is not found in the source string', function() {
      var redirection = [{ from: 'http://example.com', to: 'http://example.net' }];
      normalize(redirection);

      ['from', 'to'].forEach(function(field) {
        expect(redirection[0][field]).to.have.keys('protocol', 'hostname', 'port', 'pathname');
      });
    });

    it('should infer the port from the protocol if not provided', function() {
      var redirection = [{ from: 'http://example.com', to: 'https://example.net' }];
      normalize(redirection);

      expect(redirection[0].from.port).to.equal(80);
      expect(redirection[0].to.port).to.equal(443);
    });

    it('should throw an error if the protocol is undefined or empty', function() {
      expect(function() {
        normalize([{
          from: { protocol: undefined, hostname: 'hey', pathname: 'oh' },
          to: 'http://correct.com' }
        ]);
      }).to.throw(Error, /^Unable to parse the protocol or the hostname: /);
      expect(function() {
        normalize([{
          from: { protocol: '', hostname: 'hey', pathname: 'oh' },
          to: 'http://correct.com' }
        ]);
      }).to.throw(Error, /^Unable to parse the protocol or the hostname: /);
    });

    it('should throw an error if the hostname is undefined or empty', function() {
      expect(function() {
        normalize([{
          from: { protocol: 'http', hostname: undefined, pathname: 'oh' },
          to: 'http://correct.com' }
        ]);
      }).to.throw(Error, /^Unable to parse the protocol or the hostname: /);
      expect(function() {
        normalize([{
          from: { protocol: 'http', hostname: '', pathname: 'oh' },
          to: 'http://correct.com' }
        ]);
      }).to.throw(Error, /^Unable to parse the protocol or the hostname: /);
    });

    it('should throw an error if the port isn\'t provided and cannot be infered from the protocol', function() {
      expect(function() {
        normalize([{
          from: 'unknown://correctdomain.com',
          to: 'http://correct.com'
        }]);
      }).to.throw(Error, /^Unable to infer port from the given protocol: /);
    });

  });

});
