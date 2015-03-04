var path                = require("path")
  , fs                  = require("fs")
  , bunyan              = require("bunyan")
  , _                   = require("lodash")

/*
 * Ubivar factory
 * + a token (required)
 * + an optional api version (default to latest)
 */
function Ubivar(token, version){
  var http              = require("http")
    , pathPackage       = "../../package.json" 
    , pathFingerprints  = '../../data/blacklisted_fingerprints'
    , theTimeout        = http.createServer().timeout 
    , theVersion        = version || "latest" 
    , theName           = "Ubivar/v1 NodeBindings/" + theVersion 
    , theResources      = ["accounts","transactions","orders","login","logout","items","labels","fx"]
    , theRevokedCerts   = fs.readFileSync(path.join(__dirname, pathFingerprints)
      , 'utf8').replace(/^\s+|\s+$/g, '').split('\n')

  this._api = {
      "protocol"        : "https" 
    , "timeout"         : theTimeout 
    , "resources"       : theResources 
    , "revokedCerts"    : theRevokedCerts 
    , "headers"         : {
        "Accept"        : "application/json"
      , "Content-Type"  : "application/json"
      , "Ubivar-Version": theVersion 
      , "User-Agent"    : theName 
    },"request"         : {
        "host"          : "api.ubivar.com"
      , "port"          : "443"
      , "version"       : theVersion
      , "ciphers"       : "DEFAULT:!aNULL:!eNULL:!LOW:!EXPORT:!SSLv2:!MD5" }} 

  this.set("auth", token)
  this.log = bunyan.createLogger({ "name": theName})
}

/*
 * GET an attribute of an Ubivar object
 * + the key of that attribute
 */
Ubivar.prototype.get = function(key       ){ return this._api[key] }

/*
 * SET an attribute of an Ubivar object
 * + the key of that attribute
 * + the value (string, number, object) of that attribute 
 */
Ubivar.prototype.set = function(key, value){ 
  if(key === "timeout" && value === null){
    value = (require("http")).createServer().timeout
  }
  this._api[key] = value
}

// Export the 'Ubivar' factory
module.exports = Ubivar
