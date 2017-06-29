var _                 = require("lodash")
  , expect            = require("chai").expect
  , ubivar            = require("../../ubivar")
  , methods           = ["list", "update"]

describe("RouterDataGeocoding", function(){
  describe("Properties", function(){
    it("Should have a name and path attribute", function() {
      expect(ubivar["RouterDataGeocoding"]["path"]).to.exist
    })

    it("Should link to parent (ubivar)", function() {
      expect(ubivar["RouterDataGeocoding"]["ubivar"]).to.exist
    })

    _.each(methods, function(method){
      var METHOD      = method.toUpperCase()
      it("Should have "+METHOD+" methods", function(done) {
        if(!_.isFunction(ubivar["RouterDataGeocoding"][method])){
          return done(new Error("Should have "+METHOD+" methods"))
        }
        done()
      })
    })
  })

  describe("Methods", function(){
    it("Should list", function(done){
      ubivar["RouterDataGeocoding"].list(function(err, res){
        if(err) {
          console.log(err, res)
          done(err) 
        } else {
          done()
        }
      })
    })

    it("Should update", function(done){
      ubivar.set("timeout", 20000)
      var ruleId = "0"
      ubivar["RouterDataGeocoding"].update(ruleId
      , {"is_active": "true"}
      , function(err, res){
        if(err){ 
          console.log(err, res)
          done(new Error("Did not update")) 
        }

        var rule = res.data
        if(rule.is_active === "true"){
          // roll back
          ubivar["RouterDataGeocoding"].update(ruleId
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
