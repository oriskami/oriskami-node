var _                 = require("lodash")
  , async             = require("async")
  , expect            = require("chai").expect
  , L                 = require("../../L")
  , oriskami          = require("../../oriskami")
  , examples          = require("../../data/Event")
  , jsons             = _.map(examples, function(x){return {"id": x.id, "parameters": x}})
  , methods           = ["retrieve", "list"]
  , resourceName      = "EventNotification"

describe(resourceName, function(){
  describe("Properties", function(){
    it("Should have a name and path attribute", function(){ expect(oriskami[resourceName]["path"]).to.exist })
    it("Should link to parent (oriskami)"     , function(){ expect(oriskami[resourceName]["oriskami"]).to.exist })
    _.each(methods, function(method){
      it("Should have " + method + " methods", function(done) {
        _.isFunction(oriskami[resourceName][method]) ? done() :  done(new Error("err_missing_method_" + method))
      })
    })
  })

  describe("Methods", function(){
    var json        = jsons[0] 
      , idResource  = json.id

    it("Should retrieve", function(done){
      async.waterfall([
        function(     next){ oriskami[resourceName].retrieve(idResource, next) }
      , function(res, next){
        var isOk    = res.status_code >= 200 && res.status_code <= 204 && res.data.length >= 0
        isOk ? next(null, true) : next(new Error("err_retrieving"))
      }], L.logError(done))
    })

    it("Should list", function(done){
      async.waterfall([
        function(     next){ oriskami[resourceName].list(next)}
      , function(res, next){ 
        var isOk  = res.data.length === 3 && _.contains(_.keys(res.data[0]), "notifications")
        isOk ? next(null, true) : next(new Error("err_list"))
      }], L.logError(done))
    })
  })
})
