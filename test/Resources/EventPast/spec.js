var _                 = require("lodash")
  , async             = require("async")
  , expect            = require("chai").expect
  , L                 = require("../../L")
  , oriskami          = require("../../oriskami")
  , examples          = require("../../data/Event")
  , jsons             = _.map(examples, function(x){return {"id": x.id, "parameters": x}})
  , methods           = ["create", "retrieve", "update", "del", "list"]
  , resourceName      = "EventPast"

describe(resourceName, function(){
  describe("Properties", function(){
    it("Should have a name and path attribute", function() { expect(oriskami[resourceName]["path"]).to.exist})
    it("Should link to parent (oriskami)"     , function() { expect(oriskami[resourceName]["oriskami"]).to.exist})
    it("Should have CRUD(L) methods"          , function() { 
      _.each(methods, function(method){
        expect(oriskami[resourceName][method]).to.exist 
      }) 
    })
  })

  describe("Methods", function(){
    var json        = jsons[0] 
      , newEmail    = "abc@gmail.com"
      , idResource
    it("Should create, retrieve, update, and delete a resource", function(done){
      async.waterfall([
        function(     next){ oriskami[resourceName].create(json, next)} 
      , function(res, next){ 
        var isOk    = !!res.data && !!res.data[0] && !!res.data[0].id
        idResource  = res.data[0].id
        isOk        ? oriskami[resourceName].retrieve(idResource, next) : next(new Error("err_creating"))
      }, function(res, next){ 
        var isOk    = res.status_code >= 200 && res.status_code <= 204 && res.data.length === 1 && res.data[0].id === idResource
        isOk        ? next(null, true) : next(new Error("err_retrieving"))
      }, function(res, next){ oriskami[resourceName].update(idResource, {"id": jsons[1].id, "parameters": {"email": newEmail}}, next)} 
       , function(res, next){  
        var isOk    = res.data.length === 1 && res.data[0].parameters.email === newEmail
        isOk        ? next(null, true) : next(new Error("err_updating")) 
       },function(res, next){ oriskami[resourceName].del(idResource, next)} 
       , function(res, next){ oriskami[resourceName].retrieve(idResource, next)} 
       , function(res, next){ 
        var isOk    = res.data.length === 0 
        isOk        ? next(null, true) : next(new Error("err_retrieving")) 
       }], L.logError(done))
    })
  })
})
