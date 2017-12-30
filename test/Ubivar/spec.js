"use strict"

var _         = require("lodash")
  , expect    = require("chai").expect
  , oriskami    = require("../oriskami")

describe("Oriskami", function() {

  var rootProps = ["_api"]
    , subProps  = ["auth","protocol","timeout","resources","revokedCerts","headers","request"]
    , methods   = ["create", "retrieve", "update", "del", "list", "summary"]
    , resources = oriskami.get("resources") 

  this.timeout(20000)

  describe("Properties", function() {
    _.each(rootProps, function(key){
      it("Should have ."+key, function(){
        expect(oriskami[key]).to.exist
      })
    })

    _.each(subProps, function(key){
      it("Should have ._api."+key, function(){
        expect(oriskami._api[key]).to.exist
      })
    })

    it("Should have Resources", function() {
      var nResources = resources.length - rootProps.length  
      expect(nResources > 0).to.be.true
    })

    describe("Timeout", function(){
      it("Should allow to change default value", function(){
        oriskami.set("timeout", 900);
        expect(oriskami.get('timeout')).to.equal(900)
      })

      it("Should allow a reset to default by setting to 'null'", function(){
        oriskami.set("timeout", null)
        expect(oriskami.get('timeout')).to.equal(require('http').createServer().timeout)
      })
    })
  })

  describe("Methods", function() {
    it("Should have accessor methods", function() {
        expect(oriskami.get).to.exist
        expect(oriskami.set).to.exist
    })

    _.each(subProps, function(key){
      it("Should get and set property ._api."+key, function(){
        var oldValue  = oriskami.get(key)
          , newValue  = ""+Math.random()
        oriskami.set(key, newValue)
        expect(oriskami.get(key)).to.equal(newValue)
        oriskami.set(key, oldValue)
        expect(oriskami.get(key)).to.equal(oldValue)
      })
    })
  })
})
