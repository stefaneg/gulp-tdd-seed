console.debug = console.log

module.exports = (options)->
  express = require('express')
  server = express()
  options?.config?(server)
  server.use(express.static('./dist/static'))
  port = options.port || 5000

  server.get('/api', (req, res)->
    res.send('API is running again.')
  )

  httpserver = server.listen(port);
  console.log("Express server listening on port " + port);

  return server
