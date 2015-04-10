"use strict"

var _             = require("lodash")
  , expect        = require("chai").expect
  , ubivar        = require("../../ubivar")

describe("CI", function(){
  it("Should list of valid set of CI", function(done){

    ubivar.ci.list(function(err, res){
      var result  = !err && res.data.length > 0 ? res.data[0] : null
        , fields  = ["id", "url", "timestamp", "status"]

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

  it("Should filter CI based on timestamp", function(done){
    var begin   = "2015-04-09 13:00:00"
      , end     = "2015-04-09 14:00:00"

    ubivar.ci.list({"timestamp":{ 
        "gte"   : begin
      , "lte"   : end
      }
    }, function(err, res){

      var results = !err && res.data.length > 0 ? res.data : null

      if(err){
        console.log(err)
        return done(err)

      } else if(res.data.length === 0){ 
        return done(new Error("Did not return results" ))
      } 

      begin           = new Date(begin)
      end             = new Date(end)

      _.each(results, function(result){
        var time      = new Date(result.timestamp)
          , now       = new Date()
          , tzOffset  = now.getTimezoneOffset()*60000

        if((time+tzOffset-begin)<0 || (end+tzOffset-time)<0){
          console.log("\n"+begin, "\n"+end, "\n"+time, time-begin, end-time)
          return done(new Error("Should return CI within ["+begin,",",end+"]: ", time))
        }
      })

      done() 
    })
  })

  it("Should summary the CI", function(done){
    ubivar.ci.summary(function(err, res){
      if(err){
        console.log(err)
        return done(err)
      } else if(res.data.length === 0){
        return done(new Error("Did not return results" ))
      }

      var aRow        = res.data[0]
        , fieldsExp   = ["url", "timestamp_last"]
        , fieldsObs   = _.keys(aRow)

      _.each(fieldsExp, function(field){
        if(!_.contains(fieldsObs, field)){
          return done(new Error("Should return field '"+field+"'"))
        }
      })

      done()
    })
  })
})
