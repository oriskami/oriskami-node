"use strict"

var _             = require("lodash")
  , expect        = require("chai").expect
  , ubivar        = require("../../ubivar")
  , Ubivar        = require("../../../lib")
  , version       = ubivar._api.request.version
  , token         = process.env.UBIVAR_TEST_TOKEN

console.log("\n\n\nVERSION", version, "\n\n\n")

describe("Me", function(){
  var testIt      = function(token, isAuthorized){
    var message   = "Should be " + (isAuthorized?"  ":"un") + "authorized "
    message       += !!token ? ("'"+token.slice(0,5)+"...'") : ("'"+token+"'")

    it(message, function(done){
      var ubivar  = Ubivar(token, version)
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
    var ubivar        = new Ubivar(token, version)
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
    var ubivar    = new Ubivar(token, version)
    ubivar.me.del(function(err, res){
      if(err){
        done()
      } else {
        done(new Error("Should fail to delete 'me'!"))
      }
    })
  })

  it("Should list a single me", function(done){
    var ubivar    = new Ubivar(token, version)
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
