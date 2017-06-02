var _                 = require("lodash")
  , expect            = require("chai").expect
  , ubivar            = require("../../ubivar")
  , examples          = require("../../data/Event")
  , jsons             = _.map(examples, function(x){return {"id": x.id, "parameters": x}})
  , ids               = _.map(examples, function(x){return x.id})
  , rootProps         = ["log","_api"]
  , subProps          = ["auth","protocol","timeout","resources","revokedCerts","headers","request"]
  , methods           = ["retrieve", "update", "del", "list"]

describe("EventReview", function(){
  describe("Properties", function(){
    it("Should have a name and path attribute", function() {
      expect(ubivar["EventReview"]["path"]).to.exist
    })

    it("Should link to parent (ubivar)", function() {
      expect(ubivar["EventReview"]["ubivar"]).to.exist
    })

    _.each(methods, function(method){
      var METHOD      = method.toUpperCase()
      it("Should have "+METHOD+" methods", function(done) {
        if(!_.isFunction(ubivar["EventReview"][method])){
          return done(new Error("Should have "+METHOD+" methods"))
        }
        done()
      })
    })
  })

  describe("Methods", function(){
    var json        = jsons[0] 
      , idResource  = json.id

    it("Should retrieve", function(done){
      ubivar["EventReview"].retrieve(idResource, function(err, res){
        var isStatusOk = res.statusCode >= 200 && res.statusCode <= 204
        if(!err && res.data.length >= 0){
          done()
        } else {
          console.log(err, res)
          done((new Error("Did not retrieve")))
        }
      })
    })

    it("Should create", function(done){
      ubivar["EventReview"].update(idResource
      , {"message": "a review", "reviewer_id": "123"}
      , function(err, res){
        if(err){ done(new Error("Did not create")) }

        var review  = res.data[0].reviews.reverse()[0]
        if(!err && res.data.length === 1 && review.reviewer_id === "123" && review.message === "a review"){
          done()
        } else {
          console.log(err, res)
          done(new Error("Did not create"))
        }
      })
    })

    it("Should update", function(done){
      ubivar["EventReview"].update(idResource
      , {"review_id": 0, "reviewer_id": "124"}
      , function(err, res){
        if(err){ done(new Error("Did not create")) }

        var reviews = res.data[0].reviews
        if(!err && res.data.length === 1 && reviews[0].reviewer_id === "124"){
          done()
        } else {
          console.log(err, res)
          done(new Error("Did not update"))
        }
      })
    })

    it("Should update", function(done){
      ubivar["EventReview"].update(idResource
      , {"review_id": 0, "reviewer_id": "123"}
      , function(err, res){
        if(err){ done(new Error("Did not create")) }

        var reviews = res.data[0].reviews
        if(!err && res.data.length === 1 && reviews[0].reviewer_id === "123"){
          done()
        } else {
          console.log(err, res)
          done(new Error("Did not update"))
        }
      })
    })

    it("Should delete", function(done){
      ubivar["EventReview"].del(idResource
      , {"review_id": 0}
      , function(err, res){
        if(err){ done(new Error("Did not create")) }

        var reviews = res.data[0].reviews
        if(!err && res.data.length === 1){
          ubivar["EventReview"].update(idResource
          , {"reviewer_id": "123", "message": "a review"}
          , function(err, res){
            if(err){return done(new Error("Failed to re-create after delete"))}
            done()
          })
        } else {
          console.log(err, res)
          done(new Error("Did not update"))
        }
      })
    })

    it("Should list", function(done){
      ubivar.set("timeout", 20000)
      ubivar["EventReview"].list(function(err, res){
        if(!err && res.data.length === 3 && _.contains(_.keys(res.data[0]), "reviews")) {
          // cleanup
          _.each(res.data, function(event){
            if(event.id === idResource){
              var nReviews = event.reviews.length 
              ubivar["EventReview"].del(idResource, {"review_id": nReviews - 1}, done)
            }
          })
        } else {
          console.log(res)
          done(new Error("Should have only one returned element")) 
        }
      })
    })
  })
})
