"use strict"

var _         = require("lodash")
  , expect    = require("chai").expect
  , ubivar    = require("../ubivar")

describe("Ubivar", function() {

  var rootProps = ["_api"]
    , subProps  = ["auth","protocol","timeout","resources","revokedCerts","headers","request"]
    , methods   = ["create", "retrieve", "update", "del", "list"]
    , resources = ubivar.get("resources") 

  this.timeout(20000)

  describe("Properties", function() {
    _.each(rootProps, function(key){
      it("Should have ."+key, function(){
        expect(ubivar[key]).to.exist
      })
    })

    _.each(subProps, function(key){
      it("Should have ._api."+key, function(){
        expect(ubivar._api[key]).to.exist
      })
    })

    it("Should have Resources", function() {
      var nResources = resources.length - rootProps.length  
      expect(nResources > 0).to.be.true
    })
    describe("Timeout", function(){
      it("Should allow to change default value", function(){
        ubivar.set("timeout", 900);
        expect(ubivar.get('timeout')).to.equal(900)
      })

      it("Should allow a reset to default by setting to 'null'", function(){
        ubivar.set("timeout", null)
        expect(ubivar.get('timeout')).to.equal(require('http').createServer().timeout)
      })
    })
  })

  describe("Methods", function() {
    it("Should have accessor methods", function() {
        expect(ubivar.get).to.exist
        expect(ubivar.set).to.exist
    })

    _.each(subProps, function(key){
      it("Should get and set property ._api."+key, function(){
        var oldValue  = ubivar.get(key)
          , newValue  = ""+Math.random()
        ubivar.set(key, newValue)
        expect(ubivar.get(key)).to.equal(newValue)
        ubivar.set(key, oldValue)
        expect(ubivar.get(key)).to.equal(oldValue)
      })
    })
  })

})
