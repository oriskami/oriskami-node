var _                 = require("lodash")
  , expect            = require("chai").expect
  , ubivar            = require("../../ubivar")
  , methods           = ["update","list"]

describe("Parameters", function(){
  describe("Properties", function(){
    it("Should have a name and path attribute", function() {
      expect(ubivar["Parameters"]["path"]).to.exist
    })

    it("Should link to parent (ubivar)", function() {
      expect(ubivar["Parameters"]["ubivar"]).to.exist
    })

    _.each(methods, function(method){
      var METHOD      = method.toUpperCase()
      it("Should have "+METHOD+" methods", function(done) {
        if(!_.isFunction(ubivar["Parameters"][method])){
          return done(new Error("Should have "+METHOD+" methods"))
        }
        done()
      })
    })
  })


  describe("Methods", function(){

    it("Should list", function(done){
      ubivar["Parameters"].list(function(err, res){
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
      ubivar["Parameters"].update(ruleId
      , {"th0": {"amount": 100, "cur": "EUR"}}
      , function(err, res){
        if(err){ 
          console.log(err, res)
          done(new Error("Did not update")) 
        }

        var rule = res.data[ruleId]
        if(rule.th0.amount === 100){
          // roll back
          ubivar["Parameters"].update(ruleId
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
