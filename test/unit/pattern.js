'use strict';

describe('pattern', function() {

  var pattern = require('../../lib/pattern');

  it('should expose a `parse` method', function() {
    expect(pattern).to.respondTo('parse');
  });

  describe('#parse()', function() {

    var parse = pattern.parse;

    it('should properly normalized valid patterns', function() {
      expect(parse(
        'http://check:aymericbeaumet@github.com:80/hireme?job=nodedev#SFMarch2015'
      )).to.deep.equal({
        protocol: 'http', username: 'check', password: 'aymericbeaumet',
        hostname: 'github.com', port: 80,
        pathname: '/hireme', search: '?job=nodedev', hash: '#SFMarch2015'
      });

      expect(parse(
        'https://check:charlinebestard@dribbble.com:443/hireher?job=uiux#SFMarch2015'
      )).to.deep.equal({
        protocol: 'https', username: 'check', password: 'charlinebestard',
        hostname: 'dribbble.com', port: 443,
        pathname: '/hireher', search: '?job=uiux', hash: '#SFMarch2015'
      });
    });

    it('should throw an error if the pattern represents a local URL', function() {
      var pattern = 'http:localurl';

      expect(function() {
        parse(pattern);
      }).to.throw(Error, /^Do not support local URL: /);
    });

    it('should not fill fields when the related data is not found in the pattern string', function() {
      var pattern = parse('http://example.com');

      expect(pattern).to.have.keys([
        'protocol', 'hostname', 'port', 'pathname'
      ]);
    });

    it('should infer the port from the protocol if not provided', function() {
      var ret = ['http://example.com', 'https://example.com'].map(function(p) {
        return parse(p);
      });

      expect(ret[0].port).to.equal(80);
      expect(ret[1].port).to.equal(443);
    });

    it('should be able to parse a string with a username but without password', function() {
      var pattern = parse('http://username@example.com');

      expect(pattern).to.have.keys([
        'protocol', 'username', 'hostname', 'port', 'pathname'
      ]);
    });

    it('should pass the given pattern through if it is a correct object', function() {
      var pattern = {
        protocol: 'https',
        hostname: 'github.com',
        port: 443
      };

      expect(parse(pattern)).to.deep.equal(pattern);
    });

    it('should throw an error if the protocol is undefined or empty', function() {
      expect(function() {
        parse({ protocol: undefined, hostname: 'foo', pathname: 'bar' });
      }).to.throw(Error, /^Unable to parse the protocol or the hostname: /);

      expect(function() {
        parse({ protocol: '', hostname: 'foo', pathname: 'bar' });
      }).to.throw(Error, /^Unable to parse the protocol or the hostname: /);
    });

    it('should throw an error if the hostname is undefined or empty', function() {
      expect(function() {
        parse({ protocol: 'http', hostname: undefined, pathname: 'foobar' });
      }).to.throw(Error, /^Unable to parse the protocol or the hostname: /);

      expect(function() {
        parse({ protocol: 'http', hostname: '', pathname: 'foobar' });
      }).to.throw(Error, /^Unable to parse the protocol or the hostname: /);
    });

    it('should throw an error if the port isn\'t provided and cannot be infered from the protocol', function() {
      expect(function() {
        parse('unknown://correctdomain.com');
      }).to.throw(Error, /^Unable to infer port from the given protocol: /);
    });

  });

});
