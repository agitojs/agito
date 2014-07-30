'use strict';

var chai = require('chai');
var expect = chai.expect;

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
    var agito = { _middlewares: [] };
    use.call(agito, function middleware() {});

    expect(agito._middlewares).to.be.an.instanceof(Array);
    expect(agito._middlewares).to.have.length(1);
  });

  /*
   */
  it('should support several consecutive calls', function() {
    var agito = { _middlewares: [] };
    var ret = use.call(
      use.call(agito, function middlewareA() {}),
      function middlewareB() {}
    );

    expect(ret).to.deep.equal(agito);
    expect(ret._middlewares).to.have.length(2);
  });

  /*
   */
  it('should throw if the middleware attribute is not an array or undefined', function() { // jshint ignore:line
    var agito = {};

    expect(function() {
      agito.use();
    }).to.throw();
  });

});
