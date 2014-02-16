(function() {
  console.log("Running server");

  require('./server')({
    port: 5000
  });

}).call(this);
