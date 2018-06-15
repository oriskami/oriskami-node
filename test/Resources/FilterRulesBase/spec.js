var _                 = require("lodash")
  , async             = require("async")
  , expect            = require("chai").expect
  , oriskami          = require("../../oriskami")
  , examples          = require("../../data/Event")
  , L                 = require("../../L")
  , methods           = ["retrieve", "update", "list"]
  , resourceName      = "FilterRulesBase"

describe(resourceName, function(){
  describe("Properties", function(){
    it("Should have a name and path attribute", function() { expect(oriskami[resourceName]["path"]).to.exist})
    it("Should link to parent (oriskami)"     , function() { expect(oriskami[resourceName]["oriskami"]).to.exist })
    _.each(methods, function(method){
      it("should have " + method + " methods", function(done) {
        _.isFunction(oriskami[resourceName][method])? done() : done(new error("err_missing_" + method))
      })
    })
  })

  describe("Methods", function(){
    it("Should list"  , function(done){oriskami[resourceName].list(done) })
    it("Should update", function(done){
      var ruleId = "0"
      async.waterfall([
        function(     next){ oriskami[resourceName].update(ruleId, {"is_active": "true"}, next) }
      , function(res, next){ 
        var rule = res.data[ruleId]
        rule && rule.is_active == "true" ? next(null, ruleId) : next(new Error("err_updating_1")) 
      }, function(res, next){ oriskami[resourceName].update(ruleId, {"is_active": "false"}, next)}
      ], L.logError(done))
    })
  })
})
