var _                 = require("lodash")
  , expect            = require("chai").expect
  , ubivar            = require("../../ubivar")
  , methods           = ["create", "retrieve", "update", "del", "list"]

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

    it("Should create", function(done){
      ubivar["FilterScoringsDedicated"].create({
        "query_target"      : "sample:100" 
      , "query_base"        : "fr" 
      , "features"          : "all" 
      }, done)
    })

    it("Should retrieve", function(done){
      ubivar["FilterScoringsDedicated"].retrieve(0, done)
    })

    it("Should update status", function(done){
      ubivar["FilterScoringsDedicated"].create({
        "is_active": "false"
      }, function(err, res){
        if(!err && res.data && res.data.is_active === "false"){
          ubivar["FilterScoringsDedicated"].create({
            "is_active": "true"
          }, function(err, res){
            if(!err && res.data && res.data.is_active === "true"){
              done()
            } else if(!err){
              done(new Error("Failed to roll back 'is_active'"))
            } else {
              done(err)
            }
          })
        } else if(!err){
          done(new Error("Failed to set 'is_active'"))
        } else {
          done(err)
        }
      })
    })
  })
})
