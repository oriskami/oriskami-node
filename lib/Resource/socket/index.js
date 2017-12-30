/*
 * Socket handler
 * @oriskami [Oriskami] the wrapping Oriskami instance 
 * @content [String] stringified content to be written on the socket
 * @req [Object] the request
 */
module.exports        = function(content, req, next){
  var self            = this
    , oriskami        = this.oriskami
    , Error           = require("../../Error")

  return function(socket) {
    var isSecure      = oriskami.get("protocol") === "https"
      , connect       = isSecure ? "secureConnect" : "connect"
      , revokedCerts  = oriskami.get("revokedCerts")

    socket.on(connect, function() {
      var fingerprint = socket.getPeerCertificate().fingerprint
        , isRevoked   = revokedCerts.indexOf(fingerprint) > -1
        , isUntrusted = isSecure && isRevoked

      if (isUntrusted) {
        req.abort()
        return next.call(self,
          new Error.OriskamiError({
            "message"     : "Revoked SSL Certificate"
          , "detail"      : "Invalid server certificate. You tried to connect to a server that has a revoked SSL certificate, which means we cannot securely send data to that server. Please email support@oriskami.com if you need help connecting to the correct API server."
          }))
      }

      req.write(content)
      req.end()
    })

    socket.on("error", function(err){
      req.abort()
      return next.call(self,
        new Error.OriskamiError({
          "message"     : "Socket connection error to Oriskami."
        , "detail"      : err 
        }))
    })
  }
}
