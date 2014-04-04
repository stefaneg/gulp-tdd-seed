$ = require("jquery")

module.exports = class ClassTwo
  myname: "Class Two"

  constructor:->
    console.debug('GET /api')
    $.get('/api', (data)->
      console.debug('got data', data)
    )