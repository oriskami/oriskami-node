var _                 = require("lodash")
  , async             = require("async")
  , expect            = require("chai").expect
  , L                 = require("../../L")
  , oriskami          = require("../../oriskami")
  , examples          = require("../../data/Event")
  , jsons             = _.map(examples, function(x){return {"id": x.id, "parameters": x}})
  , methods           = ["retrieve", "update", "del", "list"]
  , resourceName      = "EventReview"

describe(resourceName, function(){
  describe("Properties", function(){
    it("Should have a name and path attribute", function() { expect(oriskami[resourceName]["path"]).to.exist })
    it("Should link to parent (oriskami)"     , function() { expect(oriskami[resourceName]["oriskami"]).to.exist })
    _.each(methods, function(method){
      it("Should have " + method + " methods", function(done) {
        _.isFunction(oriskami[resourceName][method]) ? done() : done(new Error("err_missing_method_" + method))
      })
    })
  })

  describe("Methods", function(){
    var json        = jsons[0] 
      , idResource  = json.id

    it("Should retrieve", function(done){
      async.waterfall([
        function(     next){ oriskami[resourceName].retrieve(idResource, next) }
      , function(res, next){ 
        var isOk    = res.status_code >= 200 && res.status_code <= 204 && res.data.length >= 0
        isOk ? next(null, true) : next(new Error("err_retrieving"))
      }], L.logError(done))
    })

    it("Should create", function(done){
      var now       = (new Date()).toISOString().slice(0,16)
      async.waterfall([
        function(     next){ oriskami[resourceName].update(idResource, {"message": now, "reviewer_id": "123"}, next) }
      , function(res, next){ 
        var isOk    = res.status_code >= 200 && res.status_code <= 204 && res.data.length >= 0
        isOk  ? next(null, res) : next(new Error("err_creating"))
      },function(res, next){ 
        var reviews = res.data.reverse()
          , isOk    = reviews[0].message == now
        isOk  ? next(null, true) : next(new Error("err_creating_invalid_values")) 
      }], L.logError(done)) 
    })

    it("Should update", function(done){
      var reviewId  = 0
      async.waterfall([
        function(     next){ oriskami[resourceName].update(idResource, {"review_id": reviewId, "reviewer_id": "124"}, next) }
      , function(res, next){ 
        var isOk    = res.data[reviewId].reviewer.id === "124" 
        isOk ? next(null, true) : next(new Error("err_updating_1"))
      }, function(res, next){ oriskami[resourceName].update(idResource, {"review_id": reviewId, "reviewer_id": "123"}, next)} 
      , function(res, next){ 
        var isOk    = res.data[reviewId].reviewer.id === "123" 
        isOk ? next(null, true) : next(new Error("err_updating_2"))
      }], L.logError(done))
    })

    it("Should delete", function(done){
      var nReviews    
      async.waterfall([
        function(     next){ oriskami[resourceName].retrieve(idResource, next) }
      , function(res, next){ 
        nReviews  = res.data.length
        oriskami[resourceName].del(idResource, {"review_id": 0}, next)
      }, function(res, next){ 
        var isOk  = res.data.length === nReviews - 1
        isOk ? next(null, true) : next(new Error("err_deleting"))
      }], L.logError(done))
    })

    xit("Should list", function(done){
      var reviewId  = 0
        , reviewerId= "124"
      async.waterfall([
        function(     next){ oriskami[resourceName].update(idResource, {"review_id": reviewId, "reviewer_id": reviewerId}, next) }
      , function(res, next){ oriskami[resourceName].list(next) }
      , function(res, next){ 
        var isOk =  res.data.length > 0 && _.contains(_.keys(res.data[0]), "message")
        isOk ? next(null, res) : next(new Error("err_listing"))
      }, function(res, next){ 
        async.map(res.data, function(eventReview){
          if(eventReview.id === idResource){
            var nReviews = res.data.length 
            oriskami[resourceName].del(idResource, {"review_id": nReviews - 1}, next)
          }
        }, next)
      }], L.logError(done))
    })
  })
})
