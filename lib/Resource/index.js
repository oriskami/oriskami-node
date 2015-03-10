var _             = require("lodash")
  , fs            = require("fs")

/*
 * FACTORY 
 */
function Resource(ubivar, resourceName){
  this.name       = resourceName
  this.path       = "/" + resourceName
  this.ubivar     = ubivar
  this.log        = ubivar.log
}

/*
 * PROTOTYPES 
 */
Resource.prototype.create   = function(data, next){
  this.request.call(this, {"method": "POST"
  , "data"  : data
  , "path"  : this.path
  }, function(err, res){ next(err, res) })
}

Resource.prototype.retrieve = function(id, next){
  this.request.call(this, {"method": "GET"
  , "path"  : this.path + "/" + id
  }, function(err, res){ next(err, res) })
}

Resource.prototype.update   = function(id, data, next){
  this.request.call(this, {"method": "POST"
  , "data"  : data
  , "path"  : this.path + "/" + id
  }, function(err, res){ next(err, res) })
}

Resource.prototype.del      = function(id, next){
  this.request.call(this, {"method": "DELETE"
  , "path"  : this.path + "/" + id
  }, function(err, res){ next(err, res) })
}

Resource.prototype.list     = function(parameters, next){
  this.request.call(this, {"method": "GET"
  , "data"  : parameters
  , "path"  : this.path
  }, function(err, res){ next(err, res) })
}

_.each(fs.readdirSync(__dirname), function(name){
  var isReserved= name[0] === "." 
    , folder    = [__dirname, name].join("/")  
  if(!isReserved && fs.statSync(folder).isDirectory()){
    Resource.prototype[name] = require(folder)
  }
})

module.exports = Resource
