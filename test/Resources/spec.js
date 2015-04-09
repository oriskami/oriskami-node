"use strict"

var _                   = require("lodash")
  , expect              = require("chai").expect
  , ubivar              = require("../ubivar")
  , token               = process.env.UBIVAR_TEST_TOKEN

ubivar.set("timeout", 20000)

describe("Resources", function() {
  var rootProps         = ["log","_api"]
    , subProps          = ["auth","protocol","timeout","resources","revokedCerts","headers","request"]
    , methods           = ["create", "retrieve", "update", "del", "list"]
    , allResources      = ubivar.get("resources")
    , specialResources  = ["me", "fx", "bins", "geoip", "status"]
    , genericResources  = _.difference(allResources, specialResources) 

  describe("Properties", function(){
    it("Should have a name and path attribute", function() {
      _.each(genericResources, function(resource){
        _.each(methods, function(method){
          expect(ubivar[resource]["path"]).to.exist
        })
      })
    })

    it("Should link to parent (ubivar)", function() {
      _.each(genericResources, function(resource){
        _.each(methods, function(method){
          expect(ubivar[resource]["ubivar"]).to.exist
        })
      })
    })

    it("Should have CRUD(L) methods", function() {
      _.each(genericResources, function(resource){
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
        message       += !!token ? ("'"+token.slice(0,5)+"...'") : ("'"+token+"'")

        it(message, function(done){
          var ubivar  = require("../../lib")(token, "latest")
          ubivar.set("timeout", 20000)

          ubivar.me.retrieve(function(gotError, res){
            if( isAuthorized &&  gotError){console.log(gotError); done((new Error(message)))}
            if( isAuthorized && !gotError) done()
            if(!isAuthorized &&  gotError) done()
            if(!isAuthorized && !gotError){console.log(gotError); done((new Error(message)))}
          })
        })
      }

      testIt(null         , false)
      testIt(undefined    , false)
      testIt("unauthToken", false)
      testIt(token, true)

      it("Should update me", function(done){
        var ubivar        = require("../../lib")(token, "latest")
          , vrand         = ""+Math.random()

        ubivar.me.update({"primary_phone": vrand}, function(err, res){
          if(!err && res.status === 200 && vrand === res.data[0]["primary_phone"]){
            return done()
          } 

          console.log("\n\nError:", err
          , "\nResponse:"         , res
          , "\nVrand:"            , vrand)
          done(new Error("Should update me"))
        })
      })

      it("Should fail to delete me", function(done){
        var ubivar    = require("../../lib")(token, "latest")
        ubivar.me.del(function(err, res){
          if(err){
            done()
          } else {
            done(new Error("Should fail to delete 'me'!"))
          }
        })
      })

      it("Should list a single me", function(done){
        var ubivar    = require("../../lib")(token, "latest")
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

    describe("FX", function(){
      it("Should retrieve FX", function(done){
        ubivar.fx.retrieve(function(err, res){
          if(err){
            done(err)
          } else if(!(res.status === 200 && res.data.length > 1)){
            done(new Error("Did not return FX of the day "))
          } else{
            var cur_from        = _.pluck(res.data, "cur_from")
              , cur_to          = _.pluck(res.data, "cur_to"  )
              , rates           = _.pluck(res.data, "rate"    )
              , dates           = _.pluck(res.data, "date"    )
              , cur_exp         = ["AUD","BGN","BRL","CAD","CHF","CNY","CZK","DKK","GBP","HKD","HRK","HUF","IDR","ILS","INR","JPY","KRW","MXN","MYR","NOK","NZD","PHP","PLN","RON","RUB","SEK","SGD","THB","TRY","USD","ZAR"]
              , cur_obs         = _.union(cur_from, cur_to)
              , hasAllCurrencies= _.difference(cur_exp, cur_obs).length === 0
              , validNumbers    = _.reduce(rates, function(memo, rate){return memo && _.isNumber(rate)}, true)
              , validDates      = _.reduce(dates, function(memo, date){return memo && (new Date() - new Date(date)/(1000*60*60*24)) > 2}, true)

            if(!hasAllCurrencies){
              var msg           = "cur exp:"+JSON.stringify(cur_exp)+"\ncur to:"+JSON.stringify(cur_obs)+"\ndelta:"+JSON.stringify(cur_delta)
              console.log(msg)
              done(new Error())
            } else if(!validDates){
              console.log(dates)
              done(new Error("Latest FX should be less than one day old"))
            } else if(!validNumbers) {
              console.log(rates)
              done(new Error("Did not return a number"))
            } else {
              done()
            }
          }
        })
      })

      it("Should return exchange rate between non-default 'cur'", function(done){
        var cur_from  = "CAD"
          , cur_to    = "GBP"

        ubivar.fx.list({"cur_from":cur_from, "cur_to":cur_to}, function(err, res){
          if(err){
            done(err)
          } else if(!(res.status === 200 && res.data.length === 1)){
            done(new Error("Did not return FX of the day for two custom currencies"))
          } else {
            var fx  = res.data[0]
            if(fx.cur_from !== cur_from){
              done(new Error("Did not return the custom 'cur_from'"))
            } else if(fx.cur_to !== cur_to){
              done(new Error("Did not return the custom 'cur_to'"))
            } else if(!_.isNumber(fx.rate)) {
              done(new Error("Did not return a number"))
            } else {
              done()
            }
          }
        })
      })

      it("Should return fx rate for a specific date", function(done){
        var date_exp  = "2015-01-01"

        ubivar.fx.list({"date":date_exp}, function(err, res){
          if(err){
            done(err)
          } else if(!(res.status === 200 && res.data.length > 1)){
            done(new Error("Did not return any FX"))
          } else {
            var dates           = _.pluck(res.data, "date"    )
              , fxEurUsd        = _.filter(res.data, function(fx){ return fx.cur_from === "EUR" && fx.cur_to === "USD" })[0]
              , validDates      = _.reduce(dates, function(memo, date_obs){
                return memo && (new Date(date_exp) - new Date(date_obs))/(1000*60*60*24) === 0
              }, true)

            if(!validDates){
              done(new Error("Did not return the custom 'date'"))
            } else if(fxEurUsd.rate !== 1.2141) {
              done(new Error("Did not return the correct EUR/USD FX rate"))
            } else {
              done()
            }
          }
        })
      })
    })

    describe("Status", function(){
      it("Should list of valid set of uptime statuses", function(done){
        ubivar.status.list(function(err, res){
          var result  = !err && res.data.length > 0 ? res.data[0] : null
            , fields  = ["id", "timestamp", "url", "status"]

          if(err){
            return done(err)
          } else if(res.data.length === 0){ 
            return done(new Error("Did not return results" ))
          } 
          _.each(fields, function(field){
            if(!_.has(result, field)){
              return done(new Error("Should have a '" + field + "'"))
            }
          })
          done() 
        })
      })

      it("Should filter status based on timestamp", function(done){
        var begin = "2015-03-30 23:00:00"
          , end   = "2015-03-30 24:00:00"
        ubivar.status.list({"timestamp":{ "gte":begin , "lte":end}}, function(err, res){

          var results = !err && res.data.length > 0 ? res.data : null

          if(err){
            return done(err)
          } else if(res.data.length === 0){ 
            return done(new Error("Did not return results" ))
          } 

          begin   = new Date(begin)
          end     = new Date(end)
          _.each(results, function(result){
            var time  = new Date(result.timestamp)
            if((time-begin)<0 || (end-time)<0){
              return done(new Error("Should return statuses within ["+begin,",",end+"]: ", time))
            }
          })

          done() 
        })
      })
    })

    describe("Bank Identification Number", function(){
      it("Should list a valid set of BINs", function(done){
        ubivar.bins.list(function(err, res){
          var result  = !err && res.data.length > 0 ? res.data[0] : null
            , fields  = ["id","brand","country_code","country_name","bank","card_type","card_category"]

          if(err){ return done(err)
          } else if(res.data.length === 0){ 
            return done(new Error("Did not return results" ))
          } 
          _.each(fields, function(field){
            if(!_.has(result, field)){
              return done(new Error("Should have a '" + field + "'"))
            }
          })
          done() 
        })
      })

      it("Should 'start_after' and 'end_before'", function(done){
        var begin     = 400400
          , end       = 400500
        ubivar.bins.list({"start_after":begin, "end_before":end}, function(err, res){
          var results = !err && res.data.length > 0 ? res.data : null
          
          if(err){ return done(err)
          } else if(res.data.length === 0){ 
            return done(new Error("Did not return results" ))
          } 
          _.each(results, function(result){
            if(result.id <= begin || result.id >= end){
              return done(new Error("Not a BIN with ["+begin+","+end+"]: " + result.id))
            }
          })

          done() 
        })
      })

      it("Should select only 'visa' brands", function(done){
        ubivar.bins.list({"brand":"visa"}, function(err, res){
          var results = !err && res.data.length > 0 ? res.data : null
          
          if(err){ return done(err)
          } else if(res.data.length === 0){ 
            return done(new Error("Did not return results" ))
          } 
          _.each(results, function(result){
            if(result.brand.toLowerCase().indexOf("visa") < 0){
              return done(new Error("Not a 'visa' brand: " + result.brand))
            }
          })

          done() 
        })
      })
    })

    describe("Geoip", function(){
      it("Should return a valid geoip resource", function(done){
        ubivar.geoip.list({"ip":"207.97.227.239"}, function(err, res){
          var result  = !err && res.data.length > 0 ? res.data[0] : null
            , fields  = ["ip","start_ip","end_ip","block_length","country","region","city","latitude","longitude"]

          if(err){ return done(err)
          } else if(res.data.length === 0){ 
            return done(new Error("Did not return results" ))
          } 

          _.each(fields, function(field){
            if(!_.has(result, field)){
              return done(new Error("Should have a '" + field + "'"))
            }
          })
          done() 
        })
      })
    })


    _.each(genericResources, function(resource){
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

        describe("Should list and paginate", function(){
          var ids         = []

          before(function(done){
            var example   = require("../data/"+resource)
            this.timeout(5000)
            ubivar[resource].create(example[0], function(err, res){
              if(err) return done(err)
              ids.push(res.data[0].id)
              ubivar[resource].create(example[0], function(err, res){
                if(err) return done(err)
                ids.push(res.data[0].id)
                ubivar[resource].create(example[0], function(err, res){
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
    })
  })
})
