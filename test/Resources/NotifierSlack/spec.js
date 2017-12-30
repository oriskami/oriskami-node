var _                 = require("lodash")
  , expect            = require("chai").expect
  , oriskami            = require("../../oriskami")
  , methods           = ["retrieve", "update", "del", "list"]
  , json              = { 
    "value"           : "https://some-url"
  , "description"     : "New Description"
  , "is_active"       : "true"
  }

describe("NotifierSlack", function(){
  describe("Properties", function(){
    it("Should have a name and path attribute", function() {
      expect(oriskami["NotifierSlack"]["path"]).to.exist
    })

    it("Should link to parent (oriskami)", function() {
      expect(oriskami["NotifierSlack"]["oriskami"]).to.exist
    })

    _.each(methods, function(method){
      var METHOD      = method.toUpperCase()
      it("Should have "+METHOD+" methods", function(done) {
        if(!_.isFunction(oriskami["NotifierSlack"][method])){
          return done(new Error("Should have "+METHOD+" methods"))
        }
        done()
      })
    })
  })

  describe("Methods", function(){
    it("Should create", function(done){
      oriskami["NotifierSlack"].create(json 
      , function(err, res){
        if(err){ done(new Error("Did not create")) }

        var rule = res.data.reverse()[0]
          , deepEqual = _.reduce(_.keys(json), function(memo, k){ return memo && json[k] === rule[k] }, true)
        if(deepEqual){
          done()
        } else {
          console.log(err, res)
          done(new Error("Did not create"))
        }
      })
    })

    it("Should update", function(done){
      var ruleId = "0"
      oriskami.set("timeout", 20000)
      oriskami["NotifierSlack"].update(ruleId
      , {"value": "https://another-url"}
      , function(err, res){
        if(err){ done(new Error("Did not create")) }

        var rule = res.data[ruleId]
        if(rule.value === "https://another-url"){
          // roll back
          oriskami["NotifierSlack"].update(ruleId
          , {"value": "https://some-url"}
          , done)
        } else {
          console.log(err, res)
          done(new Error("Did not update"))
        }
      })
    })

    it("Should delete", function(done){
      oriskami.set("timeout", 20000)
      oriskami["NotifierSlack"].list(function(err, res){
        if(err){ done(new Error("Did not list"))}
        var ruleId = res.data.length - 1
        oriskami["NotifierSlack"].del(ruleId, function(err, res){
          if(!err && res.data.length === 2){ return done() }
          done(err)
        })
      })
    })
  })
})
