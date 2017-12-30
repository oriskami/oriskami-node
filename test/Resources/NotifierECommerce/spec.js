var _                 = require("lodash")
  , expect            = require("chai").expect
  , oriskami            = require("../../oriskami")
  , examples          = require("../../data/Event")
  , jsons             = _.map(examples, function(x){return {"id": x.id, "parameters": x}})
  , ids               = _.map(examples, function(x){return x.id})
  , rootProps         = ["log","_api"]
  , subProps          = ["auth","protocol","timeout","resources","revokedCerts","headers","request"]
  , methods           = ["retrieve", "update", "del", "list"]

describe("NotifierECommerce", function(){
  describe("Properties", function(){
    it("Should have a name and path attribute", function() {
      expect(oriskami["NotifierECommerce"]["path"]).to.exist
    })

    it("Should link to parent (oriskami)", function() {
      expect(oriskami["NotifierECommerce"]["oriskami"]).to.exist
    })

    _.each(methods, function(method){
      var METHOD      = method.toUpperCase()
      it("Should have "+METHOD+" methods", function(done) {
        if(!_.isFunction(oriskami["NotifierECommerce"][method])){
          return done(new Error("Should have "+METHOD+" methods"))
        }
        done()
      })
    })
  })

  describe("Methods", function(){
    it("Should update", function(done){
      var ruleId = "0"
      oriskami.set("timeout", 20000)
      oriskami["NotifierECommerce"].update(ruleId
      , {"is_active": "false"}
      , function(err, res){
        if(err){ done(new Error("Did not create")) }

        var rule = res.data[ruleId]
        if(rule.is_active === "false"){
          // roll back
          oriskami["NotifierECommerce"].update(ruleId, {"value": "true"}, done)
        } else {
          console.log(err, res)
          done(new Error("Did not update"))
        }
      })
    })

    it("Should list", function(done){
      oriskami["NotifierECommerce"].list(done)
    })
  })
})
