var _                 = require("lodash")
  , expect            = require("chai").expect
  , async             = require("async")
  , L                 = require("../../L")
  , oriskami          = require("../../oriskami")
  , examples          = require("../../data/Event")
  , resourceName      = "NotifierWebhook"
  , methods           = ["retrieve", "update", "del", "list"]
  , json              = { 
    "value"           : "https://some-url"
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
        hasMethod ? done() : done(new Error("err_missing_notifier_webhook_method_" + method))
      })
    })
  })

  describe("Methods", function(){
    it("Should create, list, and delete", function(done){
      var nWebhooks0
      async.waterfall([
        function(     next){ oriskami[resourceName].create(json, next)}
      , function(res, next){  
        var rule      = res.data.reverse()[0]
          , isEqual   = _.reduce(_.keys(json), function(memo, k){ return memo && json[k] === rule[k] }, true)
        isEqual ? next(null, isEqual) : next(new Error("err_creating_notifier_webhook_not_equal"))
      },function(res, next){ oriskami[resourceName].list(next)}
      , function(res, next){ nWebhooks0 = res.data.length ; oriskami[resourceName].del(nWebhooks0 - 1, next)}
      , function(res, next){ res.data.length === nWebhooks0 - 1? next(null, true) : next(new Error("err_deleting"))} 
      ], L.logError(done))
    }).timeout(20000)

    it("Should update", function(done){
      var ruleId = "0"
      async.waterfall([
        function(     next) { oriskami[resourceName].update(ruleId, {"value": "https://another-url"}, next) }
      , function(res, next) { 
        var isValid = res.data[ruleId].value === "https://another-url"
        isValid ? oriskami[resourceName].update(ruleId, {"value": "https://some-url"}, next) : next(new Error("err_updating"))
      }], L.logError(done))
    }).timeout(20000)
  })
})
