var _                 = require("lodash")
  , async             = require("async")
  , expect            = require("chai").expect
  , L                 = require("../../L") 
  , oriskami          = require("../../oriskami")
  , methods           = ["update"]

describe("Notifier", function(){
  describe("Properties", function(){
    it("Should have a name and path attribute", function() { expect(oriskami["Notifier"]["path"]).to.exist})
    it("Should link to parent (oriskami)", function() { expect(oriskami["Notifier"]["oriskami"]).to.exist})
    _.each(methods, function(method){
      it("Should have " + method + " methods", function(done) {
        var hasMethod = _.isFunction(oriskami["Notifier"][method])
        hasMethod ? done() : done(new Error("err_missing_notifier_email_method_" + method))
      })
    })
  })

  describe("Methods", function(){
    it("Should list"  , function(done){ oriskami["Notifier"].list(L.logError(done))})
    it("Should update", function(done){
      var ruleId = "0"
      async.waterfall([
        function(     next){ oriskami["Notifier"].update(ruleId, {"is_active": "true"}, next) }
      , function(res, next){
        var rule  = res.data[ruleId]
          , isOk  = rule.is_active === "true"
        isOk ? oriskami["Notifier"].update(ruleId, {"is_active": "false"}, next) : next(new Error("err_invalid_notifier_is_active"))
      }], L.logError(done))
    }).timeout(20000)
  })
})
