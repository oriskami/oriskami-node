var _                 = require("lodash")
  , expect            = require("chai").expect
  , oriskami            = require("../../oriskami")
  , methods           = ["retrieve", "list"]

describe("Router", function(){
  describe("Properties", function(){
    it("Should have a name and path attribute", function() {
      expect(oriskami["Router"]["path"]).to.exist
    })

    it("Should link to parent (oriskami)", function() {
      expect(oriskami["Router"]["oriskami"]).to.exist
    })

    _.each(methods, function(method){
      var METHOD      = method.toUpperCase()
      it("Should have "+METHOD+" methods", function(done) {
        if(!_.isFunction(oriskami["Router"][method])){
          return done(new Error("Should have "+METHOD+" methods"))
        }
        done()
      })
    })
  })

  describe("Methods", function(){
    it("Should retrieve", function(done){
      oriskami["Router"].retrieve(0, function(err, res){
        var isStatusOk = res.statusCode >= 200 && res.statusCode <= 204
        if(!err && res.data.length >= 0){
          done()
        } else {
          done(new Error("Did not retrieve"))
        }
      })
    })
  })
})
