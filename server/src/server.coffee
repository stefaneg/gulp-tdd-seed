console.debug = console.log

module.exports = (options)->
  express = require('express')
  server = express()
  options?.config?(server)

  staticRoot = options.staticRoot || './static'
  port = options.port || 5000

  server.use(express.static(staticRoot))

  server.get('/api', (req, res)->
    res.send('API is running again.')
  )

  httpserver = server.listen(port);
  console.log("Express server listening on port " + port + ", serving files in " + staticRoot);

  return server
