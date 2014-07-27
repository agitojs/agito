'use strict';

var expect = require('chai').expect;

describe('Agito#use()', function() {

  var use = require('../../lib/use');

  it('should be a function', function() {
    expect(use).to.be.a('function');
  });

});
