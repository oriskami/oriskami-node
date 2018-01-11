/*
 * Generic request mechanism
 * @options [Object] parameters of the request
 * @next [function] optional, called on response or timeout
 */
module.exports  = function(options, next){
  var content   = !!options.data ? JSON.stringify(options.data) : "{}"
    , oriskami  = this.oriskami
    , opts      = oriskami.get("request")
    , timeout   = oriskami.get("timeout")
    , protocol  = require("https") 
    , self      = this
    , req

  opts.path     = options.path
  opts.method   = options.method
  opts.headers  = oriskami.get("headers")
  opts.headers["Authorization"]  = "Bearer " + oriskami.get("auth")
  opts.headers["Content-Length"] = Buffer.byteLength(content) 

  req           = (protocol).request(opts)
  req.setTimeout(timeout, self.timeout(timeout,req, next))
  req.on("response"     , self.response(       req, next))
  req.on("socket"       , self.socket(content, req, next))
  req.on("error"        , self.error(          req, next))
}
