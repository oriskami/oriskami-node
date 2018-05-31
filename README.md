# Oriskami node.js bindings 
[![npm version](https://badge.fury.io/js/oriskami.svg)](https://badge.fury.io/js/oriskami)
[![Build Status](https://travis-ci.org/oriskami/oriskami-node.png?branch=master)](https://travis-ci.org/oriskami/oriskami-node)
[![Inline docs](http://inch-ci.org/github/oriskami/oriskami-node.svg?branch=master)](http://inch-ci.org/github/oriskami/oriskami-node)
 

This library helps interact with Oriskami's API, a *risk management intelligence* 
to detect and manage transactions having a risk. Oriskami works by:
1. fusioning your transaction data with external data providers; 
2. applying filters like whitelists, blacklists, rules, or risk scores trained with machine learning; and
3. triggering notifications when a risk is detected (e-mail, slack, signed webhooks, etc.). 

For a quick start see below, otherwise here are few links:
- [**Browse product details**](https://www.oriskami.com/shop)
- [**Sign up**](https://www.oriskami.com/signup)
- [**Schedule a demo**](https://www.oriskami.com/shop/schedule-demo)
- [**See the docs**](https://www.oriskami.com/docs)

## Quick Start 

Install the nodejs binding of `oriskami` from npm.
```js
npm install --save oriskami
```

Initialize the binding with your API access token:
```js
var Oriskami    = require("oriskami")
  , oriskami    = new Oriskami("YOUR_API_ACCESS_TOKEN", "API_VERSION")
```

And then simply send `event` to the API and process the usual callback. 

```js
oriskami.events.create({
  "parameters"  :{
    "id": 16646 
  , "email": "abc@gmail.com"
  , "names": "M Abc"
  , "account_creation_time": "2017-05-17 21:50:00"
  , "account_id": "10000"
  , "account_n_fulfilled": "1"
  , "account_total_since_created": "49.40"
  , "account_total_cur": "EUR"
  , "invoice_time": "2017-05-17 21:55:00"
  , "invoice_address_country": "France"
  , "invoice_address_place": "75008 Paris"
  , "invoice_address_street1": "1 Av. des Champs-Élysées"
  , "invoice_name": "M ABC"
  , "invoice_phone1": "0123456789"
  , "invoice_phone2": null
  , "transport_date": "2017-05-18 08:00:00"
  , "transport_type": "Delivery"
  , "transport_mode": "TNT"
  , "transport_weight": "9.000"
  , "transport_unit": "kg"
  , "transport_cur": "EUR"
  , "delivery_address_country": "France"
  , "delivery_address_place": "75008 Paris"
  , "delivery_address_street1": "1 Av. des Champs-Élysées"
  , "delivery_name": "M ABC"
  , "delivery_phone1": "0123450689"
  , "customer_ip_address": "1.2.3.4"
  , "pmeth_origin": "FRA"
  , "pmeth_validity": "0121"
  , "pmeth_brand": "MC"
  , "pmeth_bin": "510000"
  , "pmeth_3ds": "-1"
  , "cart_products": [ " Product ref #12345 ", " Product ref #45678 " ]
  , "cart_details": [{
      "name": "Product ref #12345"
    , "pu": "10.00"
    , "n": "1"
    , "reimbursed": " 0"
    , "available": "1"
    , "amount": "10.00"
    , "cur": "EUR"
    }, {
      "name": "Product ref #45678"
    , "pu": "20.00"
    , "n": "2"
    , "reimbursed": " 0"
    , "available": "1"
    , "amount": "40.00"
    , "cur": "EUR"
    }]
  , "cart_n": "15000"
  , "order_payment_accepted": "2017-05-17 22:00:00"
  , "amount_pmeth": "ABC Payment Service Provider"
  , "amount_discounts": 0.00
  , "amount_products": 20.00
  , "amount_transport": 10.00
  , "amount_total": 30.00
  , "amount_cur": "EUR"
  }
}, (err, res) => /* process results */)
```

Later you can retrieve an `event` via its `id`. 
```js
oriskami.events.retrieve("16646", (err, res) => /* process results */)
```
## Events API: Open Beta (public preview) 

|               | Resource                | C | R | U | D | L     | Test Specs |
|--------------:| ----------------------- |:-:|:-:|:-:|:-:|:-----:|:-------:|
| **Event data**| Event                   | [`{}`](https://oriskami.com/docs/nodejs#create_event)| [`123`](https://oriskami.com/docs/nodejs#retrieve_event) | [`123, {}`](https://oriskami.com/docs/nodejs#update_event) | [`123`](https://oriskami.com/docs/nodejs#delete_event) | [`{}`](https://oriskami.com/docs/nodejs#list_event) | [See on github](https://github.com/oriskami/oriskami-node/blob/master/test/Resources/Event/spec.js) | 
|               | EventPast               | [`{}`](https://oriskami.com/docs/nodejs#create_eventpast)|  |  |  | [`{}`](https://oriskami.com/docs/nodejs#list_eventpast) | [See on github](https://github.com/oriskami/oriskami-node/blob/master/test/Resources/EventPast/spec.js) | 
|               | EventLabel              | | [`123`](https://oriskami.com/docs/nodejs#retrieve_eventlabel) | [`123, {}`](https://oriskami.com/docs/nodejs#update_eventlabel) | [`123`](https://oriskami.com/docs/nodejs#delete_eventlabel) | [`{}`](https://oriskami.com/docs/nodejs#list_eventlabel) | [See on github](https://github.com/oriskami/oriskami-node/blob/master/test/Resources/EventLabel/spec.js)| 
|               | EventLastId             |  |  |  |  | [`{}`](https://oriskami.com/docs/nodejs#list_eventlastid) | [See on github](https://github.com/oriskami/oriskami-node/blob/master/test/Resources/EventLastId/spec.js)| 

+ *C*: Create
+ *R*: Retrieve
+ *U*: Update
+ *D*: Delete
+ *L*: List
+ `123`: resource id 
+ `{}`: JSON with query parameters

## Code snippets and filter parameters

A few code snippets:

| Action | Code snippet |
|:------------|:-----|
| 1. Change token | `oriskami.set("auth", "your-api-token")` | 
| 2. Add new `resource` | `oriskami.extend("resourceName", "resourcePath")` | 
| 3. Change timeout | `oriskami.set("timeout", 20000) // in ms` | 

Filters available for most resources (`list`).

| Filter        | Default | Example             | Description                   |
| ------------- |:-------:|:--------------------|:------------------------------|
| `limit`       | `10`    | `{"limit":10}`      | At most `10` returned results |
| `gt`          |         | `{"id":{"gt":10}}`  | `id` greater than 10          |
| `gte`         |         | `{"id":{"gte":10}}` | `id` greater than or equal    |
| `lt`          |         | `{"id":{"lt":10}}`  | `id` less than                |
| `lte`         |         | `{"id":{"lte":10}}` | `id` less than or equal       |

## Development

To run the tests, you will need a Oriskami test API key (from your [Oriskami dashboard](https://my.oriskami.com))

```
export ORISKAMI_TEST_TOKEN="your-test-api-key"
npm install -g mocha
npm test
```
*Note: on Windows, use `SET` instead of `export` for setting the `ORISKAMI_TEST_TOKEN` environment variable.*

### [Issues and feature requests](https://github.com/oriskami/oriskami-node/issues)

## Author

- Inspired from [stripe-node](https://github.com/stripe/stripe-node). 
- Developed and maintained by Fabrice Colas for [Oriskami](https://www.oriskami.com). 
