var _                 = require("lodash")
  , async             = require("async")
  , expect            = require("chai").expect
  , L                 = require("../../L")
  , oriskami          = require("../../oriskami")
  , examples          = require("../../data/Event")
  , jsons             = _.map(examples, function(x){return {"id": x.id, "parameters": x}})
  , methods           = ["retrieve", "update", "del", "list"]
  , resourceName      = "EventQueue"

describe(resourceName, function(){
  describe("Properties", function(){
    it("Should have a name and path attribute", function() { expect(oriskami[resourceName]["path"]).to.exist })
    it("Should link to parent (oriskami)"     , function() { expect(oriskami[resourceName]["oriskami"]).to.exist })
    _.each(methods, function(method){
      it("Should have " + method + " methods", function(done) {
        _.isFunction(oriskami[resourceName][method]) ? done() :  done(new Error("err_missing_method_" + method))
      })
    })
  })

  describe("Methods", function(){
    var json        = jsons[0] 
      , idResource  = json.id

    before(function(done){
      async.waterfall([
        function(     next){ oriskami["Event"].create(jsons[0], next)}
      , function(res, next){ oriskami["Event"].create(jsons[1], next)} 
      , function(res, next){ oriskami["Event"].create(jsons[2], next)} 
      ], done)
    })

    it("Should retrieve", function(done){
      async.waterfall([
        function(     next){ oriskami[resourceName].retrieve(idResource, next) }
      , function(res, next){ 
        var isOk    = res.status_code >= 200 && res.status_code <= 204 && res.data.length >= 0
        isOk ? next(null, true) : next(new Error("err_retrieving"))
      }], L.logError(done))
    })

    it("Should update", function(done){
      async.waterfall([
        function(     next){ oriskami[resourceName].update(idResource, {"id": idResource, "active": "rules_custom"}, next) }
      , function(res, next){ 
        var isOk    = res.status_code >= 200 && res.status_code <= 204 && res.data.length == 1 && res.data[0].queues.active === "rules_custom"
        isOk ? next(null, true) : next(new Error("err_updating"))
      },function(res,  next){ oriskami[resourceName].update(idResource, {"id": idResource, "active": "rules_base"}, next) }
      , function(res, next){ 
        var isOk    = res.status_code >= 200 && res.status_code <= 204 && res.data.length == 1 && res.data[0].queues.active === "rules_base"
        isOk ? next(null, true) : next(new Error("err_updating"))
      }], L.logError(done))
    })

    it("Should delete", function(done){
      async.waterfall([
        function(     next){ oriskami[resourceName].del(idResource, next) }
      , function(res, next){ 
        var isOk    = res.data.length === 1 && res.data[0].queues.active === undefined
        isOk ? next(null, true) : next(new Error("err_deleting"))
      }], L.logError(done))
    })

    it("Should create one, list, and have the {queue, summary, active} attributes", function(done){
      async.waterfall([
        function(     next){ oriskami[resourceName].update(idResource, {"id": idResource, "active": "rules_base"}, next) }
      , function(res, next){ oriskami[resourceName].list(next) }
      , function(res, next){ 
        if(res.data.length !== 1) return next(new Error("err_list_more_than_one_returned_row")) 
        if(!res.data[0].queue   ) return next(new Error("err_no_queue_attribute")) 
        if(!res.summary         ) return next(new Error("err_no_summary")) 
        next(null, true) 
      }], L.logError(done))
    })
  })
})
