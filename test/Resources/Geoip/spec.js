"use strict"

var _             = require("lodash")
  , expect        = require("chai").expect
  , ubivar        = require("../../ubivar")

describe("Geoip", function(){
  it("Should return a valid geoip resource", function(done){

    ubivar.geoip.list({"ip":"207.97.227.239"}, function(err, res){
      var result  = !err && res.data.length > 0 ? res.data[0] : null
        , fields  = ["ip","start_ip","end_ip","block_length","country","region","city","latitude","longitude"]

      if(err){ 
        console.log(err)
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
})
