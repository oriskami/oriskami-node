var _             = require("lodash")
  , fs            = require("fs")

/*
 * Ubivar.Resource factory
 * + the parent object (ubivar) of the resource (required) 
 * + the name of the resource (required) 
 */
function Resource(ubivar, resourceName){
  this.name       = resourceName
  this.path       = "/" + resourceName
  this.ubivar     = ubivar
  this.log        = ubivar.log
}

/*
 * Create an instance of type resource
 * + a data object defining this new resource
 * + an optional callback
 */
Resource.prototype.create   = function(data, next){
  this.request.call(this, {"method": "POST"
  , "data"  : data
  , "path"  : this.path
  }, function(err, res){ next(err, res) })
}

/*
 * Retrieve a resource having a specific 'id'
 * + the 'id' of that resource
 * + an optional callback
 */
Resource.prototype.retrieve = function(id, next){
  this.request.call(this, {"method": "GET"
  , "path"  : this.path + "/" + id
  }, function(err, res){ next(err, res) })
}

/*
 * Update a resource having a specific 'id'
 * + the 'id' of that resource
 * + the new 'data' attributes that will update this resource
 * + an optional callback
 */
Resource.prototype.update   = function(id, data, next){
  this.request.call(this, {"method": "POST"
  , "data"  : data
  , "path"  : this.path + "/" + id
  }, function(err, res){ next(err, res) })
}

/*
 * Delete a resource having a specific 'id'
 * + the 'id' of that resource
 * + an optional callback
 */
Resource.prototype.del      = function(id, next){
  this.request.call(this, {"method": "DELETE"
  , "path"  : this.path + "/" + id
  }, function(err, res){ next(err, res) })
}

/*
 * List resources given the query 'parameters'
 * + the 'parameters' defining the retrieval query (e.g. start_after, end_before)
 * + an optional callback
 */
Resource.prototype.list     = function(parameters, next){
  this.request.call(this, {"method": "GET"
  , "data"  : parameters
  , "path"  : this.path
  }, function(err, res){ next(err, res) })
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

// Export the 'Resource' factory
module.exports = Resource
