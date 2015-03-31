/* Ubivar API client factory
 * @token [String] required bearer-token from admin interface
 * @version [String] optional, default to 'latest'
 */
module.exports  = function(token, version){
  var _         = require("lodash")
    , Ubivar    = require("./Ubivar")
    , Resource  = require("./Resource")
    , ubivar    = new Ubivar(token, version)

  _.each(ubivar.get("resources"), function(resourceName){
    ubivar[resourceName] = new Resource(ubivar, resourceName)
  })

  return ubivar
}
