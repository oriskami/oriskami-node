var _                 = require("lodash")
  , expect            = require("chai").expect
  , async             = require("async")
  , oriskami          = require("../../oriskami")
  , L                 = require("../../L")
  , methods           = ["retrieve", "list"]
  , resourceName      = "Router"

describe(resourceName, function(){
  describe("Properties", function(){
    it("Should have a name and path attribute", function() { expect(oriskami[resourceName]["path"]).to.exist })
    it("Should link to parent (oriskami)"     , function() { expect(oriskami[resourceName]["oriskami"]).to.exist})
    _.each(methods, function(method){
      it("Should have " + method + " methods", function(done) {
        var hasMethod = _.isFunction(oriskami[resourceName][method])
        hasMethod ? done() :done("err_missing_router_method_" + method)
      })
    })
  })

  describe("Methods", function(){
    it("Should retrieve", function(done){
      oriskami[resourceName].retrieve(0, function(err, res){
        var isStatusOk  = !err && res.status_code >= 200 && res.status_code <= 204
        if(err) return done(err)
        else    return isStatusOk ? done() : done(new Error("err_retrieving"))
      })
    })
  })
})
