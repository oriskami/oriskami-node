var encode        = encodeURIComponent
  , isFunction    = function(x){ return typeof x === "function" }
  , toPath        = function(x){ 
    for(var path = "?"
          , keys = Object.keys(x)
          , i = 0 ; i < keys.length ; i++){ 
      path        += encode(keys[i]) + "=" + encode(x[keys[i]]) + "&"
    }
    return path
  }

/*
 * Resource factory wrapped within a Oriskami instance
 * @oriskami [Oriskami] the parent wrapping instance 
 * @resourceName [String] the name of the resource being instantiated 
 */
function Resource(oriskami, resourceName, resourcePath){
  this.name       = resourceName
  this.path       = "/" + resourcePath
  this.oriskami   = oriskami
}

/*
 * Create an instance of type resource
 * @data [object] object defining this new resource
 * @next [function] an optional callback
 */
Resource.prototype.create   = function(){
  var data        = arguments[0]
    , next        = isFunction(arguments[1]) ? arguments[1] : function(){} 
    , isUnsigned  = this.oriskami.get("unsigned")
    , path0       = this.path 
                  + (isUnsigned ? "?unsigned=true" : "")
  this.request.call(this, {"method": "POST", "data": data, "path": path0}, next)
}

/*
 * Retrieve a resource having a specific 'id'
 * @id [String, Number] resource id
 * @next [function] optional callback
 */
Resource.prototype.retrieve = function(){
  var nArgs       = arguments.length
    , next        = arguments[nArgs - 1]
    , isUnsigned  = this.oriskami.get("unsigned")
    , path0       = this.path
                  + (nArgs > 1  ? "/" + encode(arguments[0]) : "" )
                  + (nArgs > 2  ?       toPath(arguments[1]) : "?")
                  + (isUnsigned ?       "&unsigned=true"     : "" )
  this.request.call(this, {"method": "GET", "path": path0}, next)
}

/*
 * Update a resource having a specific 'id'
 * @id [String, Number] resource id
 * @data [Object] new attributes that update the resource
 * @next [function] optional callback
 */
Resource.prototype.update   = function(){
  var nArgs       = arguments.length 
    , idLast      = nArgs - 1 
    , data        = nArgs === 3 ? arguments[1] : arguments[0]
    , next        = isFunction(arguments[idLast]) ? arguments[idLast] : function(){}
    , isUnsigned  = this.oriskami.get("unsigned")
    , path0       = this.path
                  + (nArgs === 3 ? "/" + encode(arguments[0]) : "")
                  + (isUnsigned ?          "?unsigned=true"   : "")
  this.request.call(this, {"method": "POST", "data": data, "path": path0}, next)
}

/*
 * Delete a resource having a specific 'id'
 * @id [String, Number] resource id
 * @next [function] optional callback
 */
Resource.prototype.del      = function(){
  var nArgs       = arguments.length
    , next        = arguments[nArgs - 1]
    , isUnsigned  = this.oriskami.get("unsigned")
    , path0       = this.path
                  + (nArgs > 1 ? "/" + encode(arguments[0]) : "") 
                  + (nArgs ==3 ?       toPath(arguments[1]) : "?")
                  + (isUnsigned ?        "&unsigned=true"   : "" )
  this.request.call(this, {"method": "DELETE", "path": path0}, next)
}

/*
 * List resources 
 * @parameters [Object] query parameters to retrieve resources
 * @next [function] optional callback
 */
Resource.prototype.list     = function(){
  var nArgs       = arguments.length
    , next        = arguments[nArgs - 1] 
    , parameters  = nArgs === 1 ? {} : arguments[0]
    , isUnsigned  = this.oriskami.get("unsigned")
    , path0       = this.path
                  + (isUnsigned ? "?unsigned=true"   : "" )
  this.request.call(this, {"method": "GET", "data": parameters, "path": path0}, next)
}

/*
 * Summary a resource 
 * @parameters [Object] query parameters to retrieve resources
 * @next [function] optional callback
 */
Resource.prototype.summary     = function(){
  var args        = arguments
    , parameters  = !isFunction(args[0]) ? args[0] : {}
    , next        =  isFunction(args[0]) ? args[0] : isFunction(args[1]) ? args[1] : function(){}
    , path0       = this.path 
                  + "/summary"
  this.request.call(this, {"method": "GET", "data": parameters, "path": path0}, next)
}

/*
 * Generic handlers:
 */
Resource.prototype.error    = require("./error")
Resource.prototype.request  = require("./request")
Resource.prototype.response = require("./response")
Resource.prototype.socket   = require("./socket")
Resource.prototype.timeout  = require("./timeout")

module.exports = Resource
