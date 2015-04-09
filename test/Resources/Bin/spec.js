"use strict"

var _             = require("lodash")
  , expect        = require("chai").expect
  , ubivar        = require("../../ubivar")

describe("Bin (Bank Identification Number)", function(){
  it("Should list a valid set of BINs", function(done){

    ubivar.bins.list(function(err, res){
      var result  = !err && res.data.length > 0 ? res.data[0] : null
        , fields  = ["id","brand","country_code","country_name","bank","card_type","card_category"]

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

  it("Should 'start_after' and 'end_before'", function(done){
    var begin     = 400400
      , end       = 400500

    ubivar.bins.list({"start_after":begin, "end_before":end}, function(err, res){
      var results = !err && res.data.length > 0 ? res.data : null
      
      if(err){ 
        console.log(err)
        return done(err)
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
      
      if(err){ 
        console.log(err)
        return done(err)
      } else if(res.data.length === 0){ 
        return done(new Error("Did not return results" ))
      } 

      _.each(results, function(result){
        var isVisa = result.brand.toLowerCase().indexOf("visa") >= 0
        if(!isVisa){
          return done(new Error("Not a 'visa' brand: " + result.brand))
        }
      })

      done() 
    })
  })
})
