var _                 = require("lodash")
  , async             = require("async")
  , expect            = require("chai").expect
  , oriskami          = require("../../oriskami")
  , examples          = require("../../data/Event")
  , L                 = require("../../L")
  , methods           = ["retrieve", "update", "del", "list"]
  , resourceName      = "NotifierECommerce"

describe(resourceName, function(){
  describe("Properties", function(){
    it("Should have a name and path attribute", function() {expect(oriskami[resourceName]["path"]).to.exist})
    it("Should link to parent (oriskami)"     , function() { expect(oriskami[resourceName]["oriskami"]).to.exist})
    _.each(methods, function(method){
      it("Should have " + method + " methods", function(done) {
        var hasMethod = _.isFunction(oriskami[resourceName][method])
        hasMethod ? done() : done(new Error("err_missing_notifier_email_method_" + method))
      })
    })
  })

  describe("Methods", function(){
    it("Should update", function(done){
      var ruleId = "0"
      async.waterfall([
        function(     next){ oriskami[resourceName].update(ruleId, {"is_active": "false"}, next) }
      , function(res, next){
        var rule  = res.data[ruleId]
          , isOk  = rule.is_active === "false"
        isOk ? oriskami[resourceName].update(ruleId, {"is_active": "true"}, next) : next(new Error("err_invalid_notifier_ecommerce_value"))
      }], L.logError(done))
    }).timeout(20000)

    it("Should list", function(done){ oriskami[resourceName].list(L.logError(done))})
  })
})
