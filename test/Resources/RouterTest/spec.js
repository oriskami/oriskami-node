var _                 = require("lodash")
  , expect            = require("chai").expect
  , oriskami            = require("../../oriskami")
  , methods           = ["retrieve", "list"]

describe.skip("RouterTest", function(){
  describe("Properties", function(){
    it("Should have a name and path attribute", function() {
      expect(oriskami["RouterTest"]["path"]).to.exist
    })

    it("Should link to parent (oriskami)", function() {
      expect(oriskami["RouterTest"]["oriskami"]).to.exist
    })

    _.each(methods, function(method){
      var METHOD      = method.toUpperCase()
      it("Should have "+METHOD+" methods", function(done) {
        if(!_.isFunction(oriskami["RouterTest"][method])){
          return done(new Error("Should have "+METHOD+" methods"))
        }
        done()
      })
    })
  })

  describe("Methods", function(){
    it("Should update", function(done){
      var now1        = (new Date()).toISOString().slice(0,16) + "_abc"
        , now2        = (new Date()).toISOString().slice(0,16) + "_def"
        , ssize       = parseInt(Math.random() * 1000)
      oriskami["RouterTest"].update(0, {
        "query_target": now1
      , "query_base"  : now2
      , "from"        : "filter_rules_base"
      , "to"          : "notifier_emails"
      , "sample_size" : ssize
      , "use_cache"   : "true"
      }, function(err, res){
        if(err) {
          console.log(err, res)
          done(err) 
        } else if(now1 !== res.data.query_target) {
          done(new Error("Failed to update (query_target)"))
        } else if(now2 !== res.data.query_base) {
          done(new Error("Failed to update (query_base)"))
        } else if(ssize !== res.data.sample_size) {
          done(new Error("Failed to update (sample_size)"))
        } else {
          done()
        }
      })
    })

    it("Should create", function(done){
      var disregarded = {}
      oriskami["RouterTest"].create(disregarded, function(err, res){
        if(err){
          console.log(err, res)
          done(err)
        } else {
          done()
        }
      })
    })

    it("Should list", function(done){
      oriskami["RouterTest"].list(function(err, res){
        if(err) {
          console.log(err, res)
          done(err) 
        } else {
          done()
        }
      })
    })
  })
})
