var _                 = require("lodash")
  , expect            = require("chai").expect
  , ubivar            = require("../../ubivar")
  , methods           = ["create","retrieve","del","list"]

describe("RouterFlowBackup", function(){
  describe("Properties", function(){
    it("Should have a name and path attribute", function() {
      expect(ubivar["RouterFlowBackup"]["path"]).to.exist
    })

    it("Should link to parent (ubivar)", function() {
      expect(ubivar["RouterFlowBackup"]["ubivar"]).to.exist
    })

    _.each(methods, function(method){
      var METHOD      = method.toUpperCase()
      it("Should have "+METHOD+" methods", function(done) {
        if(!_.isFunction(ubivar["RouterFlowBackup"][method])){
          return done(new Error("Should have "+METHOD+" methods"))
        }
        done()
      })
    })
  })


  describe("Methods", function(){

    it("Should create, list, and delete a flow backup", function(done){ 
      var now = (new Date()).toISOString()
      ubivar["RouterFlowBackup"].create({"name": now}, function(err, res){
        if(err){ console.log(err, res); done(new Error("Did not create")) }
        ubivar["RouterFlowBackup"].list(function(err, res){
          if(err){ done(new Error("Did not list")) }
          var backups   = res.data
            , flowId
            , isBackedup= _.reduce(_.keys(backups), function(isBackedup, k){
            if(backups[k].name === now){ flowId = k }
            return backups[k].name === now 
          }, false)

          if(!isBackedup){ done(new Error("Did not find the created RouterFlowBackup")) } 
          ubivar["RouterFlowBackup"].del(flowId, function(err, res){
            if(err){ return done(new Error("Did not delete")) }
            done()
          })
        })
      })
    }).timeout(10000)

    it("Should retrieve (restore) a flow backup", function(done){ 
      var now = (new Date()).toISOString()
      ubivar["FilterWhitelist"].create({"description": now}, function(err, res){
        if(err){ return done(new Error("Did not update the flow")) }
        ubivar["RouterFlowBackup"].create({"name": now}, function(err, res){
          if(err){ return done(new Error("Did not create")) }
          var now2 = (new Date()).toISOString()
          ubivar["FilterWhitelist"].create({"description": now2}, function(err, res){
            if(err){ return done(new Error("Did not update the flow")) }
            ubivar["RouterFlowBackup"].list(function(err, res){
              if(err){ return done(new Error("Did not list the flow")) }
              var backups   = res.data
                , flowId
              _.each(_.keys(backups), function(k){ if(backups[k].name === now){ flowId = k }})
              if(flowId === undefined){ return done(new Error("Did not find the created RouterFlowBackup")) } 
              ubivar["RouterFlowBackup"].retrieve(flowId, function(err, res){
                if(err){ return done(new Error("Did not retrieve RouterFlowBackup")) }
                ubivar["FilterWhitelist"].list(function(err, res){
                  if(err){ return done(new Error("Did not retrieve FilterWhitelist")) }
                  var whitelists  = res.data
                    , returned    = _.reduce(whitelists, function(memo, w){ return memo || w.description === now}, false)
                  if(!returned){ return done(new Error("Did not restore"))}
                  ubivar["RouterFlowBackup"].del(flowId, function(err, res){ done(err) })
                })
              })
            })
          })
        })
      })
    }).timeout(10000)

    it("Should list", function(done){
      ubivar["RouterFlowBackup"].list(function(err, res){
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
