var _                 = require("lodash")
  , async             = require("async")
  , expect            = require("chai").expect
  , L                 = require("../../L")
  , oriskami          = require("../../oriskami")
  , methods           = ["create", "retrieve", "update", "del", "list"]
  , resourceName      = "FilterScoringsDedicated"

describe(resourceName, function(){
  describe("Properties", function(){
    it("Should have a name and path attribute", function() { expect(oriskami[resourceName]["path"]).to.exist })
    it("Should link to parent (oriskami)"     , function() { expect(oriskami[resourceName]["oriskami"]).to.exist })
    _.each(methods, function(method){
      it("Should have " + method + " methods", function(done) {
        var hasMethod = _.isFunction(oriskami[resourceName][method])
        hasMethod ? done() : done(new Error("err_missing_filter_scorings_dedicated_method_" + method))
      })
    })
  })

  describe("Methods", function(){
    it("Should list"  , function(done){ oriskami[resourceName].list(L.logError(done)) })
    it("Should create", function(done){
      oriskami[resourceName].create({
        "query_target"      : "sample:100" 
      , "query_base"        : "fr" 
      , "features"          : "all" 
      }, L.logError(done))
    })

    it("Should create and retrieve", function(done){
      var expectedScoreId 
      async.waterfall([
        function(next){ oriskami[resourceName].create({
          "query_target"    : "sample:100" 
        , "query_base"      : "fr" 
        , "features"        : "all" 
        }, next)
      }, function(res, next) {
        expectedScoreId = res.model_id
        oriskami[resourceName].retrieve(expectedScoreId, next)
      }], L.logError(done))
    })

    xit("Should update status [TODO]", function(done){
      async.waterfall([
        function(     next){ oriskami[resourceName].create({"is_active": "false"}, next)}
      , function(res, next){ 
        var isOk  = res.data.is_active === "false" 
        isOk ? oriskami[resourceName].update({"is_active": "true"}, next) : next(new Error("err_creating_filter_scorings_dedicated"))
      }, function(res, next){
        var isOk  = res.data.is_active === "true" 
        isOk ? next() : next(new Error("err_updating"))
      }], L.logError(done))
    })
  })
})
