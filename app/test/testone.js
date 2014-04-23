require("mocha");
var expect = require("expect");
var assert = require("assert");

console.log('mocha', mocha);

    mocha.setup('bdd')
    mocha.checkLeaks();
    mocha.globals(['jQuery','Application']);



describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    })
  })
});


    mocha.run();
