var _                 = require("lodash")
  , expect            = require("chai").expect
  , oriskami            = require("../../oriskami")
  , methods           = ["create","retrieve","del","list"]

describe("RouterBackup", function(){
  describe("Properties", function(){
    it("Should have a name and path attribute", function() {
      expect(oriskami["RouterBackup"]["path"]).to.exist
    })

    it("Should link to parent (oriskami)", function() {
      expect(oriskami["RouterBackup"]["oriskami"]).to.exist
    })

    _.each(methods, function(method){
      var METHOD      = method.toUpperCase()
      it("Should have "+METHOD+" methods", function(done) {
        if(!_.isFunction(oriskami["RouterBackup"][method])){
          return done(new Error("Should have "+METHOD+" methods"))
        }
        done()
      })
    })
  })

  describe("Methods", function(){
    it("Should create, list, and delete a flow backup", function(done){ 
      var now = (new Date()).toISOString()
      oriskami["RouterBackup"].create({"name": now}, function(err, res){
        if(err){ console.log(err, res); done(new Error("Did not create")) }
        oriskami["RouterBackup"].list(function(err, res){
          if(err){ done(new Error("Did not list")) }
          var backups   = res.data
            , backupId
            , isBackedup= _.reduce(_.keys(backups), function(isBackedup, k){
            var backup = backups[k]
            if(backup.name === now){ backupId = backup.id }
            return backup.name === now 
          }, false)

          if(!isBackedup){ done(new Error("Did not find the created RouterBackup")) } 
          oriskami["RouterBackup"].del(backupId, function(err, res){
            if(err){ return done(new Error("Did not delete")) }
            done()
          })
        })
      })
    }).timeout(10000)

    it("Should retrieve (restore) a flow backup", function(done){ 
      var now = (new Date()).toISOString()
      oriskami["FilterWhitelist"].create({"description": now}, function(err, res){
        if(err){ return done(new Error("Did not update the flow")) }
        oriskami["RouterBackup"].create({"name": now}, function(err, res){
          if(err){ return done(new Error("Did not create")) }
          var now2 = (new Date()).toISOString()
          oriskami["FilterWhitelist"].create({"description": now2}, function(err, res){
            if(err){ return done(new Error("Did not update the flow")) }
            oriskami["RouterBackup"].list(function(err, res){
              if(err){ return done(new Error("Did not list the flow")) }
              var backups   = res.data
                , backupId
              _.each(backups, function(backup){ if(backup.name === now){ backupId = backup.id }})
              if(backupId === undefined){ return done(new Error("Did not find the created RouterBackup")) } 
              oriskami["RouterBackup"].retrieve(backupId, function(err, res){
                if(err){ return done(new Error("Did not retrieve RouterBackup")) }
                oriskami["FilterWhitelist"].list(function(err, res){
                  if(err){ return done(new Error("Did not retrieve FilterWhitelist")) }
                  var whitelists  = res.data
                    , returned    = _.reduce(whitelists, function(memo, w){ return memo || w.description === now}, false)
                  if(!returned){ return done(new Error("Did not restore"))}
                  oriskami["RouterBackup"].del(backupId, function(err, res){ done(err) })
                })
              })
            })
          })
        })
      })
    }).timeout(10000)

    it("Should list", function(done){
      oriskami["RouterBackup"].list(function(err, res){
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
