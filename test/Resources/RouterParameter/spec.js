var _                 = require("lodash")
  , expect            = require("chai").expect
  , oriskami            = require("../../oriskami")
  , methods           = ["update","list"]

describe("RouterParameter", function(){
  describe("Properties", function(){
    it("Should have a name and path attribute", function() {
      expect(oriskami["RouterParameter"]["path"]).to.exist
    })

    it("Should link to parent (oriskami)", function() {
      expect(oriskami["RouterParameter"]["oriskami"]).to.exist
    })

    _.each(methods, function(method){
      var METHOD      = method.toUpperCase()
      it("Should have "+METHOD+" methods", function(done) {
        if(!_.isFunction(oriskami["RouterParameter"][method])){
          return done(new Error("Should have "+METHOD+" methods"))
        }
        done()
      })
    })
  })


  describe("Methods", function(){

    it("Should list", function(done){
      oriskami["RouterParameter"].list(function(err, res){
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
      oriskami["RouterParameter"].update(ruleId
      , {"f_cogs": "0.25"}
      , function(err, res){
        if(err){ 
          console.log(err, res)
          done(new Error("Did not update")) 
        }

        var rule = res.data[ruleId]
        if(rule.f_cogs === "0.25"){
          // roll back
          oriskami["RouterParameter"].update(ruleId
          , {"f_cogs": "0.50"} 
          , done)
        } else {
          console.log(err, res)
          done(new Error("Did not update"))
        }
      })
    })
  })
})
