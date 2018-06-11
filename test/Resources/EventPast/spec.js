var _                 = require("lodash")
  , expect            = require("chai").expect
  , oriskami          = require("../../oriskami")
  , examples          = require("../../data/Event")
  , jsons             = _.map(examples, function(x){return {"id": x.id, "parameters": x}})
  , ids               = _.map(examples, function(x){return x.id})
  , methods           = ["create"]

describe("EventPast", function(){
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
          console.log(res)
          done(new Error("Did not return an id"))
        }
      })
    })

    it("Should retrieve via its id the created resource", function(done){
      oriskami["EventPast"].retrieve(idResource, function(err, res){
        var isStatusOk = res.statusCode >= 200 && res.statusCode <= 204
        if(err){
          console.log(err, res)
          done(err)
        } else if(res.data.length === 1 && res.data[0].id === idResource){
          done()
        } else {
          console.log("Expected ", idResource, " Returned ", res.data[0].id)
          done((new Error("Did not return the resource with id = "+idResource)))
        }
      })
    })

    it("Should update the created resource", function(done){
      var newEmail  = "abc@gmail.com"

      oriskami["EventPast"].update(idResource, {
          "id"        : jsons[1].id
        , "parameters": {"email": newEmail}
      }, function(err, res){
        if(err){
          console.log(err, res)
          done(err)
        } else if(res.data.length === 1){
          if(res.data[0].parameters.email !== newEmail){
            done(new Error("Updated resource is not equal to submitted resource"))
            console.log(err, sentData, newData)
          }
          done()
        } else if(res.data.length !== 1){
          console.log("Data:", res.data)
          done(new Error("Data length !== 1 when updating"))
        }
      })
    })

    it("Should delete the created resource", function(done){
      oriskami["EventPast"].del(idResource, function(err, res){
        if(!err && res.data.length === 1){
          oriskami["EventPast"].retrieve(idResource, function(err, res){
            if(err || res.data.length > 0){
              console.log(err, res)
              done((new Error("Should have deleted resource id = "+idResource)))
            }
            done()
          })
        } else {
          console.log(err, res)
          done((new Error("Did not return the deleted resource with id = "+idResource)))
        }
      })
    })
  })
})
