var _                 = require("lodash")
  , expect            = require("chai").expect
  , ubivar            = require("../../ubivar")
  , methods           = ["update"]

describe("RouterData", function(){
  describe("Properties", function(){
    it("Should have a name and path attribute", function() {
      expect(ubivar["RouterData"]["path"]).to.exist
    })

    it("Should link to parent (ubivar)", function() {
      expect(ubivar["RouterData"]["ubivar"]).to.exist
    })

    _.each(methods, function(method){
      var METHOD      = method.toUpperCase()
      it("Should have "+METHOD+" methods", function(done) {
        if(!_.isFunction(ubivar["RouterData"][method])){
          return done(new Error("Should have "+METHOD+" methods"))
        }
        done()
      })
    })
  })


  describe("Methods", function(){

    it("Should list", function(done){
      ubivar["RouterData"].list(function(err, res){
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
      ubivar["RouterData"].update(ruleId
      , {"is_active": "true"}
      , function(err, res){
        if(err){ 
          console.log(err, res)
          done(new Error("Did not update")) 
        }

        var rule = res.data[ruleId]
        if(rule.is_active === "true"){
          // roll back
          ubivar["RouterData"].update(ruleId
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
