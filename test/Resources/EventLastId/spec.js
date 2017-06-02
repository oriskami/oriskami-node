var _                 = require("lodash")
  , expect            = require("chai").expect
  , ubivar            = require("../../ubivar")
  , examples          = require("../../data/Event")
  , jsons             = _.map(examples, function(x){return {"id": x.id, "parameters": x}})
  , ids               = _.map(examples, function(x){return x.id})
  , rootProps         = ["log","_api"]
  , subProps          = ["auth","protocol","timeout","resources","revokedCerts","headers","request"]
  , methods           = ["list"]


describe("EventLastId", function(){
  describe("Properties", function(){
    it("Should have a name and path attribute", function() {
      expect(ubivar["EventLastId"]["path"]).to.exist
    })

    it("Should link to parent (ubivar)", function() {
      expect(ubivar["EventLastId"]["ubivar"]).to.exist
    })

    _.each(methods, function(method){
      var METHOD      = method.toUpperCase()
      it("Should have "+METHOD+" methods", function(done) {
        if(!_.isFunction(ubivar["EventLastId"][method])){
          return done(new Error("Should have "+METHOD+" methods"))
        }
        done()
      })
    })
  })

  describe("Methods", function(){
    var json        = jsons[0] 
      , idResource

    it("Should list the last id", function(done){
      ubivar["EventLastId"].list(function(err, res){
        if(err) {
          console.log(err, res)
          done(err) 
        } else if(res.data.length === 1 && res.data[0].id === "3") {
          done()
        } else {
          console.log(res)
          done(new Error("Should have only one returned element")) 
        }
      })
    })
  })
})
