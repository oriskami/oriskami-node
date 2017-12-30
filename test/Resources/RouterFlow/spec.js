var _                 = require("lodash")
  , expect            = require("chai").expect
  , oriskami            = require("../../oriskami")
  , methods           = ["create","update","del","list"]

describe("RouterFlow", function(){
  describe("Properties", function(){
    it("Should have a name and path attribute", function() {
      expect(oriskami["RouterFlow"]["path"]).to.exist
    })

    it("Should link to parent (oriskami)", function() {
      expect(oriskami["RouterFlow"]["oriskami"]).to.exist
    })

    _.each(methods, function(method){
      var METHOD      = method.toUpperCase()
      it("Should have "+METHOD+" methods", function(done) {
        if(!_.isFunction(oriskami["RouterFlow"][method])){
          return done(new Error("Should have "+METHOD+" methods"))
        }
        done()
      })
    })
  })


  describe("Methods", function(){
    it("Should create and delete RouterFlow", function(done){ 
      oriskami["RouterFlow"].list(function(err, res){
        if(err){ return done(new Error("Did not list")) }
        var nRouterFlows0 = res.data.length
        oriskami["RouterFlow"].create({}, function(err, res){
          if(err){ return done(new Error("Did not create")) }

          var nRouterFlows1 = res.data.length
          if(nRouterFlows1 <= nRouterFlows0){return done(new Error("Did not expand the set of RouterFlows"))} 

          oriskami["RouterFlow"].del(nRouterFlows1 - 1, function(err, res){
            if(err){ return done(new Error("Did not delete")) }

            var nRouterFlows2 = res.data.length 
            if(nRouterFlows2 !== nRouterFlows0){return done(new Error("Did not delete the created flow"))} 

            done()
          })
        })
      })
    }).timeout(10000)

    it("Should update", function(done){
      oriskami.set("timeout", 20000)
      var ruleId = "0"
      oriskami["RouterFlow"].update(ruleId
      , {"is_active": "true"}
      , function(err, res){
        if(err){ 
          return done(new Error("Did not update")) 
        }

        var flow = res.data
        if(flow.is_active === "true"){
          // roll back
          oriskami["RouterFlow"].update(ruleId
          , {"is_active": "false"}
          , done)
        } else {
          console.log(err, res)
          done(new Error("Did not update"))
        }
      })
    })

    it("Should list", function(done){
      oriskami["RouterFlow"].list(function(err, res){
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
