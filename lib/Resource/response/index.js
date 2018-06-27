/*
 * Request response handler
 * @req [Object] the submitted request 
 * @next [function] an optional callback
 */
module.exports    = function(req, next) {
  var jwt         = require("jsonwebtoken")
    , https       = require("https")
    , self        = this
    , publicKey   = this.oriskami._api.public_key
    , Error       = require("../../Error")

  return function(res) {
    var body      = ""

    res.setEncoding("utf8")

    res.on("data" , function(chunk) { body += chunk })
    res.on("end"  , function() {
      var err
        , json    = {"success": "false", "data": null, "err": "err_internal"}
        , code    = parseInt(res.statusCode)
        , callback= function(err, json) { 
          json      = json || {}
          json.status_code = code
          next(err, json) 
        }

           if(code === 500) err = new Error.OriskamiInternalServerError(json)
      else if(code === 502) err = new Error.OriskamiBadGatewayError(json)
      else if(code  >  500) err = new Error.OriskamiAPIError(json)
      try { // to parse the json
        json                    = JSON.parse(body)
        if(code === 401 ) err   = new Error.OriskamiUnauthorizedError(json)
        if(code === 402 ) err   = new Error.OriskamiPaymentRequiredError(json)
        if(code === 405 ) err   = new Error.OriskamiMethodNotAllowedError(json)
        if(code === 429 ) err   = new Error.OriskamiTooManyRequestsError(json)
        if(code  <  200 ) err   = new Error.OriskamiError.generate(json)
        if(code  >= 300 && code < 400) err = new Error.OriskamiError.generate(json)
      } catch (e) { // failed to parse the json
        json.err= e.message
        err     = new Error.OriskamiAPIError(json)
      }

      if(json.token && publicKey){ 
        jwt.verify(json.token, publicKey, callback) 
      } else if(json.token && !publicKey){
        var req = https.get("https://api.oriskami.com/public-key", function(res){
          var pkey      = ""
          res.setEncoding("utf8")
          res.on("data", function(chunk){ pkey += chunk })
          res.on("end" , function(){ 
            self.oriskami._api.public_key = pkey 
            jwt.verify(json.token, pkey, callback) 
          })
        }).on("error", callback).end()
      } else {
        callback(err, json)
      }
    })

    res.on("error", function(err){
      err       = new Error.OriskamiAPIError({"success": "false", "data": null, "err": err.message})
      next(err, json)
    })
  }
}
