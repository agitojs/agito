'use strict';

var expect = require('chai').expect;

describe('Agito#use()', function() {

  var use = require('../../lib/use');

  /*
   */
  it('should be a function', function() {
    expect(use).to.be.a('function');
  });

  /*
   */
  it('should register a new middleware', function() {
    var agito = {};
    use.call(agito, function middleware() {});

    expect(agito.middlewares).to.be.an.instanceof(Array);
    expect(agito.middlewares).to.have.length(1);
  });

});
