var _                 = require("lodash")
  , async             = require("async")
  , expect            = require("chai").expect
  , oriskami          = require("../../oriskami")
  , L                 = require("../../L")
  , methods           = ["update"]
  , resourceName      = "Filter"

describe(resourceName, function(){
  describe("Properties", function(){
    it("Should have a name and path attribute", function() { expect(oriskami[resourceName]["path"]).to.exist    })
    it("Should link to parent (oriskami)"     , function() { expect(oriskami[resourceName]["oriskami"]).to.exist})
    _.each(methods, function(method){
      it("Should have " + method + " methods", function(done) {
        var hasMethod = _.isFunction(oriskami[resourceName][method])
        hasMethod ? done() : done(new Error("err_missing_method_" + method))
      })
    })
  })

  describe("Methods", function(){
    it("Should list"  , function(done){ oriskami[resourceName].list(L.logError(done))})
    it("Should update", function(done){
      var ruleId = "0"
      async.waterfall([
        function(     next){ oriskami[resourceName].update(ruleId, {"is_active": "true"}, next) }
      , function(res, next){ 
        var rule  = res.data[ruleId]
          , isOk  = rule.is_active === "true"
        isOk ? next(null, true) : next(new Error("err_updating_1"))
      }, function(res, next){ oriskami[resourceName].update(ruleId, {"is_active": "false"} , next)
      }], L.logError(done))
    }).timeout(20000)
  })
})
