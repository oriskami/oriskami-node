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

| Resource      | C | R | U | D | List | Summary | Test | Status |
| ------------- |:-:|:-:|:-:|:-:|:----:|:-------:|:----:|:------:|
| Me            |        |<a href="https://ubivar.com/docs/nodejs#retrieve_your_information">_</a>  |<a href="https://ubivar.com/docs/nodejs#retrieve_your_information">`{}`</a>|        |        | | [spec](https://github.com/ubivar/ubivar-node/blob/master/test/Resources/Me/spec.js)| ![](https://status.ubivar.com/ubivar-node/resources/me.svg) |
| Accounts      |<a href="https://ubivar.com/docs/nodejs#create_an_account">`{}`</a>|<a href="https://ubivar.com/docs/nodejs#retrieve_an_account">id</a>  |<a href="https://ubivar.com/docs/nodejs#update_an_account">`{}`</a>|<a href="https://ubivar.com/docs/nodejs#delete_an_account">id</a>|<a href="https://ubivar.com/docs/nodejs#list_accounts">`{}`</a>| | [spec](https://github.com/ubivar/ubivar-node/blob/master/test/Resources/Accounts/spec.js)| ![](https://status.ubivar.com/ubivar-node/resources/accounts.svg)|
| Transactions  |<a href="https://ubivar.com/docs/nodejs#create_a_transaction">`{}`</a>| <a href="https://ubivar.com/docs/nodejs#retrieve_a_transaction">id</a>  |<a href="https://ubivar.com/docs/nodejs#update_a_transaction">`{}`</a>|<a href="https://ubivar.com/docs/nodejs#delete_a_transaction">id</a>|<a href="https://ubivar.com/docs/nodejs#list_transactions">`{}`</a>| | [spec](https://github.com/ubivar/ubivar-node/blob/master/test/Resources/Transactions/spec.js)| ![](https://status.ubivar.com/ubivar-node/resources/transactions.svg)| 
| Login         |<a href="https://ubivar.com/docs/nodejs#create_login_event">`{}`</a>|<a href="https://ubivar.com/docs/nodejs#retrieve_login_event">id</a>  |        |<a href="https://ubivar.com/docs/nodejs#delete_login_event">id</a>|<a href="https://ubivar.com/docs/nodejs#list_login_events">`{}`</a>| | [spec](https://github.com/ubivar/ubivar-node/blob/master/test/Resources/Login/spec.js)| ![](https://status.ubivar.com/ubivar-node/resources/login.svg)| 
| Logout        |<a href="https://ubivar.com/docs/nodejs#create_logout_event">`{}`</a>|<a href="https://ubivar.com/docs/nodejs#retrieve_logout_event">id</a>  |        |<a href="https://ubivar.com/docs/nodejs#delete_logout_event">id</a>|<a href="https://ubivar.com/docs/nodejs#list_logout_events">`{}`</a>| | [spec](https://github.com/ubivar/ubivar-node/blob/master/test/Resources/Logout/spec.js)| ![](https://status.ubivar.com/ubivar-node/resources/logout.svg)| 
| Items         |<a href="https://ubivar.com/docs/nodejs#create_item">`{}`</a>|<a href="https://ubivar.com/docs/nodejs#retrieve_item">id</a>  |<a href="https://ubivar.com/docs/nodejs#update_item">`{}`</a>|<a href="https://ubivar.com/docs/nodejs#delete_item">id</a>|<a href="https://ubivar.com/docs/nodejs#list_items">`{}`</a>| | [spec](https://github.com/ubivar/ubivar-node/blob/master/test/Resources/Items/spec.js)| ![](https://status.ubivar.com/ubivar-node/resources/items.svg)| 
| Labels        |<a href="https://ubivar.com/docs/nodejs#create_label">`{}`</a>|<a href="https://ubivar.com/docs/nodejs#retrieve_label">id</a>  |<a href="https://ubivar.com/docs/nodejs#update_label">`{}`</a>|<a href="https://ubivar.com/docs/nodejs#delete_label">id</a>|<a href="https://ubivar.com/docs/nodejs#list_labels">`{}`</a>| | [spec](https://github.com/ubivar/ubivar-node/blob/master/test/Resources/Labels/spec.js)| ![](https://status.ubivar.com/ubivar-node/resources/labels.svg)| 
| Fx            |        |          |        |        |<a href="https://ubivar.com/docs/nodejs#list_fx">`{}`</a>| | [spec](https://github.com/ubivar/ubivar-node/blob/master/test/Resources/Fx/spec.js)| ![](https://status.ubivar.com/ubivar-node/resources/fx.svg)| 
| Bins          |        |          |        |        |<a href="https://ubivar.com/docs/nodejs#list_bin">`{}`</a>| | [spec](https://github.com/ubivar/ubivar-node/blob/master/test/Resources/Bins/spec.js)| ![](https://status.ubivar.com/ubivar-node/resources/bin.svg)| 
| Uptime |        |          |        |        |<a href="https://ubivar.com/docs/nodejs#list_uptime">`{}`</a>| <a href="https://ubivar.com/docs/nodejs#summary_uptime">`{}`</a>|[spec](https://github.com/ubivar/ubivar-node/blob/master/test/Resources/Uptime/spec.js)| ![](https://status.ubivar.com/ubivar-node/resources/uptime.svg)| 
| CI        |        |          |        |        |<a href="https://ubivar.com/docs/nodejs#list_ci">`{}`</a>| <a href="https://ubivar.com/docs/nodejs#summary_ci">`{}`</a>|[spec](https://github.com/ubivar/ubivar-node/blob/master/test/Resources/Ci/spec.js)| ![](https://status.ubivar.com/ubivar-node/resources/ci.svg)| 
| Geoip         |        |          |        |        |<a href="https://ubivar.com/docs/nodejs#list_geoip">`{}`</a>| |[spec](https://github.com/ubivar/ubivar-node/blob/master/test/Resources/Geoip/spec.js)| ![](https://status.ubivar.com/ubivar-node/resources/geoip.svg)| 

+ *C*: Create
+ *R*: Retrieve
+ *U*: Update
+ *D*: Delete
+ `{}`: JSON with query parameters

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
