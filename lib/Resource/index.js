var _             = require("lodash")
  , encode        = encodeURIComponent

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
    , next        = _.isFunction(arguments[1]) ? arguments[1] : function(){} 

  this.request.call(this, {
    "method"      : "POST"
  , "data"        : data
  , "path"        : this.path
  }, next)
}

/*
 * Retrieve a resource having a specific 'id'
 * @id [String, Number] resource id
 * @next [function] optional callback
 */
Resource.prototype.retrieve = function(){
  var nArgs       = arguments.length
    , path
  if(nArgs === 1){
    var id        = "" 
      , next      = arguments[0]
  } else if(nArgs === 2){
    var id        = arguments[0]
      , next      = arguments[1]
  } else if(nArgs === 3){
    id            = arguments[0]
    json          = arguments[1]
    next          = arguments[2]
    path          = _.reduce(_.keys(json), function(x, k){return x += encode(k) + "=" + encode(json[k]) + "&"}, "?")
  }

  this.request.call(this, {
    "method"      : "GET"
  , "path"        : this.path + "/" + encode(id) + (path ? path : "")
  }, next)
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
    , id          = nArgs === 3 ? arguments[0] : ""
    , data        = nArgs === 3 ? arguments[1] : arguments[0]
    , next        = _.isFunction(arguments[idLast]) ? arguments[idLast] : function(){}

  this.request.call(this, {
    "method"      : "POST"
  , "data"        : data
  , "path"        : this.path + "/" + id 
  }, next)
}

/*
 * Delete a resource having a specific 'id'
 * @id [String, Number] resource id
 * @next [function] optional callback
 */
Resource.prototype.del      = function(){
  var nArgs       = arguments.length
    , path
  if(nArgs === 1){
    id            = "" 
    next          = arguments[0]
  } else if(nArgs === 2){
    id            = arguments[0]
    next          = arguments[1]
  } else if(nArgs === 3){
    id            = arguments[0]
    json          = arguments[1]
    next          = arguments[2]
    path          = _.reduce(_.keys(json), function(x, k){return x += encode(k) + "=" + encode(json[k]) + "&"}, "?")
  }

  this.request.call(this, {
    "method"      : "DELETE"
  , "path"        : this.path + "/" + encode(id) + (path ? path : "")
  }, next)
}

/*
 * List resources 
 * @parameters [Object] query parameters to retrieve resources
 * @next [function] optional callback
 */
Resource.prototype.list     = function(){
  var args        = arguments
    , parameters  = !_.isFunction(args[0]) ? args[0] : {}
    , next        =  _.isFunction(args[0]) ? args[0] : _.isFunction(args[1]) ? args[1] : function(){}

  this.request.call(this, {
    "method"      : "GET"
  , "data"        : parameters
  , "path"        : this.path
  }, next)
}

/*
 * Summary a resource 
 * @parameters [Object] query parameters to retrieve resources
 * @next [function] optional callback
 */
Resource.prototype.summary     = function(){
  var args        = arguments
    , parameters  = !_.isFunction(args[0]) ? args[0] : {}
    , next        =  _.isFunction(args[0]) ? args[0] : _.isFunction(args[1]) ? args[1] : function(){}

  this.request.call(this, {
    "method"      : "GET"
  , "data"        : parameters
  , "path"        : this.path + "/summary"
  }, next)
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
