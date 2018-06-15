var _                 = require("lodash")
  , expect            = require("chai").expect
  , async             = require("async")
  , L                 = require("../../L")
  , oriskami          = require("../../oriskami")
  , examples          = require("../../data/Event")
  , jsons             = _.map(examples, function(x){return {"id": x.id, "parameters": x}})
  , methods           = ["retrieve", "update", "del", "list"]
  , resourceName      = "EventLabel" 

describe(resourceName, function(){
  describe("Properties", function(){
    it("Should have a name and path attribute", function() { expect(oriskami[resourceName]["path"]).to.exist })
    it("Should link to parent (oriskami)"     , function() { expect(oriskami[resourceName]["oriskami"]).to.exist })

    _.each(methods, function(method){
      it("Should have " + method + " methods", function(done) {
        var hasMethod = _.isFunction(oriskami[resourceName][method])
        if(!hasMethod)  done(new Error("err_missing_method_" + method )) 
        else            done()
      })
    })
  })

  describe("Methods", function(){
    var json        = jsons[0] 
      , idResource  = json.id

    it("Should retrieve", function(done){
      async.waterfall([
        function(next){ oriskami[resourceName].retrieve(idResource, next)}
      , function(res, next){ 
        var isOk    = res.status_code >= 200 && res.status_code <= 204 && res.data.length
        isOk ? next(null, true) : next(new Error("err_retrieving"))
      }], L.logError(done))
    })

    it("Should update to 'false'", function(done){
      async.waterfall([
        function(     next){ oriskami[resourceName].update(idResource, {"id": idResource, "label": "is_loss", "value": "false"}, next)}
      , function(res, next){ 
        var isOk    = res.data.length === 1 && res.data[0].labels.is_loss === "false"
        isOk ? next(null, true) : next(new Error("err_updating"))
      }], L.logError(done))
    })

    it("Should update to 'true'", function(done){
      async.waterfall([
        function(     next){ oriskami[resourceName].update(idResource, {"id": idResource, "label": "is_loss", "value": "true"}, next) }
      , function(res, next){ 
        var isOk    = res.data.length === 1 && res.data[0].labels.is_loss === "true"
        isOk ? next(null, true) : next(new Error("err_updating"))
      }], L.logError(done))
    })

    it("Should delete", function(done){
      async.waterfall([
        function(     next){ oriskami[resourceName].del(idResource, next)  }
      , function(res, next){ 
        var isOk    = res.data.length === 1 && res.data[0].labels.is_loss === undefined
        isOk ? next(null, true) : next(new Error("err_deleting"))
      }], L.logError(done))
    })

    it("Should list", function(done){
      async.waterfall([
        function(     next){ oriskami[resourceName].list(next) }
      , function(res, next){ 
        var isOk    = res.data.length === 3 && _.contains(_.keys(res.data[0]), "labels")
        isOk ? next(null, true) : next(new Error("err_listing"))
      }], L.logError(done))
    })
  })
})
