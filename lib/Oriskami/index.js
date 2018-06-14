var Resource            = require("../Resource")
  , bindingName         = "Oriskami/v1 NodeBindings/"
  , httpTimeout         = 120000

/*
 * Wrapper factory of the Oriskami API client 
 * @token [String] required obtained from admin interface 
 * @version [String] default to 'latest'
 */
function Oriskami(token, version, resources){
  version               = version || "*"

  this._api = {
      "protocol"        : "https" 
    , "timeout"         : httpTimeout 
    , "resources"       : resources 
    , "revokedCerts"    : "" 
    , "headers"         : {
        "Accept"        : "application/json"
      , "Content-Type"  : "application/json"
      , "Accept-Version": version.replace("\n","") 
      , "User-Agent"    : (bindingName + version).replace("\n","") 
    },"request"         : {
        "port"          : "443"
      , "version"       : version 
      , "ciphers"       : "DEFAULT:!aNULL:!eNULL:!LOW:!EXPORT:!SSLv2:!MD5" }
    }

  this.set("auth", token)
  this.set("api_host", "api.oriskami.com")
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
  if(key === "api_host") { 
    this._api.request.api_host = value 
  } else {
    value = key === "timeout" ? value || httpTimeout : value
    this._api[key] = value
  }
}

/*
 * Extend function to add resources to 'this' running instance 
 * @resource [String] name of the resource to add 
 */
Oriskami.prototype.extend = function(resourceName, resourcePath){
  this[resourceName] = new Resource(this, resourceName, resourcePath)
}

module.exports = Oriskami
