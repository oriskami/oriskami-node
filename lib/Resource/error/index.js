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
    , new Error.OriskamiConnectionError({
      "message"   : "An error occurred with the connection to Oriskami"
    , "detail"    : error })
    , null)
  }
}
