var _             = require("lodash")
  , fs            = require("fs")

/*
 * Resource factory wrapped within a Ubivar instance
 * @ubivar [Ubivar] the parent wrapping instance 
 * @resourceName [String] the name of the resource being instantiated 
 */
function Resource(ubivar, resourceName){
  this.name       = resourceName
  this.path       = "/" + resourceName
  this.ubivar     = ubivar
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
  }, function(err, res){ 
    console.log(err, res)
    next(err, res) 
  })
}

/*
 * Retrieve a resource having a specific 'id'
 * @id [String, Number] resource id
 * @next [function] optional callback
 */
Resource.prototype.retrieve = function(){
  if(arguments.length === 2){
    var id        = arguments[0]
      , next      = arguments[1]
  } else {
    var next      =  _.isFunction(arguments[0]) ? arguments[0] : function(){}
      , id        = !_.isFunction(arguments[0]) ? arguments[0] : ""
  }

  this.request.call(this, {
    "method"      : "GET"
  , "path"        : this.path + "/" + id
  }, function(err, res){ 
    next(err, res) 
  })
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
  }, function(err, res){ 
    next(err, res) 
  })
}

/*
 * Delete a resource having a specific 'id'
 * @id [String, Number] resource id
 * @next [function] optional callback
 */
Resource.prototype.del      = function(){
  var nArgs       = arguments.length
    , id          = nArgs === 2 ? arguments[0] : ""
    , next        = nArgs === 2 ? arguments[1] : arguments[0]

  this.request.call(this, {
    "method"      : "DELETE"
  , "path"        : this.path + "/" + id 
  }, function(err, res){ 
    next(err, res) 
  })
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
  }, function(err, res){ 
    next(err, res) 
  })
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
  }, function(err, res){ 
    next(err, res) 
  })
}

/*
 * Generic mechanisms to handle:
 * - a request, 
 * - a socket,
 * - a response, 
 * - a timeout
 */
_.each(fs.readdirSync(__dirname), function(name){
  var isReserved= name[0] === "." 
    , folder    = [__dirname, name].join("/")  
  if(!isReserved && fs.statSync(folder).isDirectory()){
    Resource.prototype[name] = require(folder)
  }
})

/*
 * Export the Resource factory
 */
module.exports = Resource
