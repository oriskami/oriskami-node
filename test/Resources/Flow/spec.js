var _                 = require("lodash")
  , expect            = require("chai").expect
  , ubivar            = require("../../ubivar")
  , methods           = ["create","update","del","list"]

describe("Flow", function(){
  describe("Properties", function(){
    it("Should have a name and path attribute", function() {
      expect(ubivar["Flow"]["path"]).to.exist
    })

    it("Should link to parent (ubivar)", function() {
      expect(ubivar["Flow"]["ubivar"]).to.exist
    })

    _.each(methods, function(method){
      var METHOD      = method.toUpperCase()
      it("Should have "+METHOD+" methods", function(done) {
        if(!_.isFunction(ubivar["Flow"][method])){
          return done(new Error("Should have "+METHOD+" methods"))
        }
        done()
      })
    })
  })


  describe("Methods", function(){

    it("Should create and delete Flow", function(done){ 
      ubivar["Flow"].list(function(err, res){
        if(err){ return done(new Error("Did not list")) }
        var nFlows0 = res.data.length
        ubivar["Flow"].create({}, function(err, res){
          if(err){ return done(new Error("Did not create")) }

          var nFlows1 = res.data.length
          if(nFlows1 <= nFlows0){return done(new Error("Did not expand the set of Flows"))} 

          ubivar["Flow"].del(nFlows1 - 1, function(err, res){
            if(err){ return done(new Error("Did not delete")) }

            var nFlows2 = res.data.length 
            if(nFlows2 !== nFlows0){return done(new Error("Did not delete the created flow"))} 

            done()
          })
        })
      })
    })

    it("Should update", function(done){
      ubivar.set("timeout", 20000)
      var ruleId = "0"
      ubivar["Flow"].update(ruleId
      , {"is_active": "true"}
      , function(err, res){
        if(err){ return done(new Error("Did not update")) }

        var rule = res.data[ruleId]
        if(rule.is_active === "true"){
          // roll back
          ubivar["Flow"].update(ruleId
          , {"is_active": "false"}
          , done)
        } else {
          console.log(err, res)
          done(new Error("Did not update"))
        }
      })
    })

    it("Should list", function(done){
      ubivar["Flow"].list(function(err, res){
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
