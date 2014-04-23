$ = require("jquery")

module.exports = class ClassTwo
  myname: "Class Two"

  constructor:(callback)->
    $.get('/api', (data)->
      callback(data)
    )