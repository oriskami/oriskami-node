/*
 * Error handler 
 * @req [Object] the request
 * @next [function] an optional callback
 */
module.exports  = function(req, next) {
  var self      = this
    , Error     = require("../../Error")

  return function(error) {
    if (req._isAborted){
      return
    }

    next.call(self
    , new Error.UbivarConnectionError({
      "message"   : "An error occurred with the connection to Ubivar"
    , "detail"    : error })
    , null)
  }
}
