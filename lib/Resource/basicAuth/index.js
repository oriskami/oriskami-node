module.exports    = function(options, next){
  var ubivar      = this.ubivar
    , isSecure    = ubivar.get("protocol") === "https"
    , token       = ubivar.get("access_token")
    , protocol    = !!isSecure ? require("https") : require("http") 
    , Error       = require("../../Error")

  if(!!token){
    return next(null, options)
  }

  var headers     = ubivar.get("headers")
    , opts        = ubivar.get("request")
    , content     = JSON.stringify({"grant_type":"client_credentials"}) 

  headers["Authorization"] = ubivar.get("auth") 
  headers["Content-Length"]= content.length 

  opts.headers    = headers
  opts.path       = "/token"
  opts.method     = "POST"

  this.log.info(__dirname, opts)

  var req         = (protocol).request(opts, function(res){
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
        } else {
          ubivar.set("access_token", json["access_token"])
          ubivar.set("token_type"  , json["token_type"]  )
          return next(null, options)
        }
      } catch (e) { // failed to parse the json
        err     = new Error.UbivarAPIError({
            "message"   : "Invalid JSON received from the Ubivar API"
          , "json"      : json
          , "exception" : e })
      }

      next(err, options)
    })
  })

  req.write(content)
}
