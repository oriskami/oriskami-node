var _                 = require("lodash")
  , expect            = require("chai").expect
  , oriskami            = require("../../oriskami")
  , methods           = ["create", "retrieve", "update", "del", "list"]

describe("FilterScoringsDedicated", function(){
  describe("Properties", function(){
    it("Should have a name and path attribute", function() {
      expect(oriskami["FilterScoringsDedicated"]["path"]).to.exist
    })

    it("Should link to parent (oriskami)", function() {
      expect(oriskami["FilterScoringsDedicated"]["oriskami"]).to.exist
    })

    _.each(methods, function(method){
      var METHOD      = method.toUpperCase()
      it("Should have "+METHOD+" methods", function(done) {
        if(!_.isFunction(oriskami["FilterScoringsDedicated"][method])){
          return done(new Error("Should have "+METHOD+" methods"))
        }
        done()
      })
    })
  })

  describe("Methods", function(){
    it("Should list", function(done){
      oriskami["FilterScoringsDedicated"].list(function(err, res){
        if(err){
          console.log(err)
          return done(new Error("Failed to list filter scorings dedicated"))
        }
        done()
      })
    })

    it("Should create", function(done){
      oriskami["FilterScoringsDedicated"].create({
        "query_target"      : "sample:100" 
      , "query_base"        : "fr" 
      , "features"          : "all" 
      }, (err, res) => {
        if(err) {
          console.log(err)
          return done(new Error("Failed to create scoring"))
        }
        done()
      })
    })

    it("Should retrieve", function(done){
      oriskami["FilterScoringsDedicated"].create({
        "query_target"      : "sample:100" 
      , "query_base"        : "fr" 
      , "features"          : "all" 
      }, (err, res0) => {
        if(err){
          console.log(err)
          return done(new Error("Failed to create / retrieve score"))
        }
        var expectedScoreId = res0.model_id
        oriskami["FilterScoringsDedicated"].retrieve(res0.model_id, (err, res1) => {
          if(err){
            console.log(err)
            console.log("Expected score id", expectedScoreId)
            return done(new Error("Failed to retrieve the created score"))
          }
          console.log(res0, res1)
          done()
        })
      })
    })

    xit("Should update status", function(done){
      oriskami["FilterScoringsDedicated"].create({
        "is_active": "false"
      }, function(err, res){
        if(!err && res.data && res.data.is_active === "false"){
          oriskami["FilterScoringsDedicated"].create({
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
