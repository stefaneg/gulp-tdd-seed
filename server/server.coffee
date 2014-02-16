module.exports = (init)->
  express = require('express')
  server = express()
  init?(server)
  server.use(express.static('./dist/static'))
  return server