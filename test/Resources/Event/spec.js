var _                 = require("lodash")
  , expect            = require("chai").expect
  , oriskami            = require("../../oriskami")
  , examples          = require("../../data/Event")
  , jsons             = _.map(examples, function(x){return {"id": x.id, "parameters": x}})
  , ids               = _.map(examples, function(x){return x.id})
  , rootProps         = ["log","_api"]
  , subProps          = ["auth","protocol","timeout","resources","revokedCerts","headers","request"]
  , methods           = ["create", "retrieve", "update", "del", "list"]

describe("Event", function(){
  describe("Properties", function(){
    it("Should have a name and path attribute", function() {
      expect(oriskami["Event"]["path"]).to.exist
    })

    it("Should link to parent (oriskami)", function() {
      expect(oriskami["Event"]["oriskami"]).to.exist
    })

    it("Should have CRUD(L) methods", function() {
      _.each(methods, function(method){
        expect(oriskami["Event"][method]).to.exist
      })
    })
  })

  describe("Methods", function(){
    before(function(done){
      var defaultId = 0
      oriskami["RouterData"].update(defaultId, {"is_active": "true"}, function(err, res){
        if(err){ console.log(err, res) ; done(new Error("Did not update")) }
        done()
      })
    })

    var json        = jsons[0] 
      , idResource
    it("Should create and return a resource", function(done){
      oriskami["Event"].create(json, function(err, res){
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

    it("Should retrieve via its id the created resource", function(done){
      oriskami["Event"].retrieve(idResource, function(err, res){
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

      oriskami["Event"].update(idResource, {
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
      oriskami["Event"].del(idResource, function(err, res){
        if(!err && res.data.length === 1){
          oriskami["Event"].retrieve(idResource, function(err, res){
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

  describe("Pagination", function(){
    oriskami.set("timeout", 20000)

    before(function(done){
      oriskami["Event"].create(jsons[0], function(err, res){
        if(err) return done(err) 
        oriskami["Event"].create(jsons[1], function(err, res){
          if(err) return done(err) 
          oriskami["Event"].create(jsons[2], function(err, res){
            done(err)
          })
        })
      })
    })

    it("Should limit retrieved resources to N=1", function(done){
      var nLimit = 1
      oriskami["Event"].list({"limit": nLimit}, function(err, res){
        if(err) {
          console.log(err, res)
          done(err) 
        } else if(res.data.length === nLimit) {
          done()
        } else {
          console.log(res)
          done(new Error("Should 'limit' list to N="+nLimit+" resources")) 
        }
      })
    })

    it("Should limit retrieved resources to N=2", function(done){
      var nLimit = 2
      oriskami["Event"].list({limit:nLimit}, function(err, res){
        if(err) {
          console.log(err)
          done(err) 
        } else if(res.data.length === nLimit) {
          done()
        } else {
          console.log(res)
          done(new Error("Should 'limit' list to N="+nLimit+" resources")) 
        }
      })
    })

    it("Should list ids greater than (gt) a given id", function(done){
      var nLimit  = 2 
        , object  = {"id":{"gt":ids[0]}, "limit":nLimit}
      oriskami["Event"].list(object, function(err, res){
        if(err) return done(err)    
        if(res.data.length !== nLimit) return done(new Error("Should return N="+nLimit))
        var returnedIds   = _.pluck(res.data, "id")
        if(_.contains(returnedIds, ids[1]) && _.contains(returnedIds, ids[2])){ 
          return done()
        } 
        return done(new Error("Should contain the right ids"))
      })
    })

    it("Should list and order DESC the ids that are less than (lt) an id", function(done){
      var nLimit  = 2
      oriskami["Event"].list({"id":{"lt":ids[2]}, "order":"-id", "limit":nLimit}, function(err, res){
        if(err) return done(err)    
        if(res.data.length !== nLimit) return done(new Error("Should return N="+nLimit))
        var returnedIds   = _.pluck(res.data, "id")
        if(_.contains(returnedIds, ids[0]) && _.contains(returnedIds, ids[1]) && !_.contains(returnedIds,ids[2])){ 
          return done()
        } 
        return done(new Error("Should contain the right ids"))
      })
    })

    it("Should list ids greater than or equal (gte) to a given id", function(done){
      var nLimit  = 3
      oriskami["Event"].list({"id":{"gte":ids[0]}, "limit":nLimit}, function(err, res){
        if(err) return done(err)    
        if(res.data.length !== nLimit) return done(new Error("Should return N="+nLimit))
        var returnedIds   = _.pluck(res.data, "id")
        if(_.contains(returnedIds, ids[0]) && _.contains(returnedIds, ids[1]) && _.contains(returnedIds, ids[2])){ 
          return done()
        } 
        return done(new Error("Should contain the right ids"))
      })
    })

    it("Should list and order DESC the ids that are less than or equal (lte) an id", function(done){
      var nLimit  = 3
      oriskami["Event"].list({"id":{"lte":ids[2]}, "order":"-id", "limit":nLimit}, function(err, res){
        if(err) return done(err)    
        if(res.data.length !== nLimit) return done(new Error("Should return N="+nLimit))
        var returnedIds   = _.pluck(res.data, "id")
        if(_.contains(returnedIds, ids[0]) && _.contains(returnedIds, ids[1]) && _.contains(returnedIds,ids[2])){ 
          return done()
        } 
        return done(new Error("Should contain the right ids"))
      })
    })
  })
})
