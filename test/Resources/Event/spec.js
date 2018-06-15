var _                 = require("lodash")
  , async             = require("async")
  , expect            = require("chai").expect
  , L                 = require("../../L")
  , oriskami          = require("../../oriskami")
  , examples          = require("../../data/Event")
  , jsons             = _.map(examples, function(x){return {"id": x.id, "parameters": x}})
  , ids               = _.map(examples, function(x){return x.id})
  , methods           = ["create", "retrieve", "update", "del", "list"]
  , resourceName      = "Event" 

describe(resourceName, function(){
  describe("Properties", function(){
    it("Should have a name and path attribute", function() { expect(oriskami[resourceName]["path"]).to.exist})
    it("Should link to parent (oriskami)"     , function() { expect(oriskami[resourceName]["oriskami"]).to.exist})
    it("Should have CRUD(L) methods"          , function() { _.each(methods, function(method){ expect(oriskami[resourceName][method]).to.exist }) })
  })

  describe("Methods", function(){
    before(function(done){
      var defaultId = 0
      oriskami["RouterData"].update(defaultId, {"is_active": "true"}, L.logError(done))
    })

    var json        = jsons[0] 
    it("Should create, retrieve, and delete resource", function(done){
      var idResource
      async.waterfall([
        function(     next){ oriskami[resourceName].create(json, next) }
      , function(res, next){ 
        var isOk        = !!res.data && !!res.data[0] 
        idResource      = isOk && ("" + res.data[0].id)
        isOk ? next(null, res) : next(new Error("err_creating_resource"))
      },function(res, next){ oriskami[resourceName].retrieve(idResource, next) }
      , function(res, next){ 
        var isOk    = res.status_code >= 200 && res.status_code <= 204 && res.data.length === 1 && (""+res.data[0].id) === idResource
        isOk ? next(null, true) : next(new Error("err_retrieving_resource"))
      }, function(res, next){ oriskami[resourceName].del(idResource, next)} 
      ], L.logError(done))
    }).timeout(20000)

    it("Should update the created resource", function(done){
      var newEmail  = "abc@gmail.com"
        , idResource= jsons[1].id
      async.waterfall([
        function(     next){ oriskami[resourceName].update(idResource, { "id": idResource, "parameters": {"email": newEmail}},next) }
      , function(res, next){ 
        var isOk    = res.data.length === 1 && res.data[0].parameters.email === newEmail
        isOk        ? next(null, true) : next(new Error("err_resource_is_different"))
      }], L.logError(done))
    })
  })

  describe("Pagination", function(){
    before(function(done){
      async.waterfall([
        function(     next){ oriskami[resourceName].create(jsons[0], next)}
      , function(res, next){ oriskami[resourceName].create(jsons[1], next)} 
      , function(res, next){ oriskami[resourceName].create(jsons[2], next)} 
      ], done)
    })

    it("Should limit retrieved resources to N=1 and N=2", function(done){
      async.waterfall([
        function(     next){ oriskami[resourceName].list({"limit": 1}, next) }
      , function(res, next){ 
          var isOk = res.data.length === 1 
          isOk ? next(null, true): next(new Error("err_limit_list_1"))
      },function(res, next){ oriskami[resourceName].list({"limit": 2}, next) }
      , function(res, next){ 
          var isOk = res.data.length === 2 
          isOk ? next(null, true): next(new Error("err_limit_list_2"))
      }], L.logError(done))
    })

    it("Should list ids greater than (gt) a given id", function(done){
      var nLimit  = 2 
        , object  = {"id":{"gt":ids[0]}, "limit":nLimit}
      async.waterfall([
        function(next){ oriskami[resourceName].list(object, next) }
      , function(res, next){ 
        if(res.data.length !== nLimit) next(new Error("err_invalid_number_of_returned_results"))
        var returnedIds   = _.pluck(res.data, "id")
          , isOk          = _.contains(returnedIds, ids[1]) && _.contains(returnedIds, ids[2])
        isOk  ? next(null, true) : next(new Error("err_invalid_returned_ids"))
      }], L.logError(done))
    })

    it("Should list and order DESC the ids that are less than (lt) an id", function(done){
      var nLimit  = 2 
        , object  = {"id":{"lt":ids[2]}, "order":"-id", "limit":nLimit}
      async.waterfall([
        function(next){ oriskami[resourceName].list(object, next) }
      , function(res, next){ 
        if(res.data.length !== nLimit) next(new Error("err_invalid_number_of_returned_results"))
        var returnedIds   = _.pluck(res.data, "id")
          , isOk          = _.contains(returnedIds, ids[0]) && _.contains(returnedIds, ids[1]) && !_.contains(returnedIds,ids[2])
        isOk  ? next(null, true) : next(new Error("err_invalid_returned_ids"))
      }], L.logError(done))
    })

    it("Should list ids greater than or equal (gte) to a given id", function(done){
      var nLimit  = 3 
        , object  = {"id":{"gte":ids[0]}, "limit":nLimit}
      async.waterfall([
        function(     next){ oriskami[resourceName].list(object, next) }
      , function(res, next){ 
        if(res.data.length !== nLimit) next(new Error("err_invalid_number_of_returned_results"))
        var returnedIds   = _.pluck(res.data, "id")
          , isOk          = _.contains(returnedIds, ids[0]) && _.contains(returnedIds, ids[1]) && _.contains(returnedIds,ids[2])
        isOk  ? next(null, true) : next(new Error("err_invalid_returned_ids"))
      }], L.logError(done))
    })

    it("Should list and order DESC the ids that are less than or equal (lte) an id", function(done){
      var nLimit  = 3 
        , object  = {"id":{"lte":ids[2]}, "order":"-id", "limit":nLimit}
      async.waterfall([
        function(next){ oriskami[resourceName].list(object, next) }
      , function(res, next){ 
        if(res.data.length !== nLimit) next(new Error("err_invalid_number_of_returned_results"))
        var returnedIds   = _.pluck(res.data, "id")
          , isOk          = _.contains(returnedIds, ids[0]) && _.contains(returnedIds, ids[1]) && _.contains(returnedIds,ids[2])
        isOk  ? next(null, true) : next(new Error("err_invalid_returned_ids"))
      }], L.logError(done))
    })
  })
})
