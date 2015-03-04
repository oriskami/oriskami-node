/*
 * A timeout handler called on requests exceeding the set timeout
 * + a 'timeout' in ms
 * + the 'request'
 * + an optional callback
 */
module.exports  = function(timeout, req, callback) {
  var self      = this
    , Error     = require("../../Error")

  return function() {
    var timeoutErr  = new Error("ETIMEDOUT")
    timeoutErr.code = "ETIMEDOUT"

    req._isAborted  = true
    req.abort()

    callback.call(self
    , new Error.UbivarConnectionError({
      "message"   : "Request aborted due to timeout being reached (" + timeout + "ms)"
    , "detail"    : timeoutErr })
    , null)
  }
}
