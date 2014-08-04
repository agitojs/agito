'use strict';

var getEven = function(n) {
  return (n % 2) === 0 ? 'even' : 'odd';
};

var getSign = function(n) {
  if (n === 0) { return 'null'; }
  return (n > 0) ? 'positive' : 'negative';
};

describe('util', function() {

  var util = require('../../lib/util');

  it('should expose a `nestedGroupBy` method', function() {
    expect(util).to.respondTo('nestedGroupBy');
  });

  describe('#nestedGroupBy()', function() {

    var nestedGroupBy = util.nestedGroupBy;

    it('should return the collection untouched if no identities are provided', function() {
      var collection = [1, 2, 3];

      expect(nestedGroupBy(collection)).to.deep.equal(collection);
      expect(nestedGroupBy(collection, null)).to.deep.equal(collection);
      expect(nestedGroupBy(collection, [])).to.deep.equal(collection);
    });

    it('should group by the given identity', function() {
      var collection = [0, 1, 2, 3, 4, 5];
      var ret = nestedGroupBy(collection, getEven);

      expect(ret).to.deep.equal({
        even: [0, 2, 4],
        odd:  [1, 3, 5]
      });
    });

    it('should permit nested grouping', function() {
      var collection = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
      var ret = nestedGroupBy(collection, [getEven, getSign]);

      expect(ret).to.deep.equal({
        even: {
          negative: [-4, -2],
          null: [0],
          positive: [2, 4]
        },
        odd: {
          negative: [-5, -3, -1],
          positive: [1, 3, 5]
        }
      });
    });

    it('should allow grouping by key', function() {
      var collection = [
        { foo: '10' },
        { foo: '20' },
        { foo: '10' },
        { foo: '20' }
      ];
      var ret = nestedGroupBy(collection, 'foo');

      expect(ret).to.deep.equal({
        10: [{ foo: '10' }, { foo: '10' }],
        20: [{ foo: '20' }, { foo: '20' }]
      });
    });

  });

});
