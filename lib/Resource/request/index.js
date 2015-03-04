/*
 * Generic request mechanism
 * @options [Object] parameters of the request
 * @next [function] optional, called on response or timeout
 */
module.exports  = function(options, next){
  var content   = !!options.data ? JSON.stringify(options.data) : "{}"
    , ubivar    = this.ubivar
    , isSecure  = ubivar.get("protocol") === "https"
    , opts      = ubivar.get("request")
    , timeout   = ubivar.get("timeout")
    , protocol  = !!isSecure ? require("https") : require("http") 
    , self      = this
    , req

  opts.path     = options.path
  opts.method   = options.method
  opts.headers  = ubivar.get("headers")
  opts.headers["Authorization"]  = "Bearer " + ubivar.get("auth")
  opts.headers["Content-Length"] = content.length 

  req           = (protocol).request(opts)
  req.setTimeout(timeout, self.timeout(timeout, req, next))
  req.on("response"     , self.response(req, next))
  req.on("socket"       , self.socket(ubivar, content, req))
}
