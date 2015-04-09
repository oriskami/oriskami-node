"use strict"

var _             = require("lodash")
  , expect        = require("chai").expect
  , ubivar        = require("../../ubivar")

describe("Status", function(){
  it("Should list of valid set of uptime statuses", function(done){

    ubivar.status.list(function(err, res){
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

  it("Should filter status based on timestamp", function(done){
    var begin = "2015-03-30 23:00:00"
      , end   = "2015-03-30 24:00:00"

    ubivar.status.list({"timestamp":{ "gte":begin , "lte":end}}, function(err, res){

      var results = !err && res.data.length > 0 ? res.data : null

      if(err){
        console.log(err)
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

  it("Should summary the status", function(done){
    ubivar.status.summary(function(err, res){
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
