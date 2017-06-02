var _                 = require("lodash")
  , expect            = require("chai").expect
  , ubivar            = require("../../ubivar")
  , examples          = require("../../data/Event")
  , jsons             = _.map(examples, function(x){return {"id": x.id, "parameters": x}})
  , ids               = _.map(examples, function(x){return x.id})
  , rootProps         = ["log","_api"]
  , subProps          = ["auth","protocol","timeout","resources","revokedCerts","headers","request"]
  , methods           = ["retrieve", "update", "del", "list"]

describe("FilterScoringsDedicated", function(){
  describe("Properties", function(){
    it("Should have a name and path attribute", function() {
      expect(ubivar["FilterScoringsDedicated"]["path"]).to.exist
    })

    it("Should link to parent (ubivar)", function() {
      expect(ubivar["FilterScoringsDedicated"]["ubivar"]).to.exist
    })

    _.each(methods, function(method){
      var METHOD      = method.toUpperCase()
      it("Should have "+METHOD+" methods", function(done) {
        if(!_.isFunction(ubivar["FilterScoringsDedicated"][method])){
          return done(new Error("Should have "+METHOD+" methods"))
        }
        done()
      })
    })
  })


  describe("Methods", function(){
    it("Should list", function(done){
      ubivar["FilterScoringsDedicated"].list(done)
    })

    it("Should update", function(done){
      ubivar.set("timeout", 20000)
      var ruleId = "0"
      ubivar["FilterScoringsDedicated"].update(ruleId
      , {"is_active": "true"}
      , function(err, res){
        if(err){ done(new Error("Did not create")) }

        var rule = res.data[ruleId]
        if(rule.is_active === "true"){
          // roll back
          ubivar["FilterScoringsDedicated"].update(ruleId
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
