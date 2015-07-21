"use strict"

var _             = require("lodash")
  , expect        = require("chai").expect
  , ubivar        = require("../../ubivar")
  , Ubivar        = require("../../../lib")
  , token         = process.env.UBIVAR_TEST_TOKEN

describe("Reviewers", function(){

  it("Should list reviewers", function(done){
    var ubivar        = new Ubivar(token, "latest")
      , vrand         = ""+Math.random()

    ubivar.reviewers.list(function(err, res){
      if(!err && res.status === 200){
        return done()
      } 

      console.log("\n\nError:", err
      , "\nResponse:"         , res
      , "\nVrand:"            , vrand)
      done(new Error("Should list reviewers."))
    })
  })

  it("Should fail to delete a reviewerId", function(done){
    var ubivar    = new Ubivar(token, "latest")
    ubivar.reviewers.list(function(err, res){
      var oneReviewerId = res.data[0]['id'];
      ubivar.reviewers.del(oneReviewerId, function(err, res){
        if(err){
          done()
        } else {
          done(new Error("Should fail to delete a 'reviewer_id'!"))
        }
      })
    })
  })

  it("Should fail to update a reviewerId", function(done){
    var ubivar    = new Ubivar(token, "latest")
    ubivar.reviewers.list(function(err, res){
      var oneReviewerId = res.data[0]['id'];
      ubivar.reviewers.update(oneReviewerId, {"meta":Math.random()}, function(err, res){
        if(err){
          done()
        } else {
          done(new Error("Should fail to update a 'reviewer_id'!"))
        }
      })
    })
  })
})
