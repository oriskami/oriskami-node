var _                 = require("lodash")
  , expect            = require("chai").expect
  , async             = require("async")
  , oriskami          = require("../../oriskami")
  , L                 = require("../../L")
  , methods           = ["list"]
  , resourceName      = "RouterDataFeature"

describe(resourceName, function(){
  describe("Properties", function(){
    it("Should have a name and path attribute", function() { expect(oriskami[resourceName]["path"]).to.exist })
    it("Should link to parent (oriskami)"     , function() { expect(oriskami[resourceName]["oriskami"]).to.exist })
    _.each(methods, function(method){
      it("Should have "+method+" methods", function(done) {
        var hasMethod = _.isFunction(oriskami[resourceName][method])
        hasMethod ? done() : done(new Error("err_missing_router_data_feature_method_" + method))
      })
    })
  })

  describe("Methods", function(){
    it("Should list", function(done){ oriskami[resourceName].list(L.logError(done)) })
  })
})
