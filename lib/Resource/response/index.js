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
          , isOk              = code >= 200 && code <= 204

               if(code === 401){ err = new Error.UbivarUnauthorizedError(json)
        } else if(code === 402){ err = new Error.UbivarPaymentRequiredError(json)
        } else if(code === 405){ err = new Error.UbivarMethodNotAllowedError(json)
        } else if(code === 429){ err = new Error.UbivarTooManyRequestsError(json)
        } else if(code === 500){ err = new Error.UbivarInternalServerError(json)
        } else if(code === 502){ err = new Error.UbivarBadGatewayError(json)
        } else if(code  >  500){ err = new Error.UbivarAPIError(json)
        } else if(!isOk       ){ err = new Error.UbivarError.generate(json)
        }
      } catch (e) { // failed to parse the json
        err     = new Error.UbivarAPIError({
            "message"   : "Invalid JSON received from the Ubivar API"
          , "json"      : json
          , "exception" : e 
        })
      }

      next(err, json)
    })

    res.on("error", function(err){
      err       = new Error.UbivarAPIError({
          "message"   : "Error processing the response from Ubivar."
        , "json"      : json
        , "exception" : err 
      })

      next(err, json)
    })
  }
}
