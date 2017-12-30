var _                 = require("lodash")
  , expect            = require("chai").expect
  , oriskami            = require("../../oriskami")
  , examples          = require("../../data/Event")
  , jsons             = _.map(examples, function(x){return {"id": x.id, "parameters": x}})
  , ids               = _.map(examples, function(x){return x.id})
  , rootProps         = ["log","_api"]
  , subProps          = ["auth","protocol","timeout","resources","revokedCerts","headers","request"]
  , methods           = ["retrieve", "update", "del", "list"]

describe("EventLabel", function(){
  describe("Properties", function(){
    it("Should have a name and path attribute", function() {
      expect(oriskami["EventLabel"]["path"]).to.exist
    })

    it("Should link to parent (oriskami)", function() {
      expect(oriskami["EventLabel"]["oriskami"]).to.exist
    })

    _.each(methods, function(method){
      var METHOD      = method.toUpperCase()
      it("Should have "+METHOD+" methods", function(done) {
        if(!_.isFunction(oriskami["EventLabel"][method])){
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
      oriskami["EventLabel"].retrieve(idResource, function(err, res){
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
      oriskami["EventLabel"].update(idResource
      , {"id": idResource, "label": "is_loss", "value": "false"}
      , function(err, res){
        if(!err && res.data.length === 1 && res.data[0].labels.is_loss === "false"){
          done()
        } else {
          console.log(err, res)
          done(new Error("Did not update"))
        }
      })
    })

    it("Should update to 'true'", function(done){
      oriskami["EventLabel"].update(idResource
      , {"id": idResource, "label": "is_loss", "value": "true"}
      , function(err, res){
        if(!err && res.data.length === 1 && res.data[0].labels.is_loss === "true"){
          done()
        } else {
          console.log(err, res)
          done(new Error("Did not update"))
        }
      })
    })

    it("Should delete", function(done){
      oriskami["EventLabel"].del(idResource
      , function(err, res){
        if(!err && res.data.length === 1 && res.data[0].labels.is_loss === undefined){
          done()
        } else {
          console.log(err, res)
          done((new Error("Did not delete")))
        }
      })
    })

    it("Should list", function(done){
      oriskami["EventLabel"].list(function(err, res){
        if(!err && res.data.length === 3 && _.contains(_.keys(res.data[0]), "labels")) {
          done()
        } else {
          console.log(res)
          done(new Error("Should have only one returned element")) 
        }
      })
    })
  })
})
