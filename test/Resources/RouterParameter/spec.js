var _                 = require("lodash")
  , async             = require("async")
  , expect            = require("chai").expect
  , oriskami          = require("../../oriskami")
  , L                 = require("../../L")
  , methods           = ["update","list"]
  , resourceName      = "RouterParameter"

describe(resourceName, function(){
  describe("Properties", function(){
    it("Should have a name and path attribute", function() { expect(oriskami[resourceName]["path"]).to.exist})
    it("Should link to parent (oriskami)"     , function() { expect(oriskami[resourceName]["oriskami"]).to.exist})
    _.each(methods, function(method){
      it("Should have "+ method +" method", function(done) {
        var hasMethod = _.isFunction(oriskami[resourceName][method])
        hasMethod ? done() :  done(new Error("err_missing_method_" + method))
      })
    })
  })

  describe("Methods", function(){
    it("Should list"  , function(done){ oriskami[resourceName].list(L.logError(done))})
    it("Should update", function(done){
      var ruleId      = "0"
      async.waterfall([
        function(     next){ oriskami[resourceName].update(ruleId, {"f_cogs": "0.25"}, next) }
      , function(res, next){ 
        var rule      = res.data[ruleId] 
          , isValueOk = rule.f_cogs === "0.25"
        isValueOk ? oriskami[resourceName].update(ruleId, {"f_cogs": "0.50"}, next) : next(new Error("err_invalid_router_parameter_value")) 
      }], L.logError(done))
    }).timeout(20000)
  })
})
