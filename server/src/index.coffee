staticRoot = process.env.STATIC_ROOT || "./static"

require('./server')({
  port:5000,
  staticRoot:staticRoot
})