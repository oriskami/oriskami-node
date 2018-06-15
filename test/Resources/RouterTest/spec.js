var _                 = require("lodash")
  , async             = require("async")
  , expect            = require("chai").expect
  , L                 = require("../../L")
  , oriskami          = require("../../oriskami")
  , methods           = ["retrieve", "list"]
  , resourceName      = "RouterTest"

describe.skip(resourceName, function(){
  describe("Properties", function(){
    it("Should have a name and path attribute", function(){ expect(oriskami[resourceName]["path"]).to.exist })
    it("Should link to parent (oriskami)"     , function(){ expect(oriskami[resourceName]["oriskami"]).to.exist})
    _.each(methods, function(method){
      it("Should have " + method + " methods", function(done) {
        _.isFunction(oriskami[resourceName][method]) ? done() : done(new Error("err_missing_method_" + method))
      })
    })
  })

  describe("Methods", function(){
    it("Should create", function(done){ oriskami[resourceName].create({}, L.logError(done))  })
    it("Should update", function(done){
      var now1        = (new Date()).toISOString().slice(0,16) + "_abc"
        , now2        = (new Date()).toISOString().slice(0,16) + "_def"
        , ssize       = parseInt(Math.random() * 1000)
      oriskami[resourceName].update(0, {
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
    it("Should list"  , function(done){ oriskami[resourceName].list(L.logError(done))})
  })
})
