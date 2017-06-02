var _                 = require("lodash")
  , expect            = require("chai").expect
  , ubivar            = require("../../ubivar")
  , examples          = require("../../data/Event")
  , jsons             = _.map(examples, function(x){return {"id": x.id, "parameters": x}})
  , ids               = _.map(examples, function(x){return x.id})
  , rootProps         = ["log","_api"]
  , subProps          = ["auth","protocol","timeout","resources","revokedCerts","headers","request"]
  , methods           = ["retrieve", "update", "del", "list"]

describe("FilterBlacklist", function(){
  describe("Properties", function(){
    it("Should have a name and path attribute", function() {
      expect(ubivar["FilterBlacklist"]["path"]).to.exist
    })

    it("Should link to parent (ubivar)", function() {
      expect(ubivar["FilterBlacklist"]["ubivar"]).to.exist
    })

    _.each(methods, function(method){
      var METHOD      = method.toUpperCase()
      it("Should have "+METHOD+" methods", function(done) {
        if(!_.isFunction(ubivar["FilterBlacklist"][method])){
          return done(new Error("Should have "+METHOD+" methods"))
        }
        done()
      })
    })
  })

  describe("Methods", function(){
    it("Should list", function(done){
      ubivar["FilterBlacklist"].list(done)
    })

    it("Should update", function(done){
      var blacklistId = "0"
      ubivar["FilterBlacklist"].update(blacklistId
      , {"is_active": "true"}
      , function(err, res){
        if(err){ done(new Error("Did not create")) }

        var blacklist = res.data[blacklistId]
        if(blacklist.is_active === "true"){
          // roll back
          ubivar["FilterBlacklist"].update(blacklistId
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
