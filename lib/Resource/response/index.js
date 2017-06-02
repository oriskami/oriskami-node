/*
 * Request response handler
 * @req [Object] the submitted request 
 * @next [function] an optional callback
 */
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
        json                  = JSON.parse(json)
        var code              = parseInt(res.statusCode)
          , isUnauthenticated = code === 401
          , isOk              = code >= 200 && code <= 204

        if (isUnauthenticated) {
          err   = new Error.UbivarAuthenticationError(json)
        } else if(!isOk){
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

    res.on("error", function(err){
      err       = new Error.UbivarAPIError({
          "message"   : "Error processing the response from Ubivar."
        , "json"      : json
        , "exception" : err })

      next(err, json)
    })
  }
}
