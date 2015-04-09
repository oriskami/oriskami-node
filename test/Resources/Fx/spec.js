"use strict"

var _             = require("lodash")
  , expect        = require("chai").expect
  , ubivar        = require("../../ubivar")

describe("FX (Foreign Exchange)", function(){
  it("Should retrieve FX", function(done){

    ubivar.fx.retrieve(function(err, res){

      if(err){
        console.log(err)
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
        console.log(err)
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
        console.log(err)
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
