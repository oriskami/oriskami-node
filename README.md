# Ubivar node.js bindings 
[![npm version](https://badge.fury.io/js/ubivar.svg)](http://badge.fury.io/js/ubivar) [![Build Status](https://travis-ci.org/ubivar/ubivar-node.png?branch=master)](https://travis-ci.org/ubivar/ubivar-node)   [![Inline docs](http://inch-ci.org/github/ubivar/ubivar-node.svg?branch=master)](http://inch-ci.org/github/ubivar/ubivar-node)
 
Ubivar is an API that takes over the hassle of screening e-payment for
frauds. 

Ubivar routes e-commerce transactions given their risk. By default the three
routing outcomes are rejection, manual verification and acceptance. And the two
elementary resources are the `transactions` and the `labels`.  `Transactions`
are online sales pushed to your payment gateway and `labels` define the *a
posteriori* truth about each `transaction`, i.e. {`fraud`, `non-fraud`}. 

Using Ubivar simply requires an access `token`. Then the bindings provide the
hooks to send and receive resources to the API. For each `transaction` that
Ubivar receives, it calculates a routing. Later, as you review manually some of
the `transactions` or as you receive fraud notifications, you `label` 
those `transactions` as `fraud`. 

## Quick Start

### A. Install and initialize 

`npm install ubivar`

```js
var Ubivar    = require("ubivar")
  , ubivar    = new Ubivar("YOUR_API_ACCESS_TOKEN", "latest")
```

### B. Send transactions
```js
ubivar.transactions.create({
  "user_id"     : "test_phahr3Eit3_123"           // your client's id
, "user_email"  : "test_phahr3Eit3@gmail-123.com" // your client email
, "type"        : "sale"                          // the transaction type
, "status"      : "success"                       // the transaction status 
, "order_id"    : "test_iiquoozeiroogi_123"       // the shopping cart id
, "tx_id"       : "client_tx_id_123"              // the transaction id 
, "amount"      : "43210"                         // the amount in cents
, "payment_method":{
    "bin"       :"123456"                         // the BIN of the card
  , "brand"     :"Mastercard"                     // the brand of the card
  , "funding"   :"credit"                         // the type of card
  , "country"   :"US"                             // the card country code
  , "name"      :"M Man"                          // the card holder's name
  , "cvc_check" :"pass"                           // the cvc check result
},"billing_address":{
    "line1"     :"123 Market Street"              // the billing address
  , "line2"     :"4th Floor"                       
  , "city"      :"San Francisco"
  , "state"     :"California"
  , "zip"       :"94102"
  , "country"   :"US"
  }
}, function(err, res){

  if(err) return err 
  // something unexpected occurred

  txId          = res.data[0].id 
  // keep track of the transaction id 
})
```

### C. Retrieve routing and label 
```js
ubivar.labels.retrieve(txId, function(err, res){

  if(err) return err
  // something unexpected occurred

  status        = res.data[0].status
  // the status of the transaction
})
```

## Resources, actions, and arguments 
Every resource is accessed via your `ubivar` instance and accepts an optional
callback as the last argument. In the matrix below we list the resources
(rows), the actions (columns) and the arguments (cells). The full documentation
is available at
[https://ubivar.com/docs/nodejs](https://ubivar.com/docs/nodejs). 

| Resource      | Create | Retrieve | Update | Delete | List   | Summary |
| ------------- |:------:|:--------:|:------:|:------:|:------:|:-------:|
| Me            |        |<a href="https://ubivar.com/docs/nodejs#retrieve_your_information">_</a>  |<a href="https://ubivar.com/docs/nodejs#retrieve_your_information">param</a>|        |        | | 
| Accounts      |<a href="https://ubivar.com/docs/nodejs#create_an_account">object</a>|<a href="https://ubivar.com/docs/nodejs#retrieve_an_account">id</a>  |<a href="https://ubivar.com/docs/nodejs#update_an_account">id, params</a>|<a href="https://ubivar.com/docs/nodejs#delete_an_account">id</a>|<a href="https://ubivar.com/docs/nodejs#list_accounts">params</a>| | 
| Transactions  |<a href="https://ubivar.com/docs/nodejs#create_a_transaction">object</a>| <a href="https://ubivar.com/docs/nodejs#retrieve_a_transaction">id</a>  |<a href="https://ubivar.com/docs/nodejs#update_a_transaction">id, params</a>|<a href="https://ubivar.com/docs/nodejs#delete_a_transaction">id</a>|<a href="https://ubivar.com/docs/nodejs#list_transactions">params</a>| | 
| Login         |<a href="https://ubivar.com/docs/nodejs#create_login_event">object</a>|<a href="https://ubivar.com/docs/nodejs#retrieve_login_event">id</a>  |        |<a href="https://ubivar.com/docs/nodejs#delete_login_event">id</a>|<a href="https://ubivar.com/docs/nodejs#list_login_events">params</a>| | 
| Logout        |<a href="https://ubivar.com/docs/nodejs#create_logout_event">object</a>|<a href="https://ubivar.com/docs/nodejs#retrieve_logout_event">id</a>  |        |<a href="https://ubivar.com/docs/nodejs#delete_logout_event">id</a>|<a href="https://ubivar.com/docs/nodejs#list_logout_events">params</a>| | 
| Items         |<a href="https://ubivar.com/docs/nodejs#create_item">object</a>|<a href="https://ubivar.com/docs/nodejs#retrieve_item">id</a>  |<a href="https://ubivar.com/docs/nodejs#update_item">id, params</a>|<a href="https://ubivar.com/docs/nodejs#delete_item">id</a>|<a href="https://ubivar.com/docs/nodejs#list_items">params</a>| | 
| Labels        |<a href="https://ubivar.com/docs/nodejs#create_label">object</a>|<a href="https://ubivar.com/docs/nodejs#retrieve_label">id</a>  |<a href="https://ubivar.com/docs/nodejs#update_label">id, params</a>|<a href="https://ubivar.com/docs/nodejs#delete_label">id</a>|<a href="https://ubivar.com/docs/nodejs#list_labels">params</a>| | 
| Fx            |        |          |        |        |<a href="https://ubivar.com/docs/nodejs#list_fx">params</a>| | 
| Bins          |        |          |        |        |<a href="https://ubivar.com/docs/nodejs#list_bin">params</a>| | 
| Uptime |        |          |        |        |<a href="https://ubivar.com/docs/nodejs#list_uptime">params</a>| <a href="https://ubivar.com/docs/nodejs#summary_uptime">params</a>|
| CI        |        |          |        |        |<a href="https://ubivar.com/docs/nodejs#list_ci">params</a>| <a href="https://ubivar.com/docs/nodejs#summary_ci">params</a>|
| Geoip         |        |          |        |        |<a href="https://ubivar.com/docs/nodejs#list_geoip">`{"ip":ip}`</a>| |

## Filter parameters

| Filter        | Default | Example             | Description                   |
| ------------- |:-------:|:--------------------|:------------------------------|
| `start_after` |         | `{"start_after":10}`| `id` after the one specified  |
| `end_before`  |         | `{"end_before":10}` | `id` before the one specified |
| `limit`       | `10`    | `{"limit":10}`      | At most `10` returned results |
| `gt`          |         | `{"id":{"gt":10}}`  | `id` greater than 10          |
| `gte`         |         | `{"id":{"gte":10}}` | `id` greater than or equal    |
| `lt`          |         | `{"id":{"lt":10}}`  | `id` less than                |
| `lte`         |         | `{"id":{"lte":10}}` | `id` less than or equal       |

## Configuration

+ `ubivar.set("auth", "your-api-token")`
+ `ubivar.set("timeout", 20000) // in ms`, node's default is `120000ms`

## Issues and feature requests 

+ [Report issues and feature requests](https://github.com/ubivar/ubivar-node/issues)

## Development

To run the tests, you will need a Ubivar test API key (from your [Ubivar dashboard](https://my.ubivar.com))

```
export UBIVAR_TEST_TOKEN="your-test-api-key"
npm install -g mocha
npm test
```
*Note: on Windows, use `SET` instead of `export` for setting the `UBIVAR_TEST_TOKEN` environment variable.*

## Author

Originally inspired from [stripe-node](https://github.com/stripe/stripe-node). Developed by [Fabrice Colas](https://fabricecolas.me) ([fabrice.colas@gmail.com](mailto:fabrice.colas@gmail.com)). Maintained by Ubivar. 
