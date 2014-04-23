var $ = require("jquery");

var c = require('./class');
var c2 = require('coffee!./class2.coffee');

console.log("required jquery", $);

$('#h1').html(new c().title);

new c2(function (data) {
  $(document.body).append(data);
});
