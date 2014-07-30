'use strict';

var chai = require('chai');
var expect = chai.expect;

var AgitoMock = require('./mocks/Agito');

describe('Agito#use()', function() {

  var agito;
  var use = require('../../lib/use');

  beforeEach(function() {
    agito = AgitoMock.create();
  });

  /*
   */
  it('should be a function', function() {
    expect(use).to.be.a('function');
  });

  /*
   */
  it('should register a new middleware', function() {
    var middleware = function() {};
    use.call(agito, middleware);

    expect(agito._middlewares).to.be.an.instanceOf(Array);
    expect(agito._middlewares).to.have.length(1);
    expect(agito._middlewares).to.include(middleware);
  });

  /*
   */
  it('should support several consecutive calls', function() {
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
    agito._middlewares = null;

    expect(function() {
      agito.use();
    }).to.throw();
  });

});
