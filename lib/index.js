/* Ubivar API client factory
 * @token [String] required bearer-token from admin interface
 * @version [String] optional, default to 'latest'
 */
module.exports  = function(token, version, resources){
  var _         = require("lodash")

  var Ubivar    = require("./Ubivar")

  resources     = resources || [
      "me"
    , "events"
  ]

  var ubivar    = new Ubivar(token, version, resources)

  _.each(resources, function(resource){
    ubivar.extend(resource)
  })

  return ubivar
}
