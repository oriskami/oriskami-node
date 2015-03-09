"use strict"

var _           = require("lodash")
  , expect      = require("chai").expect
  , ubivar      = require("../ubivar")

describe("Resources", function() {
  var rootProps = ["log","_api"]
    , subProps  = ["auth","protocol","timeout","resources","revokedCerts","headers","request"]
    , methods   = ["create", "retrieve", "update", "del", "list"]
    , resources = _.difference(ubivar.get("resources"), ["me"]) 

  describe("Properties", function(){
    it("Should have a name and path attribute", function() {
      _.each(resources, function(resource){
        _.each(methods, function(method){
          expect(ubivar[resource]["path"]).to.exist
        })
      })
    })

    it("Should link to parent (ubivar)", function() {
      _.each(resources, function(resource){
        _.each(methods, function(method){
          expect(ubivar[resource]["ubivar"]).to.exist
        })
      })
    })

    it("Should have a logger", function() {
      _.each(resources, function(resource){
        _.each(methods, function(method){
          expect(ubivar[resource]["log"]).to.exist
        })
      })
    })

    it("Should have CRUD(L) methods", function() {
      _.each(resources, function(resource){
        _.each(methods, function(method){
          expect(ubivar[resource][method]).to.exist
        })
      })
    })
  })

  describe("Functional tests", function(){

    describe("Authentication [/me]", function(){
      var testIt      = function(token, isAuthorized){
        var message   = "Should be " + (isAuthorized?"  ":"un") + "authorized "
        if(!!token){
          message       += "'"+ token.slice(0,5) +"...'"
        } else {
          message     += "'" + token + "'"
        }

        it(message, function(done){
          var ubivar  = require("../../lib")(token, "latest")
          ubivar.me.retrieve(function(gotError, res){
            if( isAuthorized &&  gotError) done((new Error(message)))
            if( isAuthorized && !gotError) done()
            if(!isAuthorized &&  gotError) done()
            if(!isAuthorized && !gotError) done((new Error(message)))
          })
        })
      }

      testIt(null         , false)
      testIt(undefined    , false)
      testIt("unauthToken", false)
      testIt(process.env.UBIVAR_TEST_TOKEN, true)

      it("Should update me", function(done){
        var ubivar        = require("../../lib")(process.env.UBIVAR_TEST_TOKEN, "latest")
        ubivar.me.retrieve(function(err, res){
          var me          = res.data[0]
            , vrand       = ""+Math.random()
          me.session_id   = vrand 
          ubivar.me.update(me, function(err, res){
            if(!err && res.status === 200 && vrand === res.data[0].session_id){
              done()
            } else {
              console.log("\n\nError:", err
              , "\nResponse:"         , res
              , "\nVrand:"            , vrand)
              done(new Error("Should update me"))
            }
          })
        })
      })

      it("Should fail to delete me", function(done){
        var ubivar    = require("../../lib")(process.env.UBIVAR_TEST_TOKEN, "latest")
        ubivar.me.del(function(err, res){
          if(err){
            done()
          } else {
            done(new Error("Should not return any deleted resource"))
          }
        })
      })

      it("Should list a single me", function(done){
        var ubivar    = require("../../lib")(process.env.UBIVAR_TEST_TOKEN, "latest")
        ubivar.me.list(function(err, res){
          if(!err && res.status === 200 && res.data.length === 1){
            done()
          } else {
            console.log("\n\nError:", err
            , "\nResponse:"         , res)
            done(new Error("Should list a single me"))
          }
        })
      })
    })

    _.each(resources, function(resource){
      describe(resource[0].toUpperCase() + resource.slice(1)
      , function(){
        var example   = require("../data/"+resource)
          , idResource

        it("Should create and return a resource", function(done){
          ubivar[resource].create(example[0], function(err, res){
            if(err) done(err)
            else if(!!res.data && !!res.data[0] && !!res.data[0].id){
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
          ubivar[resource].update(idResource, example[1], function(err, res){
            if(res.status === 200 && res.data.length === 1){
              var newData   = res.data[0]
                , sentData  = example[1]
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

        it("Should list the resources", function(done){
          var params  = {"start_after": 0, "end_before": 1}
            , nList   = params.end_before - params.start_after

          ubivar[resource].list(params, function(err, res){
            if(res.status === 200 && res.data.length === nList){
              done()
            } else {
              done(new Error("Did not return a list of " + resource))
            }
          })
        })
      })
    })
  })
})
