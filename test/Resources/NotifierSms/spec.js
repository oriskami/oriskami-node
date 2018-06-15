var _                 = require("lodash")
  , expect            = require("chai").expect
  , async             = require("async")
  , oriskami          = require("../../oriskami")
  , L                 = require("../../L")
  , examples          = require("../../data/Event")
  , resourceName      = "NotifierSms"
  , methods           = ["retrieve", "update", "del", "list"]
  , json              = { 
    "value"           : "+1 123 456 789"
  , "description"     : "New Description"
  , "is_active"       : "true"
  }

describe(resourceName, function(){
  describe("Properties", function(){
    it("Should have a name and path attribute", function() { expect(oriskami[resourceName]["path"]).to.exist})
    it("Should link to parent (oriskami)"     , function() { expect(oriskami[resourceName]["oriskami"]).to.exist})
    _.each(methods, function(method){
      it("Should have " + method + " methods", function(done) {
        var hasMethod = _.isFunction(oriskami[resourceName][method])
        hasMethod ? done() : done(new Error("err_missing_notifier_sms_method_" + method))
      })
    })
  })

  describe("Methods", function(){
    it("Should create", function(done){
      async.waterfall([
        function(     next){ oriskami[resourceName].create(json, next) }
      , function(res, next){ 
        var rule    = res.data.reverse()[0]
          , isEqual = _.reduce(_.keys(json), function(memo, k){ return memo && json[k] === rule[k] }, true)
        isEqual ? next(null, isEqual) : next(new Error("err_creating"))
      }], L.logError(done))
    })

    it("Should update", function(done){
      var ruleId  = "0"
        , value1 = "+1 987 654 321"
      async.waterfall([
        function(     next){ oriskami[resourceName].update(ruleId, {"value": value1}, next) }
      , function(res, next){  
        var isOk  = res.data[ruleId].value === value1
        isOk ? oriskami[resourceName].update(ruleId, {"value": json.value}, next) : next(new Error("err_updating"))
      }], L.logError(done))
    }).timeout(20000)

    it("Should delete", function(done){
      var nNotifiers0
      async.waterfall([
        function(     next){ oriskami[resourceName].create(json, next)}
      , function(res, next){ oriskami[resourceName].list(next)}
      , function(res, next){ nNotifiers0 = res.data.length; oriskami[resourceName].del(nNotifiers0 - 1, next)}
      , function(res, next){ res.data.length == nNotifiers0 - 1 ? next(null, true) : next(new Error("err_deleting")) }
      ], L.logError(done))
    }).timeout(20000)
  })
})
