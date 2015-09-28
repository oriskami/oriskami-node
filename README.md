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

### Send analytics event 
```js
ubivar.transactions.create({
  "parameters"  : {
    "first_name": "John"
  , "last_name" : "Doe"  
}}, function(err, res){

  if(err) return err 
  // something unexpected occurred

  txId          = res.data[0].id 
  // keep track of the id 
})
```

```js
ubivar.labels.retrieve(txId, function(err, res){

  if(err) return err
  // something unexpected occurred

  data  = res.data[0]
  // the data of the event
})
```

## Resources, actions, and arguments 
Every resource is accessed via your `ubivar` instance and accepts an optional
callback as the last argument. In the matrix below we list the resources
(rows), the actions (columns) and the arguments (cells). The full documentation
is available at [https://ubivar.com/docs/nodejs](https://ubivar.com/docs/nodejs). 

| Resource      | C | R | U | D | L | Test Specs |
| ------------- |:-:|:-:|:-:|:-:|:----:|:-------:|:----------:|
| Me            |        |<a href="https://ubivar.com/docs/nodejs#retrieve_your_information">_</a>  |<a href="https://ubivar.com/docs/nodejs#retrieve_your_information">`{}`</a>|        |        | [![](https://status.ubivar.com/ubivar-node/resources/me.svg)](https://github.com/ubivar/ubivar-node/blob/master/test/Resources/Me/spec.js) |
| Events |<a href="https://ubivar.com/docs/nodejs#create_event">`{}`</a>|<a href="https://ubivar.com/docs/nodejs#retrieve_event">id</a>  | <a href="https://ubivar.com/docs/nodejs#update_event">`{}`</a>       |<a href="https://ubivar.com/docs/nodejs#delete_event">id</a>|<a href="https://ubivar.com/docs/nodejs#list_events">`{}`</a>| [![](https://status.ubivar.com/ubivar-node/resources/events.svg)](https://github.com/ubivar/ubivar-node/blob/master/test/Resources/Events/spec.js)| 

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
