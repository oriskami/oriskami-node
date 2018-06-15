var _                 = require("lodash")
  , expect            = require("chai").expect
  , async             = require("async")
  , L                 = require("../../L")
  , oriskami          = require("../../oriskami")
  , examples          = require("../../data/Event")
  , methods           = ["retrieve", "update", "del", "list"]
  , resourceName      = "NotifierEmail"
  , json              = { 
    "value"           : "abc@gmail.com"
  , "description"     : "New Description"
  , "is_active"       : "true"
  }

describe(resourceName, function(){
  describe("Properties", function(){
    it("Should have a name and path attribute", function() { expect(oriskami[resourceName]["path"]).to.exist})
    it("Should link to parent (oriskami)", function() { expect(oriskami[resourceName]["oriskami"]).to.exist})
    _.each(methods, function(method){
      it("should have " + method + " methods", function(done) {
        _.isFunction(oriskami[resourceName][method]) ? done() : done(new error("err_missing_method_" + method))
      })
    })
  })

  describe("Methods", function(){
    it("Should create", function(done){
      async.waterfall([
        function(     next){ oriskami[resourceName].create(json, next)}
      , function(res, next){ 
        var rule      = res.data.reverse()[0]
          , isEqual   = _.reduce(_.keys(json), function(memo, k){ return memo && json[k] === rule[k] }, true)
        isEqual ? next(null, true) : next(new Error("err_creating"))
      }], L.logError(done))
    })

    it("Should update", function(done){
      var ruleId = "0"
      async.waterfall([
        function(     next){ oriskami[resourceName].update(ruleId, {"value": "yahoo.com"}, next) }
      , function(res, next){
        var rule  = res.data[ruleId]
          , isOk  = rule.value === "yahoo.com"
        isOk ? oriskami[resourceName].update(ruleId, {"value": "gmail.com"}, next) : next(new Error("err_updating"))
      }], L.logError(done))
    }).timeout(20000)

    it("Should delete", function(done){
      var nRules0
      async.waterfall([
        function(     next){ oriskami[resourceName].list(next) }
      , function(res, next){ 
        nRules0   = res.data.length
        oriskami[resourceName].del(nRules0 - 1, next)
      }, function(res, next){ 
        var isOk  = res.data.length === nRules0 - 1
        isOk ? next(null, isOk) : next(new Error("err_deleting"))
      }], L.logError(done))
    })
  })
})
