var _                 = require("lodash")
  , expect            = require("chai").expect
  , ubivar            = require("../../ubivar")
  , methods           = ["retrieve", "list"]

describe("RouterTest", function(){
  describe("Properties", function(){
    it("Should have a name and path attribute", function() {
      expect(ubivar["RouterTest"]["path"]).to.exist
    })

    it("Should link to parent (ubivar)", function() {
      expect(ubivar["RouterTest"]["ubivar"]).to.exist
    })

    _.each(methods, function(method){
      var METHOD      = method.toUpperCase()
      it("Should have "+METHOD+" methods", function(done) {
        if(!_.isFunction(ubivar["RouterTest"][method])){
          return done(new Error("Should have "+METHOD+" methods"))
        }
        done()
      })
    })
  })

  describe("Methods", function(){
    it("Should list", function(done){
      ubivar["RouterTest"].list(function(err, res){
        if(err) {
          console.log(err, res)
          done(new Error("Did not list")) 
        } else {
          done()
        }
      })
    })
  })
})
