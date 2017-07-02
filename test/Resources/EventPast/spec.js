var _                 = require("lodash")
  , expect            = require("chai").expect
  , ubivar            = require("../../ubivar")
  , examples          = require("../../data/Event")
  , jsons             = _.map(examples, function(x){return {"id": x.id, "parameters": x}})
  , ids               = _.map(examples, function(x){return x.id})
  , methods           = ["create"]

describe("Event", function(){
  describe("Properties", function(){
    it("Should have a name and path attribute", function() {
      expect(ubivar["EventPast"]["path"]).to.exist
    })

    it("Should link to parent (ubivar)", function() {
      expect(ubivar["EventPast"]["ubivar"]).to.exist
    })

    it("Should have CRUD(L) methods", function() {
      _.each(methods, function(method){
        expect(ubivar["EventPast"][method]).to.exist
      })
    })
  })

  describe("Methods", function(){
    var json        = jsons[0] 
      , idResource
    it("Should create and return a single resource", function(done){
      ubivar["EventPast"].create(json, function(err, res){
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

      ubivar["EventPast"].create(jsons, function(err, res){
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
