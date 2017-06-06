var _                 = require("lodash")
  , expect            = require("chai").expect
  , ubivar            = require("../../ubivar")
  , examples          = require("../../data/Event")
  , jsons             = _.map(examples, function(x){return {"id": x.id, "parameters": x}})
  , ids               = _.map(examples, function(x){return x.id})
  , rootProps         = ["log","_api"]
  , subProps          = ["auth","protocol","timeout","resources","revokedCerts","headers","request"]
  , methods           = ["retrieve", "update", "del", "list"]

describe("EventQueue", function(){
  describe("Properties", function(){
    it("Should have a name and path attribute", function() {
      expect(ubivar["EventQueue"]["path"]).to.exist
    })

    it("Should link to parent (ubivar)", function() {
      expect(ubivar["EventQueue"]["ubivar"]).to.exist
    })

    _.each(methods, function(method){
      var METHOD      = method.toUpperCase()
      it("Should have "+METHOD+" methods", function(done) {
        if(!_.isFunction(ubivar["EventQueue"][method])){
          return done(new Error("Should have "+METHOD+" methods"))
        }
        done()
      })
    })
  })

  describe("Methods", function(){
    var json        = jsons[0] 
      , idResource  = json.id

    it("Should retrieve", function(done){
      ubivar["EventQueue"].retrieve(idResource, function(err, res){
        var isStatusOk = res.statusCode >= 200 && res.statusCode <= 204
        if(!err && res.data.length >= 0){
          done()
        } else {
          console.log(err, res)
          done((new Error("Did not retrieve")))
        }
      })
    })

    it("Should update to 'false'", function(done){
      ubivar["EventQueue"].update(idResource
      , {"id": idResource, "active": "rules_custom"}
      , function(err, res){
        if(!err && res.data.length === 1 && res.data[0].queues.active === "rules_custom"){
          done()
        } else {
          console.log(err, res)
          done(new Error("Did not update"))
        }
      })
    })

    it("Should update to 'true'", function(done){
      ubivar["EventQueue"].update(idResource
      , {"id": idResource, "active": "rules_base"}
      , function(err, res){
        if(!err && res.data.length === 1 && res.data[0].queues.active === "rules_base"){
          done()
        } else {
          console.log(err, res)
          done(new Error("Did not update"))
        }
      })
    })

    it("Should delete", function(done){
      ubivar["EventQueue"].del(idResource
      , function(err, res){
        if(!err && res.data.length === 1 && res.data[0].queues.active === undefined){
          done()
        } else {
          console.log(err, res)
          done((new Error("Did not delete")))
        }
      })
    })

    it("Should list", function(done){
      ubivar["EventQueue"].list(function(err, res){
        if(!err && res.data.length === 3 && _.contains(_.keys(res.data[0]), "queues")) {
          done()
        } else {
          console.log(res)
          done(new Error("Should have only one returned element")) 
        }
      })
    })
  })
})