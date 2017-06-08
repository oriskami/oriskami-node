var _                 = require("lodash")
  , expect            = require("chai").expect
  , ubivar            = require("../../ubivar")
  , methods           = ["update","list"]

describe("RouterParameter", function(){
  describe("Properties", function(){
    it("Should have a name and path attribute", function() {
      expect(ubivar["RouterParameter"]["path"]).to.exist
    })

    it("Should link to parent (ubivar)", function() {
      expect(ubivar["RouterParameter"]["ubivar"]).to.exist
    })

    _.each(methods, function(method){
      var METHOD      = method.toUpperCase()
      it("Should have "+METHOD+" methods", function(done) {
        if(!_.isFunction(ubivar["RouterParameter"][method])){
          return done(new Error("Should have "+METHOD+" methods"))
        }
        done()
      })
    })
  })


  describe("Methods", function(){

    it("Should list", function(done){
      ubivar["RouterParameter"].list(function(err, res){
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
      ubivar["RouterParameter"].update(ruleId
      , {"th0": {"amount": 100, "cur": "EUR"}}
      , function(err, res){
        if(err){ 
          console.log(err, res)
          done(new Error("Did not update")) 
        }

        var rule = res.data[ruleId]
        if(rule.th0.amount === 100){
          // roll back
          ubivar["RouterParameter"].update(ruleId
          , {"th0": {"amount": 200, "cur": "EUR"}}
          , done)
        } else {
          console.log(err, res)
          done(new Error("Did not update"))
        }
      })
    })
  })
})
