
var hello = require("./api/hello");
var expect = require("expect");
var assert = require("assert");

describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    })
  })
});


describe('Hello', function () {
  it('should call me back with world', function () {
    console.debug('hello', hello);
    new hello().greet(function (err, result) {
      expect(result).toBe("world")
    });
  })
});