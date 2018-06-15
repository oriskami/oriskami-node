var Resource            = require("../Resource")
  , jwt                 = require("jsonwebtoken")
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
  this.set("host", "api.oriskami.com")
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
  if(key === "host") { 
    this._api.request.host = value 
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


/*
 * Webhook validation middleware 
 * @params [Object] Parameters determining how the validator behaves
 *         + validate [Boolean] Whether the webhook should be validated
 */
Oriskami.prototype.webhook = function(params){ 
  var shouldValidate= params && params.validate 
    , publicKey     = this._api.public_key

  if(!publicKey){
    console.log("Public key missing—tip: call oriskami.getPublicKey(next)")
    return new Error("err_missing_public_key")
  }

  return function(req, res, next) {
    var token       = req.body ? req.body.token : null
    if(!token)  return res.status(400).send({"success": "false", "err": "err_missing_token"})
    jwt.verify(token, publicKey, function(err, json){
      if(err) next(err)
      req.json      = json 
      next()
    }) 
  }
}

/*
 * Retrieve Oriskami's public key 
 * @next [Function] Callback 
 */
Oriskami.prototype.getPublicKey = function(next){
  var self          = this
    , https         = require("https")
    , opts          = {"path": "/public-key", "method": "GET"} 
  opts.headers      = oriskami.get("headers")

  var req           = https.request(opts, function(res){
    var publicKey   = ""
    res.setEncoding("utf8")
    res.on("data", function(chunk){ publicKey += chunk })
    res.on("end" , function(){ 
      self._api.public_key = publicKey 
      next(null, true)
    })
  })

  req.on("error", function(err){ next(err) })
  req.end()
}


module.exports = Oriskami
