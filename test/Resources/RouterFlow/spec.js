var _                 = require("lodash")
  , async             = require("async")
  , expect            = require("chai").expect
  , oriskami          = require("../../oriskami")
  , L                 = require("../../L")
  , methods           = ["create","update","del","list"]
  , resourceName      = "RouterFlow"

describe(resourceName, function(){
  describe("Properties", function(){
    it("Should have a name and path attribute", function() { expect(oriskami[resourceName]["path"]).to.exist })
    it("Should link to parent (oriskami)"     , function() { expect(oriskami[resourceName]["oriskami"]).to.exist})
    _.each(methods, function(method){
      var METHOD      = method.toUpperCase()
      it("Should have "+METHOD+" methods", function(done) {
        var hasMethod = _.isFunction(oriskami[resourceName][method])
        hasMethod ? done() : done(new Error("err_missing_method_" + method))
      })
    })
  })

  describe("Methods", function(){
    it("Should create and delete", function(done){ 
      var nRouterFlows0
        , nRouterFlows1
      async.waterfall([
        function(     next){ oriskami[resourceName].list(next)}
      , function(res, next){ nRouterFlows0 = res.data.length; oriskami[resourceName].create({}, next) } 
      , function(res, next){ nRouterFlows1 = res.data.length; oriskami[resourceName].del(nRouterFlows1 - 1, next) } 
      ], function(err, res) {
        var nRouterFlows2 = !err && res.data && res.data.length 
        err && console.log(err)
        if(nRouterFlows1 <= nRouterFlows0)  return done(new Error("err_creating_router_flow")) 
        if(nRouterFlows2 !== nRouterFlows0) return done(new Error("err_deleting_created_flow"))
        done(err)
      })
    }).timeout(20000)

    it("Should update", function(done){
      var ruleId = "0"
      async.waterfall([
        function(     next){ oriskami[resourceName].update(ruleId, {"is_active": "true"}, next) }
      , function(res, next){ 
          var isActive    = res.data.is_active === "true" 
          if(isActive)  return oriskami[resourceName].update(ruleId, {"is_active": "false"}, next)
          else          return next(new Error("err_updating_router_flow"))
      }], L.logError(done))
    }).timeout(20000)

    it("Should list", function(done){ oriskami[resourceName].list(L.logError(done))})
  })
})
