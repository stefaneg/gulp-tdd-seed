console.debug = console.log

module.exports = (options)->
  express = require('express')
  server = express()
  server.use(express.static('./dist/static'))
  port = options.port || 5000
  httpserver = server.listen(port);
  console.log("Express server listening on port " + port);

  return httpserver
