# Ubivar node.js bindings 
[![npm version](https://badge.fury.io/js/ubivar.svg)](http://badge.fury.io/js/ubivar) [![Build Status](https://travis-ci.org/ubivar/ubivar-node.png?branch=master)](https://travis-ci.org/ubivar/ubivar-node)   [![Inline docs](http://inch-ci.org/github/ubivar/ubivar-node.svg?branch=master)](http://inch-ci.org/github/ubivar/ubivar-node)
 
Ubivar is an API that takes over the hassle of screening e-payment for
frauds. 

Ubivar routes e-commerce transactions given their risk. By default the three
`routing` outcomes are rejection, manual verification and acceptance. And the two
elementary resources are the `transactions` and the `labels`.  `Transactions`
are online sales pushed to your payment gateway and `labels` define the *a
posteriori* truth about each `transaction`, i.e. {`fraud`, `non-fraud`}. 

Using Ubivar simply requires an access `token`. Then the bindings provide the
hooks to send and receive resources to the API. For each `transaction` that
Ubivar receives, it calculates a `routing`. Later, as you review manually some of
the `transactions` or as you receive fraud notifications, you `label` 
those `transactions` as `fraud`. 

## Quick Start

Install the nodejs binding of `ubivar` from npm.

`npm install ubivar`

Initialize the binding with your API access token:

```js
var Ubivar    = require("ubivar")
  , ubivar    = new Ubivar("YOUR_API_ACCESS_TOKEN")
```

### A. Send transactions
```js
ubivar.transactions.create({
  "user_id"     : "test_phahr3Eit3_123"           // your client's id
, "user_email"  : "test_phahr3Eit3@gmail-123.com" // your client email
, "gender"      : "M"                             // your client's gender
, "first_name"  : "John"                          // your client's first name
, "last_name"   : "Doe"                           // your client's last name
, "type"        : "sale"                          // the transaction type
, "status"      : "success"                       // the transaction status 
, "order_id"    : "test_iiquoozeiroogi_123"       // the shopping cart id
, "tx_id"       : "client_tx_id_123"              // the transaction id 
, "tx_timestamp": "2015-04-13 13:36:41"           // the timestamp of this transaction
, "amount"      : "43210"                         // the amount in cents
, "payment_method":{
    "bin"       : "123456"                        // the BIN of the card
  , "brand"     : "Mastercard"                    // the brand of the card
  , "funding"   : "credit"                        // the type of card
  , "country"   : "US"                            // the card country code
  , "name"      : "M John Doe"                    // the card holder's name
  , "cvc_check" : "pass"                          // the cvc check result
},"billing_address":{
    "line1"     : "123 Market Street"             // the billing address
  , "line2"     : "4th Floor"                       
  , "city"      : "San Francisco"
  , "state"     : "California"
  , "zip"       : "94102"
  , "country"   : "US"
},"ip_address"  : "1.2.3.4"                       // your client ip address
, "user_agent"  : "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36"                        // your client's user agent
}, function(err, res){

  if(err) return err 
  // something unexpected occurred

  txId          = res.data[0].id 
  // keep track of the transaction id 
})
```

### B. Retrieve routing 

```js
ubivar.routing.retrieve(txId, function(err, res){

  if(err) return err
  // something unexpected occurred

  status        = res.data[0].status
  // the routing, e.g. {pending, green, orange, red}
})
```

### C. Label as fraud

```js
ubivar.labels.retrieve(txId, {"status": "is_fraud"}, function(err, res){

  if(err) return err
  // something unexpected occurred

  status        = res.data[0].status
  // the label of the transaction
})
```

## Resources, actions, and arguments 
Every resource is accessed via your `ubivar` instance and accepts an optional
callback as the last argument. In the matrix below we list the resources
(rows), the actions (columns) and the arguments (cells). The full documentation
is available at [https://ubivar.com/docs/nodejs](https://ubivar.com/docs/nodejs). 

| Resource      | C | R | U | D | L | Summary | Test Specs |
| ------------- |:-:|:-:|:-:|:-:|:----:|:-------:|:----------:|
| Me            |        |<a href="https://ubivar.com/docs/nodejs#retrieve_your_information">_</a>  |<a href="https://ubivar.com/docs/nodejs#retrieve_your_information">`{}`</a>|        |        | | [![](https://status.ubivar.com/ubivar-node/resources/me.svg)](https://github.com/ubivar/ubivar-node/blob/master/test/Resources/Me/spec.js) |
| Accounts      |<a href="https://ubivar.com/docs/nodejs#create_an_account">`{}`</a>|<a href="https://ubivar.com/docs/nodejs#retrieve_an_account">id</a>  |<a href="https://ubivar.com/docs/nodejs#update_an_account">`{}`</a>|<a href="https://ubivar.com/docs/nodejs#delete_an_account">id</a>|<a href="https://ubivar.com/docs/nodejs#list_accounts">`{}`</a>| | [![](https://status.ubivar.com/ubivar-node/resources/accounts.svg)](https://github.com/ubivar/ubivar-node/blob/master/test/Resources/Accounts/spec.js)|
| Login         |<a href="https://ubivar.com/docs/nodejs#create_login_event">`{}`</a>|<a href="https://ubivar.com/docs/nodejs#retrieve_login_event">id</a>  |        |<a href="https://ubivar.com/docs/nodejs#delete_login_event">id</a>|<a href="https://ubivar.com/docs/nodejs#list_login_events">`{}`</a>| | [![](https://status.ubivar.com/ubivar-node/resources/login.svg)](https://github.com/ubivar/ubivar-node/blob/master/test/Resources/Login/spec.js)| 
| Logout        |<a href="https://ubivar.com/docs/nodejs#create_logout_event">`{}`</a>|<a href="https://ubivar.com/docs/nodejs#retrieve_logout_event">id</a>  |        |<a href="https://ubivar.com/docs/nodejs#delete_logout_event">id</a>|<a href="https://ubivar.com/docs/nodejs#list_logout_events">`{}`</a>| |  [![](https://status.ubivar.com/ubivar-node/resources/logout.svg)](https://github.com/ubivar/ubivar-node/blob/master/test/Resources/Logout/spec.js)| 
| Items         |<a href="https://ubivar.com/docs/nodejs#create_item">`{}`</a>|<a href="https://ubivar.com/docs/nodejs#retrieve_item">id</a>  |<a href="https://ubivar.com/docs/nodejs#update_item">`{}`</a>|<a href="https://ubivar.com/docs/nodejs#delete_item">id</a>|<a href="https://ubivar.com/docs/nodejs#list_items">`{}`</a>| | [![](https://status.ubivar.com/ubivar-node/resources/items.svg)](https://github.com/ubivar/ubivar-node/blob/master/test/Resources/Items/spec.js)| 
| Orders  |<a href="https://ubivar.com/docs/nodejs#create_a_transaction">`{}`</a>| <a href="https://ubivar.com/docs/nodejs#retrieve_a_transaction">id</a>  |<a href="https://ubivar.com/docs/nodejs#update_a_transaction">`{}`</a>|<a href="https://ubivar.com/docs/nodejs#delete_a_transaction">id</a>|<a href="https://ubivar.com/docs/nodejs#list_orders">`{}`</a>| | [![](https://status.ubivar.com/ubivar-node/resources/orders.svg)](https://github.com/ubivar/ubivar-node/blob/master/test/Resources/Orders/spec.js)| 
| Transactions  |<a href="https://ubivar.com/docs/nodejs#create_a_transaction">`{}`</a>| <a href="https://ubivar.com/docs/nodejs#retrieve_a_transaction">id</a>  |<a href="https://ubivar.com/docs/nodejs#update_a_transaction">`{}`</a>|<a href="https://ubivar.com/docs/nodejs#delete_a_transaction">id</a>|<a href="https://ubivar.com/docs/nodejs#list_transactions">`{}`</a>| | [![](https://status.ubivar.com/ubivar-node/resources/transactions.svg)](https://github.com/ubivar/ubivar-node/blob/master/test/Resources/Transactions/spec.js)| 
| Routing | | <a href="https://ubivar.com/docs/nodejs#retrieve_a_routing">id</a>  | | |<a href="https://ubivar.com/docs/nodejs#list_routing">`{}`</a>| | [![](https://status.ubivar.com/ubivar-node/resources/routing.svg)](https://github.com/ubivar/ubivar-node/blob/master/test/Resources/Routing/spec.js)| 
| ReviewQueues | <a href="https://ubivar.com/docs/nodejs#create_a_reviewqueue"></a> | <a href="https://ubivar.com/docs/nodejs#retrieve_a_reviewqueue">id</a>  |  <a href="https://ubivar.com/docs/nodejs#update_a_reviewqueue">{}</a> | <a href="https://ubivar.com/docs/nodejs#delete_a_reviewqueue">id</a> | <a href="https://ubivar.com/docs/nodejs#list_reviewqueues">`{}`</a>| | [![](https://status.ubivar.com/ubivar-node/resources/reviewqueues.svg)](https://github.com/ubivar/ubivar-node/blob/master/test/Resources/ReviewQueues/spec.js)| 
| Reviewers |  | <a href="https://ubivar.com/docs/nodejs#retrieve_a_reviewer">id</a>  | | | <a href="https://ubivar.com/docs/nodejs#list_reviewers">`{}`</a>| | [![](https://status.ubivar.com/ubivar-node/resources/reviewers.svg)](https://github.com/ubivar/ubivar-node/blob/master/test/Resources/Reviewers/spec.js)| 
| ReviewerBindings | | <a href="https://ubivar.com/docs/nodejs#retrieve_a_reviewerbinding">id</a> | | |<a href="https://ubivar.com/docs/nodejs#list_reviewerbindings">`{}`</a>| | [![](https://status.ubivar.com/ubivar-node/resources/reviewerbindings.svg)](https://github.com/ubivar/ubivar-node/blob/master/test/Resources/ReviewerBindings/spec.js)| 
| Labels        |<a href="https://ubivar.com/docs/nodejs#create_label">`{}`</a>|<a href="https://ubivar.com/docs/nodejs#retrieve_label">id</a>  |<a href="https://ubivar.com/docs/nodejs#update_label">`{}`</a>|<a href="https://ubivar.com/docs/nodejs#delete_label">id</a>|<a href="https://ubivar.com/docs/nodejs#list_labels">`{}`</a>| | [![](https://status.ubivar.com/ubivar-node/resources/labels.svg)](https://github.com/ubivar/ubivar-node/blob/master/test/Resources/Labels/spec.js) | 

+ *C*: Create
+ *R*: Retrieve
+ *U*: Update
+ *D*: Delete
+ *L*: List
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


Extend `this` `ubivar` instance with a new resource whose accessibility is
controlled by access rights.
```js
var Ubivar    = require("ubivar")
  , ubivar    = new Ubivar("YOUR_API_ACCESS_TOKEN")

ubivar.extend("geoip") // extend with 
```

Change API access token dynamically: 
```js
ubivar.set("auth", "your-api-token")
```

Define timeout of the binding:
```js
ubivar.set("timeout", 20000) // in ms`, node's default is `120000ms`
```

## Development

To run the tests, you will need a Ubivar test API key (from your [Ubivar dashboard](https://my.ubivar.com))

```
export UBIVAR_TEST_TOKEN="your-test-api-key"
npm install -g mocha
npm test
```
*Note: on Windows, use `SET` instead of `export` for setting the `UBIVAR_TEST_TOKEN` environment variable.*

### [Issues and feature requests](https://github.com/ubivar/ubivar-node/issues)

## Author

Originally inspired from [stripe-node](https://github.com/stripe/stripe-node). Developed and maintained by [Fabrice Colas](https://fabricecolas.me) ([fabrice.colas@gmail.com](mailto:fabrice.colas@gmail.com)) for [Ubivar](https://ubivar.com). 
