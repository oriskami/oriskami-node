"use strict"

var _             = require("lodash")
  , expect        = require("chai").expect
  , ubivar        = require("../../ubivar")

describe("Routing", function(){
  it("Should return a valid routing resource", function(done){
    ubivar.routing.list({"limit":"1"}, function(err, res){
      var result  = !err && res.data.length > 0 ? res.data[0] : null
        , fields  = ["status","insert_timestamp","routing_timestamp","update_timestamp"]

      if(err){ 
        console.log(err, res)
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

  describe("Pagination", function(){
    it("Should return routing greater than (gt) a given timestamp", function(done){
      ubivar.transactions.list({"limit":2, "order":"id"}, function(err, res){
        if(err){ 
          console.log(err, res)
          return done(err)
        }

        var tx_id_min = res.data[0].id
          , tx_id_max = res.data[1].id

        ubivar.routing.list({"id":{"gte":tx_id_min, "lte":tx_id_max}}, function(err, res){
          if(err){ 
            console.log(err, res)
            return done(err)
          } else if(res.data.length !== 2){ 
            return done(new Error("Did not return the right number of results" ))
          } 

          done()
        })
      })
    })
  })
})
