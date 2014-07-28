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

  /*
   */
  it('should support several consecutive calls', function() {
    var agito = {};
    var ret = use.call(
      use.call(agito, function middlewareA() {}),
      function middlewareB() {}
    );

    expect(ret).to.deep.equal(agito);
    expect(agito.middlewares).to.have.length(2);
  });

});
