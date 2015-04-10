var path                = require("path")
  , fs                  = require("fs")
  , _                   = require("lodash")
  , RESOURCES           = [
      "accounts"
    , "transactions"
    , "orders"
    , "login"
    , "logout"
    , "items"
    , "labels"
    , "uptime"
    , "ci"
    , "geoip"
    , "fx"
    , "bins"
    , "me"
  ]

/*
 * Wrapper factory of the Ubivar API client 
 * @token [String] required obtained from admin interface 
 * @version [String] default to 'latest'
 */
function Ubivar(token, version){
  var http              = require("http")
    , pathPackage       = "../../package.json" 
    , pathFingerprints  = '../../data/blacklisted_fingerprints'
    , theTimeout        = http.createServer().timeout 
    , theVersion        = version || "latest" 
    , theName           = "Ubivar/v1 NodeBindings/" + theVersion 
    , theRevokedCerts   = fs.readFileSync(path.join(__dirname, pathFingerprints)
      , 'utf8').replace(/^\s+|\s+$/g, '').split('\n')

  this._api = {
      "protocol"        : "https" 
    , "timeout"         : theTimeout 
    , "resources"       : RESOURCES 
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
}

/*
 * Accessor (GET) function for the Ubivar wrapper
 * @key [String] name of the private attribute 
 */
Ubivar.prototype.get = function(key       ){ return this._api[key] }

/*
 * Accessor (SET) function for the Ubivar wrapper
 * @key [String] name of the private attribute 
 * @value [String, number, object] attribute value 
 */
Ubivar.prototype.set = function(key, value){ 
  if(key === "timeout" && value === null){
    value = (require("http")).createServer().timeout
  }
  this._api[key] = value
}

/*
 * Export the wrapper factory of Ubivar
 */
module.exports = Ubivar
