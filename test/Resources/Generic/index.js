"use strict"

module.exports = function(resource){
  var _                 = require("lodash")
    , expect            = require("chai").expect
    , ubivar            = require("../../ubivar")

  var rootProps         = ["log","_api"]
    , subProps          = ["auth","protocol","timeout","resources","revokedCerts","headers","request"]
    , methods           = ["create", "retrieve", "update", "del", "list", "summary"]
    
  describe(resource[0].toUpperCase() + resource.slice(1), function(){
    describe("Properties", function(){
      it("Should have a name and path attribute", function() {
        expect(ubivar[resource]["path"]).to.exist
      })

      it("Should link to parent (ubivar)", function() {
        expect(ubivar[resource]["ubivar"]).to.exist
      })

      it("Should have CRUD(L) methods", function() {
        _.each(methods, function(method){
          expect(ubivar[resource][method]).to.exist
        })
      })
    })

    describe("Methods", function(){
      var examples   = require("../../data/"+resource)
        , idResource

      it("Should create and return a single resource", function(done){
        ubivar[resource].create(examples[0], function(err, res){
          if(err){
            console.log(err, res)
            done(err)
          } else if(!!res.data && !!res.data[0] && !!res.data[0].id){
            idResource = res.data[0].id
            done()
          } else {
            done((new Error("Did not return an id")))
          }
        })
      })

      it("Should create and return several resources", function(done){
        var nExamples     = examples.length 

        ubivar[resource].create(examples, function(err, res){
          if(err){
            console.log(err, res)
            done(err)
          } else if(!!res.data && res.data.length === nExamples){
            idResource = res.data[0].id
            done()
          } else {
            done((new Error("Did not return an id")))
          }
        })
      })

      it("Should retrieve via its id the created resource", function(done){
        ubivar[resource].retrieve(idResource, function(err, res){
          if(res.status === 200 && res.data.length === 1){
            done()
          } else {
            done((new Error("Did not return the resource with id = "+idResource)))
          }
        })
      })

      it("Should update the created resource", function(done){
        ubivar[resource].update(idResource, examples[1], function(err, res){
          if(res.status === 200 && res.data.length === 1){
            var newData   = res.data[0]
              , sentData  = examples[1]
              , deepEqual = _.reduce(_.keys(sentData), function(memo, key){
              if(_.isNumber(newData[key]) || _.isNumber(sentData[key])){
                return memo && _.isEqual(""+newData[key], ""+sentData[key])
              } else {
                return memo && _.isEqual(newData[key], sentData[key]) 
              }
            }, true)
            if(deepEqual){
              done()
            } else {
              done(new Error("Updated resource is not deep equal to submitted resource"))
            }
          } else {
            done(new Error("Non-200 status code, or data length !== 1 when updating"))
          }
        })
      })

      it("Should delete the created resource", function(done){
        ubivar[resource].del(idResource, function(err, res){
          if(res.status === 200 && res.data.length === 1){
            done()
          } else {
            done((new Error("Did not return the deleted resource with id = "+idResource)))
          }
        })
      })
    })

    describe("Pagination", function(){
      var ids         = []

      before(function(done){
        var examples   = require("../../data/"+resource)
        this.timeout(5000)
        ubivar[resource].create(examples[0], function(err, res){
          if(err) return done(err)
          ids.push(res.data[0].id)
          ubivar[resource].create(examples[0], function(err, res){
            if(err) return done(err)
            ids.push(res.data[0].id)
            ubivar[resource].create(examples[0], function(err, res){
              if(err) return done(err)
              ids.push(res.data[0].id)
              done()
            })
          })
        })
      })

      it("Should limit retrieved resources to N=1", function(done){
        var nLimit = 1
        ubivar[resource].list({limit:nLimit}, function(err, res){
          if(err) done(err) 
          else if(res.data.length === nLimit) done()
          else done(new Error("Should 'limit' list to N="+nLimit+" resources")) 
        })
      })

      it("Should limit retrieved resources to N=2", function(done){
        var nLimit = 2
        ubivar[resource].list({limit:nLimit}, function(err, res){
          if(err) done(err) 
          else if(res.data.length === nLimit) done()
          else done(new Error("Should 'limit' list to N="+nLimit+" resources")) 
        })
      })

      it("Should 'start_after' when paginating", function(done){
        var nLimit = 2
        ubivar[resource].list({"start_after": ids[0], "limit":nLimit}, function(err, res){
          if(err) return done(err)    
          if(res.data.length !== nLimit) return done(new Error("Should return N="+nLimit))
          var returnedIds   = _.pluck(res.data, "id")
          if(_.contains(returnedIds, ids[0])){ 
            return done(new Error("Should not return 'starting_after' id"))
          }
          done()
        })
      })

      it("Should 'start_after' and 'end_before' when paginating", function(done){
        var nLimit = 1
        ubivar[resource].list({"end_before": ids[2], "start_after":ids[0]}, function(err, res){
          if(err) return done(err)  
          if(res.data.length !== nLimit){
            console.log(res.data);return done(new Error("Should return N="+nLimit))
          }
          var returnedIds   = _.pluck(res.data, "id")
          if(_.contains(returnedIds, ids[1])) return done()
          else return done(new Error("Should not return 'starting_after' id"))
        })
      })

      it("Should list ids greater than (gt) a given id", function(done){
        var nLimit  = 2
          , object  = {"id":{"gt":ids[0]}, "limit":nLimit}
        ubivar[resource].list(object, function(err, res){
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
        var nLimit = 2
        ubivar[resource].list({"id":{"lt":ids[2]}, "order":"-id", "limit":nLimit}, function(err, res){
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
        var nLimit = 3
        ubivar[resource].list({"id":{"gte":ids[0]}, "limit":nLimit}, function(err, res){
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
        var nLimit = 3
        ubivar[resource].list({"id":{"lte":ids[2]}, "order":"-id", "limit":nLimit}, function(err, res){
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
}
