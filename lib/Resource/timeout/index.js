/*
 * Timeout handler 
 * @timeout [Number] in ms 
 * @req [Object] the request
 * @next [function] an optional callback
 */
module.exports  = function(timeout, req, next) {
  var self      = this
    , Error     = require("../../Error")

  return function() {
    var timeoutErr  = new Error("ETIMEDOUT")
    timeoutErr.code = "ETIMEDOUT"

    req._isAborted  = true
    req.abort()

    next.call(self
    , new Error.OriskamiConnectionError({
      "message"   : "Request aborted due to timeout being reached (" + timeout + "ms)"
    , "detail"    : timeoutErr })
    , null)
  }
}
