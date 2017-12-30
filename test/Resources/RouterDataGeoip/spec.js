var _                 = require("lodash")
  , expect            = require("chai").expect
  , oriskami            = require("../../oriskami")
  , methods           = ["list", "update"]

describe("RouterDataGeoip", function(){
  describe("Properties", function(){
    it("Should have a name and path attribute", function() {
      expect(oriskami["RouterDataGeoip"]["path"]).to.exist
    })

    it("Should link to parent (oriskami)", function() {
      expect(oriskami["RouterDataGeoip"]["oriskami"]).to.exist
    })

    _.each(methods, function(method){
      var METHOD      = method.toUpperCase()
      it("Should have "+METHOD+" methods", function(done) {
        if(!_.isFunction(oriskami["RouterDataGeoip"][method])){
          return done(new Error("Should have "+METHOD+" methods"))
        }
        done()
      })
    })
  })

  describe("Methods", function(){
    it("Should list", function(done){
      oriskami["RouterDataGeoip"].list(function(err, res){
        if(err) {
          console.log(err, res)
          done(err) 
        } else {
          done()
        }
      })
    })

    it("Should update", function(done){
      oriskami.set("timeout", 20000)
      var ruleId = "0"
      oriskami["RouterDataGeoip"].update(ruleId
      , {"is_active": "true"}
      , function(err, res){
        if(err){ 
          console.log(err, res)
          done(new Error("Did not update")) 
        }

        var rule = res.data
        if(rule.is_active === "true"){
          // roll back
          oriskami["RouterDataGeoip"].update(ruleId
          , {"is_active": "false"}
          , done)
        } else {
          console.log(err, res)
          done(new Error("Did not update"))
        }
      })
    })
  })
})
