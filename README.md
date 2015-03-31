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

# Install

`npm install ubivar`

# Documentation

Documentation is available at [https://ubivar.com/docs/nodejs](https://ubivar.com/docs/nodejs)

# API Overview

Every resource is accessed via your `ubivar` instance and accepts an optional
callback as the last argument. The sample code below retrieves your account
information (as json) and updates the primary phone with a random value. 

## Quick Start

### A. Init 
```js
var Ubivar    = require("ubivar")
  , ubivar    = new Ubivar("YOUR_API_ACCESS_TOKEN", "latest")
```

### B. Send an e-commerce transaction
```js
ubivar.transactions.create({
  "user_id"     : "test_phahr3Eit3_123"           // the id of your client
, "user_email"  : "test_phahr3Eit3@gmail-123.com" // the email of your client
, "type"        : "sale"                          // the type of transaction
, "status"      : "success"                       // whether the transaction was authorized
, "order_id"    : "test_iiquoozeiroogi_123"       // the shopping cart id
, "tx_id"       : "client_tx_id_123"              // the transaction id of this transaction
, "amount"      : "43210"                         // the amount of the transaction in cents
, "payment_method":{
    "bin"       :"123456"                         // the bank identification number of the card
  , "brand"     :"Mastercard"                     // the brand of the card
  , "funding"   :"credit"                         // the type of card
  , "country"   :"US"                             // the iso country code of the card
  , "name"      :"M Man"                          // the name of the card holder
  , "cvc_check":"pass"                            // whether the card passed the cvc check
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

## All resources and methods
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

## Configuration

+ `ubivar.set("auth", "your-api-token")`
+ `ubivar.setTimeout(20000) // in ms`, node's default is `120000ms`

# More information / wikis

+ [In-depth documentation](https://www.ubivar.com/docs/nodejs)

# Development

To run the tests, you will need a Ubivar test API key (from your [Ubivar dashboard](https://my.ubivar.com))

```
export UBIVAR_TEST_TOKEN="your-test-api-key"
npm install -g mocha
npm test
```
*Note: on Windows, use `SET` instead of `export` for setting the `UBIVAR_TEST_TOKEN` environment variable.*

# Author

Originally inspired from [stripe-node](https://github.com/stripe/stripe-node). Developed by [Fabrice Colas](https://fabricecolas.me) ([fabrice.colas@gmail.com](mailto:fabrice.colas@gmail.com)). Maintained by Ubivar. 
