var _                 = require("lodash")
  , expect            = require("chai").expect
  , oriskami            = require("../../oriskami")
  , examples          = require("../../data/Event")
  , jsons             = _.map(examples, function(x){return {"id": x.id, "parameters": x}})
  , ids               = _.map(examples, function(x){return x.id})
  , rootProps         = ["log","_api"]
  , subProps          = ["auth","protocol","timeout","resources","revokedCerts","headers","request"]
  , methods           = ["retrieve", "update", "del", "list"]

describe("EventReview", function(){
  describe("Properties", function(){
    it("Should have a name and path attribute", function() {
      expect(oriskami["EventReview"]["path"]).to.exist
    })

    it("Should link to parent (oriskami)", function() {
      expect(oriskami["EventReview"]["oriskami"]).to.exist
    })

    _.each(methods, function(method){
      var METHOD      = method.toUpperCase()
      it("Should have "+METHOD+" methods", function(done) {
        if(!_.isFunction(oriskami["EventReview"][method])){
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
      oriskami["EventReview"].retrieve(idResource, function(err, res){
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
      var now       = (new Date()).toISOString().slice(0,16)
      oriskami["EventReview"].update(idResource
      , {"message": now, "reviewer_id": "123"}
      , function(err, res){
        if(err){ 
          console.log(err, res)
          done(new Error("Did not create (err)")) 
        } else if(res.data.length <= 0){
          console.log(res)
          done(new Error("Did not create (empty result)")) 
        } else  {
          var reviews = res.data.reverse()
          if(reviews[0].message !== now){
            console.log(res.data)
            console.log(reviews[0].message)
            console.log(now)
            done(new Error("Did not create (now !=)"))
          } else {
            done()
          }
        }
      })
    })

    it("Should update", function(done){
      var reviewId  = 0
        , reviewerId= "124"
      oriskami["EventReview"].update(idResource
      , {"review_id": reviewId, "reviewer_id": reviewerId}
      , function(err, res){
        var reviews = res.data
        if(err){
          console.log(err)
          done(new Error("Error updating"))
        } else if(reviews[reviewId].reviewer.id === reviewerId){
          done()
        } else { 
          console.log(reviews)
          console.log(reviews[reviewId])
          console.log("reviewer_id", reviewerId)
          done(new Error("Did not update")) 
        }
      })
    })

    it("Should update", function(done){
      var reviewId  = 0
        , reviewerId= "123"
      oriskami["EventReview"].update(idResource
      , {"review_id": reviewId, "reviewer_id": reviewerId}
      , function(err, res){
        if(err){ 
          console.log(err, res)
          done(new Error("Did not create")) 
        }
        var review = res.data[reviewId]
        if(review.reviewer.id === reviewerId){
          done()
        } else {
          console.log(err, res)
          done(new Error("Did not update"))
        }
      })
    })

    it("Should delete", function(done){
      oriskami["EventReview"].retrieve(idResource, function(err, res){
        var nReviews = res.data.length
        oriskami["EventReview"].del(idResource
        , {"review_id": 0}
        , function(err, res){
          if(err){ 
            console.log(err, res)
            return done(new Error("Did not delete")) 
          } else if(res.data.length === nReviews - 1){
            return done()
          } else {
            console.log(res.data.length, nReviews)
            done(new Error("Did not delete"))
          }
        })
      })
    })

    xit("Should list", function(done){
      var reviewId  = 0
        , reviewerId= "124"
      oriskami.set("timeout", 20000)
      oriskami["EventReview"].update(idResource
      , {"review_id": reviewId, "reviewer_id": reviewerId}
      , function(err, res){
        if(err){
          console.log(res)
          return done(new Error("Should have only one returned element")) 
        }
        oriskami["EventReview"].list(function(err, res){
          if(!err && res.data.length > 0 && _.contains(_.keys(res.data[0]), "message")) {
            // cleanup
            _.each(res.data, function(eventReview){
              if(eventReview.id === idResource){
                var nReviews = res.data.length 
                oriskami["EventReview"].del(idResource, {"review_id": nReviews - 1}, done)
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
})
