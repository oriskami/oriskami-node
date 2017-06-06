/* Ubivar API client factory
 * @token [String] required bearer-token from admin interface
 * @version [String] optional, default to 'latest'
 */
module.exports  = function(token, version, resources){
  var _         = require("lodash")
    , Ubivar    = require("./Ubivar")

  resources     = resources || [
      {"name": "Event"                  , "path": "events"}
    , {"name": "EventNotification"      , "path": "event_notifications"}
    , {"name": "EventLastId"            , "path": "event_last_id"}
    , {"name": "EventLabel"             , "path": "event_labels"}
    , {"name": "EventQueue"             , "path": "event_queues"}
    , {"name": "EventReview"            , "path": "event_reviews"}

    , {"name": "Filters"                , "path": "filters"}
    , {"name": "FilterWhitelist"        , "path": "filter_whitelists"}
    , {"name": "FilterBlacklist"        , "path": "filter_blacklists"}
    , {"name": "FilterRulesCustom"      , "path": "filter_rules_custom"}
    , {"name": "FilterRulesBase"        , "path": "filter_rules_base"}
    , {"name": "FilterRulesAI"          , "path": "filter_rules_ai"}
    , {"name": "FilterScoringsDedicated", "path": "filter_scorings_dedicated"}

    , {"name": "Notifiers"              , "path": "notifiers"}
    , {"name": "NotifierEmail"          , "path": "notifier_emails"}
    , {"name": "NotifierSms"            , "path": "notifier_sms"}
    , {"name": "NotifierWebhook"        , "path": "notifier_webhooks"}
    , {"name": "NotifierECommerce"      , "path": "notifier_ecommerce"}
    , {"name": "NotifierSlack"          , "path": "notifier_slack"}
  ]

  var ubivar    = new Ubivar(token, version, resources)

  _.each(resources, function(resource){
    ubivar.extend(resource.name, resource.path)
  })

  return ubivar
}
