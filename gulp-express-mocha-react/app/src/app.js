var $ = require("jquery");

var c = require('./class');
var c2 = require('coffee!./class2.coffee');

console.log("required jquery", $);

$('#h1').html(new c().title);

$(document.body).append(new c2().myname);