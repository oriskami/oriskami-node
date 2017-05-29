# Ubivar node.js bindings 
[![npm version](https://badge.fury.io/js/ubivar.svg)](http://badge.fury.io/js/ubivar)
[![Build Status](https://travis-ci.org/ubivar/ubivar-node.png?branch=master)](https://travis-ci.org/ubivar/ubivar-node)
[![Inline docs](http://inch-ci.org/github/ubivar/ubivar-node.svg?branch=master)](http://inch-ci.org/github/ubivar/ubivar-node)
 

The Ubivar Node.js library provides access to the Ubivar API from applications
written in the Node.js language. It includes a pre-defined set of classes for
API resources.

## Quick Start

Install the nodejs binding of `ubivar` from npm.

`npm install ubivar`

Initialize the binding with your API access token:

```js
var Ubivar    = require("ubivar")
  , ubivar    = new Ubivar("YOUR_API_ACCESS_TOKEN")
```

### Send event 
```js
ubivar.events.create({
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
ubivar.events.retrieve("16646", function(err, res){
  if(err){ 
    console.log(err)
    return err
  }
})
```

## Resources, actions, and arguments 
Every resource is accessed via your `ubivar` instance and accepts an optional
callback as the last argument. In the matrix below we list the resources
(rows), the actions (columns) and the arguments (cells). The full documentation
is available at [https://ubivar.com/docs/nodejs](https://ubivar.com/docs/nodejs). 

|               | Resource                | C | R | U | D | L    | Test Specs |
|--------------:| ----------------------- |:-:|:-:|:-:|:-:|:-----:|:-------:|
| **Settings**  | Me                      |   | [x](https://ubivar.com/docs/nodejs#retrieve_your_information) | [`{}`](https://ubivar.com/docs/nodejs#retrieve_your_information) |  | | |
| **Data**      | Events                  | [`{}`](https://ubivar.com/docs/nodejs#create_event)| [123](https://ubivar.com/docs/nodejs#retrieve_event) | [`{}`](https://ubivar.com/docs/nodejs#update_event) | [123](https://ubivar.com/docs/nodejs#delete_event) | [`{}`](https://ubivar.com/docs/nodejs#list_events) | | 
|               | Labels            | [`{}`](https://ubivar.com/docs/nodejs#create_label)| [123](https://ubivar.com/docs/nodejs#retrieve_label) | [`{}`](https://ubivar.com/docs/nodejs#update_label) | [123](https://ubivar.com/docs/nodejs#delete_label) | [`{}`](https://ubivar.com/docs/nodejs#list_labels) | | 
|               | Features                  |   | [123](https://ubivar.com/docs/nodejs#retrieve_feature) |  |  | [`{}`](https://ubivar.com/docs/nodejs#list_features) | | 
| **Filtering** | Whitelists              | [`{}`](https://ubivar.com/docs/nodejs#create_whitelist)| [123](https://ubivar.com/docs/nodejs#retrieve_whitelist) | [`{}`](https://ubivar.com/docs/nodejs#update_whitelist) | [123](https://ubivar.com/docs/nodejs#delete_whitelist) | [`{}`](https://ubivar.com/docs/nodejs#list_whitelists) | | 
|               | Blacklists              |   | [123](https://ubivar.com/docs/nodejs#retrieve_blacklist) | [`{}`](https://ubivar.com/docs/nodejs#update_blacklist) |  | [`{}`](https://ubivar.com/docs/nodejs#list_blacklists) | | 
|               | Custom rules            | [`{}`](https://ubivar.com/docs/nodejs#create_rules_custom)| [123](https://ubivar.com/docs/nodejs#retrieve_rules_custom) | [`{}`](https://ubivar.com/docs/nodejs#update_rules_custom) | [123](https://ubivar.com/docs/nodejs#delete_rules_custom) | [`{}`](https://ubivar.com/docs/nodejs#list_rules_customs) | | 
|               | Base rules              |   | [123](https://ubivar.com/docs/nodejs#retrieve_rules_base) | [`{}`](https://ubivar.com/docs/nodejs#update_rules_base) |  | [`{}`](https://ubivar.com/docs/nodejs#list_rules_bases) | | 
|               | AI rules                |   | [123](https://ubivar.com/docs/nodejs#retrieve_rules_ai) | [`{}`](https://ubivar.com/docs/nodejs#update_rules_ai) |  | [`{}`](https://ubivar.com/docs/nodejs#list_rules_ais) | | 
|               | Dedicated scoring       | [`{}`](https://ubivar.com/docs/nodejs#create_dedicated_scorings)| [123](https://ubivar.com/docs/nodejs#retrieve_dedicated_scorings) | [`{}`](https://ubivar.com/docs/nodejs#update_dedicated_scorings) | [123](https://ubivar.com/docs/nodejs#delete_dedicated_scorings) | [`{}`](https://ubivar.com/docs/nodejs#list_dedicated_scoringss) | | 
|               | Mutualized scoring      |   | [123](https://ubivar.com/docs/nodejs#retrieve_mutualized_scorings) | [`{}`](https://ubivar.com/docs/nodejs#update_mutualized_scorings) |  | [`{}`](https://ubivar.com/docs/nodejs#list_mutualized_scoringss) | | 
| **Notifications** | Email | [`{}`](https://ubivar.com/docs/nodejs#create_email)| [123](https://ubivar.com/docs/nodejs#retrieve_email) | [`{}`](https://ubivar.com/docs/nodejs#update_email) | [123](https://ubivar.com/docs/nodejs#delete_email) | [`{}`](https://ubivar.com/docs/nodejs#list_emails) | | 
|                   | Sms   | [`{}`](https://ubivar.com/docs/nodejs#create_sms)| [123](https://ubivar.com/docs/nodejs#retrieve_sms) | [`{}`](https://ubivar.com/docs/nodejs#update_sms) | [123](https://ubivar.com/docs/nodejs#delete_sms) | [`{}`](https://ubivar.com/docs/nodejs#list_smss) | | 
|                   | Webhook | [`{}`](https://ubivar.com/docs/nodejs#create_webhook)| [123](https://ubivar.com/docs/nodejs#retrieve_webhook) | [`{}`](https://ubivar.com/docs/nodejs#update_webhook) | [123](https://ubivar.com/docs/nodejs#delete_webhook) | [`{}`](https://ubivar.com/docs/nodejs#list_webhooks) | | 
|                   | E-commerce |   | [123](https://ubivar.com/docs/nodejs#retrieve_e-commerce) | [`{}`](https://ubivar.com/docs/nodejs#update_e-commerce) |  | [`{}`](https://ubivar.com/docs/nodejs#list_e-commerces) | | 
|                   | Slack | [`{}`](https://ubivar.com/docs/nodejs#create_slack)| [123](https://ubivar.com/docs/nodejs#retrieve_slack) | [`{}`](https://ubivar.com/docs/nodejs#update_slack) | [123](https://ubivar.com/docs/nodejs#delete_slack) | [`{}`](https://ubivar.com/docs/nodejs#list_slacks) | | 

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
