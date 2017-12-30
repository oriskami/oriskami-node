var _                 = require("lodash")
  , expect            = require("chai").expect
  , oriskami            = require("../../oriskami")
  , examples          = require("../../data/Event")
  , jsons             = _.map(examples, function(x){return {"id": x.id, "parameters": x}})
  , ids               = _.map(examples, function(x){return x.id})
  , methods           = ["create"]

describe("Event", function(){
  describe("Properties", function(){
    it("Should have a name and path attribute", function() {
      expect(oriskami["EventPast"]["path"]).to.exist
    })

    it("Should link to parent (oriskami)", function() {
      expect(oriskami["EventPast"]["oriskami"]).to.exist
    })

    it("Should have CRUD(L) methods", function() {
      _.each(methods, function(method){
        expect(oriskami["EventPast"][method]).to.exist
      })
    })
  })

  describe("Methods", function(){
    var json        = jsons[0] 
      , idResource
    it("Should create and return a single resource", function(done){
      oriskami["EventPast"].create(json, function(err, res){
        if(err){
          console.log(err, res)
          done(err)
        } else if(!!res.data && !!res.data[0] && !!res.data[0].id){
          idResource = res.data[0].id
          done()
        } else {
          console.log(err, res)
          done(new Error("Did not return an id"))
        }
      })
    })

    it("Should create and return several resources", function(done){
      var nExamples     = examples.length 

      oriskami["EventPast"].create(jsons, function(err, res){
        if(err){
          console.log(err, res)
          done(err)
        } else if(!!res.data && res.data.length === nExamples){
          idResource = res.data[0].id
          done()
        } else {
          console.log(err, res)
          done((new Error("Did not return an id")))
        }
      })
    })
  })
})
