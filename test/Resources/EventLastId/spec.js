var _                 = require("lodash")
  , async             = require("async")
  , expect            = require("chai").expect
  , L                 = require("../../L")
  , oriskami          = require("../../oriskami")
  , examples          = require("../../data/Event")
  , methods           = ["list"]
  , resourceName      = "EventLastId"

describe(resourceName, function(){
  describe("Properties", function(){
    it("Should have a name and path attribute", function(){ expect(oriskami[resourceName]["path"]    ).to.exist })
    it("Should link to parent (oriskami)"     , function(){ expect(oriskami[resourceName]["oriskami"]).to.exist })
    _.each(methods, function(method){
      it("Should have " + method + " methods", function(done) {
        var hasMethod = _.isFunction(oriskami[resourceName][method])
        if(!hasMethod) done(new Error("err_missing_method_"+ method))
        else done()
      })
    })
  })

  describe("Methods", function(){
    it("Should list the last id", function(done){
      async.waterfall([
        function(     next){ oriskami[resourceName].list(next) }
      , function(res, next){ 
        var isOk    = res.data.length === 1 && res.data[0].id === "3"
        isOk ? next(null, true) : next(new Error("err_invalid_number_of_rows")) 
      }], L.logError(done))
    })
  })
})
