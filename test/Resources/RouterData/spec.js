var _                 = require("lodash")
  , async             = require("async")
  , expect            = require("chai").expect
  , oriskami          = require("../../oriskami")
  , L                 = require("../../L")
  , resourceName      = "RouterData"
  , methods           = ["update"]

describe(resourceName, function(){
  describe("Properties", function(){
    it("Should have a name and path attribute", function(){ expect(oriskami[resourceName]["path"]).to.exist })
    it("Should link to parent (oriskami)"     , function(){ expect(oriskami[resourceName]["oriskami"]).to.exist})
    _.each(methods, function(method){
      it("Should have " + method + " methods", function(done) {
        var hasMethod = _.isFunction(oriskami[resourceName][method])
        hasMethod ? done() : done(new Error("err_missing_router_data_method_" + method))
      })
    })
  })

  describe("Methods", function(){
    it("Should update", function(done){
      var ruleId = "0"
      async.waterfall([
        function(     next){ oriskami[resourceName].update(ruleId, {"is_active": "true"}, next)}
      , function(res, next){ 
        var isActive = res.data[ruleId].is_active
        isActive ? oriskami[resourceName].update(ruleId, {"is_active": "false"}, next) : next(new Error("err_router_data_inactive")) 
      }], L.logError(done))
    }).timeout(20000)

    it("Should list", function(done){ oriskami[resourceName].list(L.logError(done))})
  })
})
