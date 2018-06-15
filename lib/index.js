/* Oriskami API client factory
 * @token [String] required bearer-token from admin interface
 * @version [String] optional, default to 'latest'
 */
module.exports    = function(token, version, resources){
  var tls         = require("tls")
    , Oriskami    = require("./Oriskami")
    , vNode       = process.version.split(".")
    , vNodeMajor0 = vNode.length && vNode[0] ? vNode[0].replace(/[^0-9]/,"") : null
    , vNodeMajor  = !isNaN(parseInt(vNodeMajor0)) ? parseInt(vNodeMajor0) : null
    , isVNodeGT8  = vNodeMajor >= 8

  // MITIGATE SSL HANDSHAKE FAILURE __________________
  // https://github.com/nodejs/node/issues/16196
  tls.DEFAULT_ECDH_CURVE = isVNodeGT8 ? "auto" : "prime256v1"

  resources     = resources || [
      {"name": "Router"                 , "path": "router"}
    , {"name": "RouterParameter"        , "path": "router_parameters"}
    , {"name": "RouterData"             , "path": "router_data"}
    , {"name": "RouterDataGeocoding"    , "path": "router_data_geocoding"}
    , {"name": "RouterDataBin"          , "path": "router_data_bin"}
    , {"name": "RouterDataGeoip"        , "path": "router_data_geoip"}
    , {"name": "RouterDataBlacklist"    , "path": "router_data_blacklists"}
    , {"name": "RouterDataPhone"        , "path": "router_data_phone"}
    , {"name": "RouterDataFeature"      , "path": "router_data_features"}
    , {"name": "RouterFlow"             , "path": "router_flows"}
    , {"name": "RouterBackup"           , "path": "router_backups"}
    , {"name": "RouterTest"             , "path": "router_tests"}

    , {"name": "Event"                  , "path": "events"}
    , {"name": "EventPast"              , "path": "event_past"}
    , {"name": "EventNotification"      , "path": "event_notifications"}
    , {"name": "EventLastId"            , "path": "event_last_id"}
    , {"name": "EventLabel"             , "path": "event_labels"}
    , {"name": "EventQueue"             , "path": "event_queues"}
    , {"name": "EventReview"            , "path": "event_reviews"}

    , {"name": "Filter"                 , "path": "filters"}
    , {"name": "FilterWhitelist"        , "path": "filter_whitelists"}
    , {"name": "FilterBlacklist"        , "path": "filter_blacklists"}
    , {"name": "FilterRulesCustom"      , "path": "filter_rules_custom"}
    , {"name": "FilterRulesBase"        , "path": "filter_rules_base"}
    , {"name": "FilterRulesAI"          , "path": "filter_rules_ai"}
    , {"name": "FilterScoringsDedicated", "path": "filter_scorings_dedicated"}

    , {"name": "Notifier"               , "path": "notifiers"}
    , {"name": "NotifierEmail"          , "path": "notifier_emails"}
    , {"name": "NotifierSms"            , "path": "notifier_sms"}
    , {"name": "NotifierWebhook"        , "path": "notifier_webhooks"}
    , {"name": "NotifierECommerce"      , "path": "notifier_ecommerce"}
    , {"name": "NotifierSlack"          , "path": "notifier_slack"}
  ]

  var oriskami    = new Oriskami(token, version, resources)
  for(var i = 0; i<resources.length; i++) {
    oriskami.extend(resources[i].name, resources[i].path)    
  }

  return oriskami
}
