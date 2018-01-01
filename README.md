# Oriskami node.js bindings 
[![npm version](https://badge.fury.io/js/oriskami.svg)](https://badge.fury.io/js/oriskami)
[![Build Status](https://travis-ci.org/oriskami/oriskami-node.png?branch=master)](https://travis-ci.org/oriskami/oriskami-node)
[![Inline docs](http://inch-ci.org/github/oriskami/oriskami-node.svg?branch=master)](http://inch-ci.org/github/oriskami/oriskami-node)
 

The Oriskami Node.js library provides access to the Oriskami API from applications
written in the Node.js language. It includes a pre-defined set of classes for
API resources.

## Quick Start

Install the nodejs binding of `oriskami` from npm.

`npm install oriskami`

Initialize the binding with your API access token:

```js
var Oriskami    = require("oriskami")
  , oriskami    = new Oriskami("YOUR_API_ACCESS_TOKEN", "API_VERSION")
```

### Send event 
```js
oriskami.events.create({
  "parameters"  :{
    "id": 16646,
    "email": "abc@gmail.com",
    "names": "M Abc",
    "account_creation_time": "2017-05-17 21:50:00",
    "account_id": "10000",
    "account_n_fulfilled": "1",
    "account_total_since_created": "49.40",
    "account_total_cur": "EUR",
    "invoice_time": "2017-05-17 21:55:00",
    "invoice_address_country": "France",
    "invoice_address_place": "75008 Paris",
    "invoice_address_street1": "1 Av. des Champs-Élysées",
    "invoice_name": "M ABC",
    "invoice_phone1": "0123456789",
    "invoice_phone2": null,
    "transport_date": "2017-05-18 08:00:00",
    "transport_type": "Delivery",
    "transport_mode": "TNT",
    "transport_weight": "9.000",
    "transport_unit": "kg",
    "transport_cur": "EUR",
    "delivery_address_country": "France",
    "delivery_address_place": "75008 Paris",
    "delivery_address_street1": "1 Av. des Champs-Élysées",
    "delivery_name": "M ABC",
    "delivery_phone1": "0123450689",
    "customer_ip_address": "1.2.3.4",
    "pmeth_origin": "FRA",
    "pmeth_validity": "0121",
    "pmeth_brand": "MC",
    "pmeth_bin": "510000",
    "pmeth_3ds": "-1",
    "cart_products": [ " Product ref #12345 " ],
    "cart_details": [
      {
      "name": "Product ref #12345",
      "pu": "10.00",
      "n": "1",
      "reimbursed": " 0",
      "available": "1",
      "amount": "10.00",
      "cur": "EUR"
    }
    ],
    "cart_n": "15000",
    "order_payment_accepted": "2017-05-17 22:00:00",
    "amount_pmeth": "ABC Payment Service Provider",
    "amount_discounts": 0.00,
    "amount_products": 20.00,
    "amount_transport": 10.00,
    "amount_total": 30.00,
    "amount_cur": "EUR"
  }
, function(err, res){
  if(err){ 
    console.log(err)
    return err 
  }
})
```

```js
oriskami.events.retrieve("16646", function(err, res){
  if(err){ 
    console.log(err)
    return err
  }
})
```

## Resources, actions, and arguments 
Every resource is accessed via your `oriskami` instance and accepts an optional
callback as the last argument. In the matrix below we list the resources
(rows), the actions (columns) and the arguments (cells). The full documentation
is available at [https://oriskami.com/docs/nodejs](https://oriskami.com/docs/nodejs). 


|               | Resource                | C | R | U | D | L     | Test Specs |
|--------------:| ----------------------- |:-:|:-:|:-:|:-:|:-----:|:-------:|
| **Settings**  | Auth, Credentials       |   |   |   |   |       | | 
| **Router**    | Router                  |   | [`123`](https://oriskami.com/docs/nodejs#retrieve_router) |  |  |  | [See on github](https://github.com/oriskami/oriskami-node/blob/master/test/Resources/Router/spec.js) | 
|               | RouterParameter         |   |   | [`123, {}`](https://oriskami.com/docs/nodejs#update_routerparameter) |  | [`{}`](https://oriskami.com/docs/nodejs#list_routerparameter) | [See on github](https://github.com/oriskami/oriskami-node/blob/master/test/Resources/RouterParameter/spec.js) | 
|               | RouterData              |   |   | [`123, {}`](https://oriskami.com/docs/nodejs#update_routerdata) |  | [`{}`](https://oriskami.com/docs/nodejs#list_routerdata) | [See on github](https://github.com/oriskami/oriskami-node/blob/master/test/Resources/RouterData/spec.js) | 
|               | RouterDataGeocoding     |   |  | |  | [`{}`](https://oriskami.com/docs/nodejs#list_routerdatageocoding) | [See on github](https://github.com/oriskami/oriskami-node/blob/master/test/Resources/RouterDataGeocoding/spec.js) | 
|               | RouterDataGeoip         |   |   | [`123, {}`](https://oriskami.com/docs/nodejs#update_routerdatageoip) |  | [`{}`](https://oriskami.com/docs/nodejs#list_routerdata) | [See on github](https://github.com/oriskami/oriskami-node/blob/master/test/Resources/RouterDataGeoip/spec.js) | 
|               | RouterDataPhone         |   |   | [`123, {}`](https://oriskami.com/docs/nodejs#update_routerdataphone) |  | [`{}`](https://oriskami.com/docs/nodejs#list_routerdata) | [See on github](https://github.com/oriskami/oriskami-node/blob/master/test/Resources/RouterDataPhone/spec.js) | 
|               | RouterDataBlacklist     |   |   | [`123, {}`](https://oriskami.com/docs/nodejs#update_routerdatablacklist) |  | [`{}`](https://oriskami.com/docs/nodejs#list_routerdata) | [See on github](https://github.com/oriskami/oriskami-node/blob/master/test/Resources/RouterDataBlacklist/spec.js) | 
|               | RouterDataBin           |   |   | [`123, {}`](https://oriskami.com/docs/nodejs#update_routerdatabin) |  | [`{}`](https://oriskami.com/docs/nodejs#list_routerdata) | [See on github](https://github.com/oriskami/oriskami-node/blob/master/test/Resources/RouterDataBin/spec.js) | 
|               | RouterDataFeature       |   |   |   |   | [`{}`](https://oriskami.com/docs/nodejs#list_routerdatafeature) | [See on github](https://github.com/oriskami/oriskami-node/blob/master/test/Resources/RouterDataFeature/spec.js) | 
|               | RouterFlow              | [`{}`](https://oriskami.com/docs/nodejs#create_routerflow) |  | [`123, {}`](https://oriskami.com/docs/nodejs#update_routerflow) | [`{}`](https://oriskami.com/docs/nodejs#delete_routerflow) | [`{}`](https://oriskami.com/docs/nodejs#list_routerflow) | [See on github](https://github.com/oriskami/oriskami-node/blob/master/test/Resources/RouterFlow/spec.js)| 
|               | RouterBackup        | [`{}`](https://oriskami.com/docs/nodejs#create_routerbackup) | [`{}`](https://oriskami.com/docs/nodejs#retrieve_routerbackup) |  | [`{}`](https://oriskami.com/docs/nodejs#delete_routerbackup) | [`{}`](https://oriskami.com/docs/nodejs#list_routerbackup) | [See on github](https://github.com/oriskami/oriskami-node/blob/master/test/Resources/RouterBackup/spec.js)| 
|               | RouterTest              |   | - |  |  | - | - | 
| **Event data**| Event                   | [`{}`](https://oriskami.com/docs/nodejs#create_event)| [`123`](https://oriskami.com/docs/nodejs#retrieve_event) | [`123, {}`](https://oriskami.com/docs/nodejs#update_event) | [`123`](https://oriskami.com/docs/nodejs#delete_event) | [`{}`](https://oriskami.com/docs/nodejs#list_event) | [See on github](https://github.com/oriskami/oriskami-node/blob/master/test/Resources/Event/spec.js) | 
|               | EventPast               | [`{}`](https://oriskami.com/docs/nodejs#create_eventpast)|  |  |  | [`{}`](https://oriskami.com/docs/nodejs#list_eventpast) | [See on github](https://github.com/oriskami/oriskami-node/blob/master/test/Resources/EventPast/spec.js) | 
|               | EventNotification       |  | [`123`](https://oriskami.com/docs/nodejs#retrieve_eventnotification) |  |  | [`{}`](https://oriskami.com/docs/nodejs#list_eventnotification) | [See on github](https://github.com/oriskami/oriskami-node/blob/master/test/Resources/EventNotification/spec.js)| 
|               | EventLastId             |  |  |  |  | [`{}`](https://oriskami.com/docs/nodejs#list_eventlastid) | [See on github](https://github.com/oriskami/oriskami-node/blob/master/test/Resources/EventLastId/spec.js)| 
|               | EventLabel              | | [`123`](https://oriskami.com/docs/nodejs#retrieve_eventlabel) | [`123, {}`](https://oriskami.com/docs/nodejs#update_eventlabel) | [`123`](https://oriskami.com/docs/nodejs#delete_eventlabel) | [`{}`](https://oriskami.com/docs/nodejs#list_eventlabel) | [See on github](https://github.com/oriskami/oriskami-node/blob/master/test/Resources/EventLabel/spec.js)| 
|               | EventQueue              | | [`123`](https://oriskami.com/docs/nodejs#retrieve_eventqueue) | [`123, {}`](https://oriskami.com/docs/nodejs#update_eventqueue) | [`123`](https://oriskami.com/docs/nodejs#delete_eventqueue) | [`{}`](https://oriskami.com/docs/nodejs#list_eventqueue) | [See on github](https://github.com/oriskami/oriskami-node/blob/master/test/Resources/EventQueue/spec.js)| 
|               | EventReview             | | [`123`](https://oriskami.com/docs/nodejs#retrieve_eventreview) | [`123, {}`](https://oriskami.com/docs/nodejs#update_eventreview) | [`123`](https://oriskami.com/docs/nodejs#delete_eventreview) | [`{}`](https://oriskami.com/docs/nodejs#list_eventreview) | [See on github](https://github.com/oriskami/oriskami-node/blob/master/test/Resources/EventReview/spec.js)| 
|  **Flow filters** | Filter         | | | [`123, {}`](https://oriskami.com/docs/nodejs#update_filter) |  | [`{}`](https://oriskami.com/docs/nodejs#list_filter) | [See on github](https://github.com/oriskami/oriskami-node/blob/master/test/Resources/Filter/spec.js)| 
|               | FilterWhitelist        | [`{}`](https://oriskami.com/docs/nodejs#create_filterwhitelist)| | [`123, {}`](https://oriskami.com/docs/nodejs#update_filterwhitelist) | [`123`](https://oriskami.com/docs/nodejs#delete_filterwhitelist) | [`{}`](https://oriskami.com/docs/nodejs#list_filterwhitelist) | [See on github](https://github.com/oriskami/oriskami-node/blob/master/test/Resources/FilterWhitelist/spec.js)| 
|               | FilterBlacklist        |   |  | [`123, {}`](https://oriskami.com/docs/nodejs#update_filterblacklist) |  | [`{}`](https://oriskami.com/docs/nodejs#list_filterblacklist) | [See on github](https://github.com/oriskami/oriskami-node/blob/master/test/Resources/FilterBlacklist/spec.js)| 
|               | FilterRulesCustom      | [`{}`](https://oriskami.com/docs/nodejs#create_filterrulescustom)|  |  [`123, {}`](https://oriskami.com/docs/nodejs#update_filterrulescustom)| [`123`](https://oriskami.com/docs/nodejs#delete_filterrulescustom) | [`{}`](https://oriskami.com/docs/nodejs#list_filterrulescustom) | [See on github](https://github.com/oriskami/oriskami-node/blob/master/test/Resources/FilterRulesCustom/spec.js)| 
|               | FilterRulesBase         |   |  | [`123, {}`](https://oriskami.com/docs/nodejs#update_filterrulesbase) |  | [`{}`](https://oriskami.com/docs/nodejs#list_filterrulesbase) | [See on github](https://github.com/oriskami/oriskami-node/blob/master/test/Resources/FilterRulesBase/spec.js)| 
|               | FilterRulesAI           |   |  | [`123, {}`](https://oriskami.com/docs/nodejs#update_filterrulesai) | [`123`](https://oriskami.com/docs/nodejs#delete_filterrulesai) | [`{}`](https://oriskami.com/docs/nodejs#list_filterrulesai) | [See on github](https://github.com/oriskami/oriskami-node/blob/master/test/Resources/FilterRulesAI/spec.js)| 
|               | FilterScoringsDedicated |   |  | [`123, {}`](https://oriskami.com/docs/nodejs#update_filterscoringsdedicated) |  | [`{}`](https://oriskami.com/docs/nodejs#list_filterscoringsdedicated) | [See on github](https://github.com/oriskami/oriskami-node/blob/master/test/Resources/FilterScoringsDedicated/spec.js)| 
| **Flow notifiers**   | Notifier | | | [`123, {}`](https://oriskami.com/docs/nodejs#update_notifier) |  | [`{}`](https://oriskami.com/docs/nodejs#list_notifier) | [See on github](https://github.com/oriskami/oriskami-node/blob/master/test/Resources/Notifier/spec.js)| 
|                 | NotifierEmail      | [`{}`](https://oriskami.com/docs/nodejs#create_notifieremail)|  | [`123, {}`](https://oriskami.com/docs/nodejs#update_notifieremail) | [`123`](https://oriskami.com/docs/nodejs#delete_notifieremail) | [`{}`](https://oriskami.com/docs/nodejs#list_notifieremail) | [See on github](https://github.com/oriskami/oriskami-node/blob/master/test/Resources/NotifierEmail/spec.js)| 
|               | NotifierSms             | [`{}`](https://oriskami.com/docs/nodejs#create_notifiersms)|  | [`123, {}`](https://oriskami.com/docs/nodejs#update_notifiersms) | [`123`](https://oriskami.com/docs/nodejs#delete_notifiersms) | [`{}`](https://oriskami.com/docs/nodejs#list_notifiersms) | [See on github](https://github.com/oriskami/oriskami-node/blob/master/test/Resources/NotifierSms/spec.js)| 
|               | NotifierSlack             | [`{}`](https://oriskami.com/docs/nodejs#create_notifierslack)|  | [`123, {}`](https://oriskami.com/docs/nodejs#update_notifierslack) | [`123`](https://oriskami.com/docs/nodejs#delete_notifierslack) | [`{}`](https://oriskami.com/docs/nodejs#list_notifierslack) | [See on github](https://github.com/oriskami/oriskami-node/blob/master/test/Resources/NotifierSlack/spec.js)| 
|               | NotifierWebhook         | [`{}`](https://oriskami.com/docs/nodejs#create_notifierwebhook)|  | [`123, {}`](https://oriskami.com/docs/nodejs#update_notifierwebhook) | [`123`](https://oriskami.com/docs/nodejs#delete_notifierwebhook) | [`{}`](https://oriskami.com/docs/nodejs#list_notifierwebhook) | [See on github](https://github.com/oriskami/oriskami-node/blob/master/test/Resources/NotifierWebhook/spec.js)| 
|               | NotifierECommerce       |   |  | [`123, {}`](https://oriskami.com/docs/nodejs#update_notifierecommerce) |  | [`{}`](https://oriskami.com/docs/nodejs#list_notifierecommerce) | [See on github](https://github.com/oriskami/oriskami-node/blob/master/test/Resources/NotifierECommerce/spec.js)| 


+ *C*: Create
+ *R*: Retrieve
+ *U*: Update
+ *D*: Delete
+ *L*: List
+ `123`: resource id 
+ `{}`: JSON with query parameters

## Filter parameters

| Filter        | Default | Example             | Description                   |
| ------------- |:-------:|:--------------------|:------------------------------|
| `limit`       | `10`    | `{"limit":10}`      | At most `10` returned results |
| `gt`          |         | `{"id":{"gt":10}}`  | `id` greater than 10          |
| `gte`         |         | `{"id":{"gte":10}}` | `id` greater than or equal    |
| `lt`          |         | `{"id":{"lt":10}}`  | `id` less than                |
| `lte`         |         | `{"id":{"lte":10}}` | `id` less than or equal       |

## Configuration


Extend `this` `oriskami` instance with a new resource whose accessibility is
controlled by access rights.
```js
oriskami.extend("resourceName", "resourcePath") // extend with 
```

Change API access token dynamically: 
```js
oriskami.set("auth", "your-api-token")
```

Define timeout of the binding:
```js
oriskami.set("timeout", 20000) // in ms`, node's default is `120000ms`
```

## Development

To run the tests, you will need a Oriskami test API key (from your [Oriskami dashboard](https://my.oriskami.com))

```
export UBIVAR_TEST_TOKEN="your-test-api-key"
npm install -g mocha
npm test
```
*Note: on Windows, use `SET` instead of `export` for setting the `UBIVAR_TEST_TOKEN` environment variable.*

### [Issues and feature requests](https://github.com/oriskami/oriskami-node/issues)

## Author


- Inspired from [stripe-node](https://github.com/stripe/stripe-node). 
- Developed and maintained by Fabrice Colas for [Oriskami](https://www.oriskami.com). 
