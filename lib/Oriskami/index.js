var path                = require("path")
  , fs                  = require("fs")
  , _                   = require("lodash")
  , Resource            = require("../Resource")

/*
 * Wrapper factory of the Oriskami API client 
 * @token [String] required obtained from admin interface 
 * @version [String] default to 'latest'
 */
function Oriskami(token, version, resources){
  var http              = require("http")
    , pathPackage       = "../../package.json" 
    , pathFingerprints  = '../../data/blacklisted_fingerprints'
    , theTimeout        = http.createServer().timeout 
    , theVersion        = version || "*" 
    , theName           = "Oriskami/v1 NodeBindings/" + theVersion 
    , theRevokedCerts   = fs.readFileSync(path.join(__dirname, pathFingerprints)
      , 'utf8').replace(/^\s+|\s+$/g, '').split('\n')

  this._api = {
      "protocol"        : "https" 
    , "timeout"         : theTimeout 
    , "resources"       : resources 
    , "revokedCerts"    : theRevokedCerts 
    , "headers"         : {
        "Accept"        : "application/json"
      , "Content-Type"  : "application/json"
      , "Accept-Version": theVersion.replace("\n","") 
      , "User-Agent"    : theName.replace("\n","") 
    },"request"         : {
        "host"          : "api.oriskami.com"
      , "port"          : "443"
      , "version"       : theVersion
      , "ciphers"       : "DEFAULT:!aNULL:!eNULL:!LOW:!EXPORT:!SSLv2:!MD5" }} 

  this.set("auth", token)
}

/*
 * Accessor (GET) function for the Oriskami wrapper
 * @key [String] name of the private attribute 
 */
Oriskami.prototype.get = function(key       ){ return this._api[key] }

/*
 * Accessor (SET) function for the Oriskami wrapper
 * @key [String] name of the private attribute 
 * @value [String, number, object] attribute value 
 */
Oriskami.prototype.set = function(key, value){ 
  if(key === "timeout" && value === null){
    value = (require("http")).createServer().timeout
  }
  this._api[key] = value
}

/*
 * Extend function to add resources to 'this' running instance 
 * @resource [String] name of the resource to add 
 */
Oriskami.prototype.extend = function(resourceName, resourcePath){
  this[resourceName] = new Resource(this, resourceName, resourcePath)
}

/*
 * Export the wrapper factory of Oriskami
 */
module.exports = Oriskami
