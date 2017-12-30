var _                 = require("lodash")
  , expect            = require("chai").expect
  , oriskami            = require("../../oriskami")
  , examples          = require("../../data/Event")
  , jsons             = _.map(examples, function(x){return {"id": x.id, "parameters": x}})
  , ids               = _.map(examples, function(x){return x.id})
  , rootProps         = ["log","_api"]
  , subProps          = ["auth","protocol","timeout","resources","revokedCerts","headers","request"]
  , methods           = ["retrieve", "update", "del", "list"]

describe("EventQueue", function(){
  describe("Properties", function(){
    it("Should have a name and path attribute", function() {
      expect(oriskami["EventQueue"]["path"]).to.exist
    })

    it("Should link to parent (oriskami)", function() {
      expect(oriskami["EventQueue"]["oriskami"]).to.exist
    })

    _.each(methods, function(method){
      var METHOD      = method.toUpperCase()
      it("Should have "+METHOD+" methods", function(done) {
        if(!_.isFunction(oriskami["EventQueue"][method])){
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
      oriskami["EventQueue"].retrieve(idResource, function(err, res){
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
      oriskami["EventQueue"].update(idResource
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
      oriskami["EventQueue"].update(idResource
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
      oriskami["EventQueue"].del(idResource
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
      oriskami["EventQueue"].list(function(err, res){
        if(err){
          console.log(err, res)
          done(new Error("Should have no error")) 
        } else if(res.data.length !== 1){
          console.log(res)
          done(new Error("Should return only one element for this dataset")) 
        } else if(!_.contains(_.keys(res.data[0]), "queue")){
          console.log(res)
          done(new Error("Should have an attribute named 'queue' in 'data'")) 
        } else if(!_.contains(_.keys(res), "summary")){
          console.log(res)
          done(new Error("Should have an attribute named 'summary'")) 
        } else {
          done()
        }
      })
    })
  })
})
