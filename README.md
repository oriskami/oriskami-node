# Ubivar node.js bindings 
[![npm version](https://badge.fury.io/js/ubivar.svg)](http://badge.fury.io/js/ubivar) [![Build Status](https://travis-ci.org/ubivar/ubivar-node.png?branch=master)](https://travis-ci.org/ubivar/ubivar-node)  [![Inline docs](http://inch-ci.org/github/ubivar/ubivar-node.svg?branch=master)](http://inch-ci.org/github/ubivar/ubivar-node)
 
Ubivar is an API that takes over the hassle of automatically screening
e-payment for frauds on e-commerce websites. 

Ubivar's purpose is to route e-commerce transactions given their estimated
risk. By default, the three possible routing outcomes are a suggested
rejection, a recommended manual verification, and a proposed acceptance of the
transaction. Ubivar does not need all the business events (aka `resources`),
however the more it has contextual information about the transactions, the
better its accuracy. The two required resources are the `transactions` and the
`labels` that categorize the `transactions` like fraud, not fraud. The API is
simple: you provide Ubivar your request `token` and the bindings provide the
hooks to send and receive resources to the API.

## Quick Start

Every resource is accessed via your `ubivar` instance and accepts an optional
callback as the last argument.  

### 0. Install

`npm install ubivar`

### A. Init 
```js
var Ubivar    = require("ubivar")
  , ubivar    = new Ubivar("YOUR_API_ACCESS_TOKEN", "latest")
```

### B. Send an e-commerce transaction
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

### C. Retrieve its status 
```js
ubivar.labels.retrieve(txId, function(err, res){

  if(err) return err
  // something unexpected occurred

  status        = res.data[0].status
  // the status of the transaction
})
```

## Resources, actions and arguments 

The full documentation is available at
[https://ubivar.com/docs/nodejs](https://ubivar.com/docs/nodejs). In the matrix
below we list the resources (rows), the actions (columns) and the arguments
(cells).

| Resource      | Create | Retrieve | Update | Delete | List   |
| ------------- |:------:|:--------:|:------:|:------:|:------:|
| Me            |        |<a href="https://ubivar.com/docs/nodejs#retrieve_your_information">_</a>  |<a href="https://ubivar.com/docs/nodejs#retrieve_your_information">param</a>|        |        |
| Accounts      |<a href="https://ubivar.com/docs/nodejs#create_an_account">params</a>|<a href="https://ubivar.com/docs/nodejs#retrieve_an_account">id</a>  |<a href="https://ubivar.com/docs/nodejs#update_an_account">id, params</a>|<a href="https://ubivar.com/docs/nodejs#delete_an_account">id</a>|<a href="https://ubivar.com/docs/nodejs#list_accounts">params</a>|
| Transactions  |<a href="https://ubivar.com/docs/nodejs#create_a_transaction">params</a>| <a href="https://ubivar.com/docs/nodejs#retrieve_a_transaction">id</a>  |<a href="https://ubivar.com/docs/nodejs#update_a_transaction">id, params</a>|<a href="https://ubivar.com/docs/nodejs#delete_a_transaction">id</a>|<a href="https://ubivar.com/docs/nodejs#list_transactions">params</a>|
| Login         |<a href="https://ubivar.com/docs/nodejs#create_login_event">params</a>|<a href="https://ubivar.com/docs/nodejs#retrieve_login_event">id</a>  |        |<a href="https://ubivar.com/docs/nodejs#delete_login_event">id</a>|<a href="https://ubivar.com/docs/nodejs#list_login_events">params</a>|
| Logout        |<a href="https://ubivar.com/docs/nodejs#create_logout_event">params</a>|<a href="https://ubivar.com/docs/nodejs#retrieve_logout_event">id</a>  |        |<a href="https://ubivar.com/docs/nodejs#delete_logout_event">id</a>|<a href="https://ubivar.com/docs/nodejs#list_logout_events">params</a>|
| Items         |<a href="https://ubivar.com/docs/nodejs#create_item">params</a>|<a href="https://ubivar.com/docs/nodejs#retrieve_item">id</a>  |<a href="https://ubivar.com/docs/nodejs#update_item">id, params</a>|<a href="https://ubivar.com/docs/nodejs#delete_item">id</a>|<a href="https://ubivar.com/docs/nodejs#list_items">params</a>|
| Labels        |<a href="https://ubivar.com/docs/nodejs#create_label">params</a>|<a href="https://ubivar.com/docs/nodejs#retrieve_label">id</a>  |<a href="https://ubivar.com/docs/nodejs#update_label">id, params</a>|<a href="https://ubivar.com/docs/nodejs#delete_label">id</a>|<a href="https://ubivar.com/docs/nodejs#list_labels">params</a>|
| Fx            |        |          |        |        |<a href="https://ubivar.com/docs/nodejs#list_fx">params</a>|
| Bins          |        |          |        |        |<a href="https://ubivar.com/docs/nodejs#list_bin">params</a>|
| Status        |        |          |        |        |<a href="https://ubivar.com/docs/nodejs#list_status">params</a>|

## Parameters

| Filter        | Default | Example             | Description                   |
| ------------- |:-------:|:--------------------|:------------------------------|
| `start_after` |         | `{"start_after":10}`| `id` after the one specified  |
| `end_before`  |         | `{"end_before":10}` | `id` before the one specified |
| `limit`       | `10`    | `{"limit":10}`      | At most `10` returned results |
| `gt`          |         | `{"id":{"gt":10}}`  | `id` greater than 10          |
| `gte`         |         | `{"id":{"gte":10}}` | `id` greater than or equal    |
| `lt`          |         | `{"id":{"lt":10}}`  | `id` less than                |
| `lte`         |         | `{"id":{"lte":10}}` | `id` less than or equal       |

# More 

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

# Author

Originally inspired from [stripe-node](https://github.com/stripe/stripe-node). Developed by [Fabrice Colas](https://fabricecolas.me) ([fabrice.colas@gmail.com](mailto:fabrice.colas@gmail.com)). Maintained by Ubivar. 
