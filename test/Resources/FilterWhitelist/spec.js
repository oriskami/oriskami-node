var _                 = require("lodash")
  , async             = require("async")
  , expect            = require("chai").expect
  , L                 = require("../../L")
  , oriskami          = require("../../oriskami")
  , examples          = require("../../data/Event")
  , methods           = ["retrieve", "update", "del", "list"]
  , resourceName      = "FilterWhitelist"
  , json              = { 
    "value"           : "New Value"
  , "feature"         : "email_domain"
  , "description"     : "abc@gmail.com"
  , "is_active"       : "true"
  }

describe(resourceName, function(){
  describe("Properties", function(){
    it("Should have a name and path attribute", function() { expect(oriskami[resourceName]["path"]).to.exist})
    it("Should link to parent (oriskami)"     , function() { expect(oriskami[resourceName]["oriskami"]).to.exist })
    _.each(methods, function(method){
      it("Should have " + method + " methods", function(done) {
        var hasMethod = _.isFunction(oriskami[resourceName][method])
        hasMethod ? done() : done(new Error("err_missing_method_" + method)) 
      })
    })
  })

  describe("Methods", function(){
    it("Should create, list, and delete", function(done){
      var nWhitelists0
      async.waterfall([
        function(     next){ oriskami[resourceName].create(json, next) }
      , function(res, next){ 
        var whitelist = res.data.reverse()[0]
          , isEqual   = _.reduce(_.keys(json), function(memo, k){ return memo && json[k] === whitelist[k] }, true)
        isEqual ? next(null, true) : next(new Error("err_creating"))
      },function(res, next){ oriskami[resourceName].list(next) } 
      , function(res, next){  
        nWhitelists0 = res.data.length 
        oriskami[resourceName].del(nWhitelists0 - 1, next) 
      }, function(res, next){ res.data.length == nWhitelists0 - 1 ? next(null, true) : next(new Error("err_deleting")) }
      ], L.logError(done))
    }).timeout(20000)

    it("Should update", function(done){
      var whitelistId = "0"
      async.waterfall([
        function(     next){oriskami[resourceName].update(whitelistId, {"value": "yahoo.com"}, next)}
      , function(res, next){ 
        var whitelist = res.data[whitelistId]
        whitelist.value === "yahoo.com" ? next(null, true) : next(new Error("err_updating"))
      }, function(res, next){  oriskami[resourceName].update(whitelistId, {"value": "gmail.com"}, next) 
      }], L.logError(done))
    })
  })
})
