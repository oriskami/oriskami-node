module.exports  = function(req, next) {
  var self      = this
    , Error     = require("../../Error")
  return function(res) {
    var json    = ""

    res.setEncoding("utf8")
    res.on("data", function(chunk) {
      json      += chunk
    })
    res.on("end", function() {
      var err   = null

      try { // to parse the json
        json    = JSON.parse(json)

        if (res.statusCode === 401) {
          err   = new Error.UbivarAuthenticationError(json)
        } else if(res.statusCode !== 200){
          err   = new Error.UbivarError.generate(json)
        }
      } catch (e) { // failed to parse the json
        err     = new Error.UbivarAPIError({
            "message"   : "Invalid JSON received from the Ubivar API"
          , "json"      : json
          , "exception" : e })
      }

      next(err, json)
    })
  }
}
