var _                 = require("lodash")
  , expect            = require("chai").expect
  , async             = require("async")
  , oriskami          = require("../../oriskami")
  , L                 = require("../../L")
  , methods           = ["create","retrieve","del","list"]
  , resourceName      = "RouterBackup"

describe(resourceName, function(){
  describe("Properties", function(){
    it("Should have a name and path attribute", function() { expect(oriskami[resourceName]["path"]).to.exist })
    it("Should link to parent (oriskami)"     , function() { expect(oriskami[resourceName]["oriskami"]).to.exist })
    _.each(methods, function(method){
      it("Should have " + method + " methods", function(done) {
        var hasMethod = _.isFunction(oriskami[resourceName][method])
        hasMethod ? done() : done(new Error("Should have "+METHOD+" methods"))
      })
    })
  })

  describe("Methods", function(){
    it("Should create, list, and delete a flow backup", function(done){ 
      var now = (new Date()).toISOString()
        , backupId
      async.waterfall([
        function(     next){ oriskami[resourceName].create({"name": now}, next)}
      , function(res, next){ oriskami[resourceName].list(next) }
      , function(res, next){ 
        var isBackedUp= _.reduce(_.keys(res.data), function(isBackedup, k){
          var backup = res.data[k]
          if(backup.name === now){ backupId = backup.id }
          return backup.name === now 
        }, false)
        isBackedUp  ? next(null, backupId) : next(new Error("err_router_backup_missing")) 
      }, function(res, next){oriskami[resourceName].del(backupId, next) 
      }], L.logError(done))
    }).timeout(60000)

    it("Should retrieve (restore) a flow backup", function(done){ 
      var now = (new Date()).toISOString()
        , now2= now + "_ABC"
        , backupId
      async.waterfall([
        function(     next){ oriskami["FilterWhitelist"].create({"description": now}, next) }
      , function(res, next){ oriskami[resourceName].create({"name": now}, next) }
      , function(res, next){ oriskami["FilterWhitelist"].create({"description": now2}, next) }
      , function(res, next){ oriskami[resourceName].list(next) } 
      , function(res, next){
         backupId = _.reduce(res.data, function(memo, backup){ return backup.name === now ? backup.id : memo}, -1)
         backupId >= 0 ? next(null, backupId) : next(new Error("err_retrieving_backup_id_in_backups")) 
      }, function(backupId, next){ oriskami[resourceName].retrieve(backupId, next)} 
      , function(res, next){ oriskami["FilterWhitelist"].list(next) }
      , function(res, next){  
        var hasWhitelist  = _.reduce(res.data, function(memo, w){ return memo || w.description === now}, false)
        hasWhitelist ? next(null, hasWhitelist) : next(new Error("err_retrieving_modified_rule_in_restored_backup"))
      }, function(res, next){ oriskami[resourceName].del(backupId, next) } 
      ], L.logError(done))
    }).timeout(60000)

    it("Should list", function(done){ oriskami[resourceName].list(L.logError(done))})
  })
})
