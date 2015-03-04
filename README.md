# Ubivar node.js bindings [![Build Status](https://travis-ci.org/ubivar/ubivar-node.png?branch=master)](https://travis-ci.org/ubivar/ubivar-node)  [![Inline docs](http://inch-ci.org/github/ubivar/ubivar-node.svg?branch=master)](http://inch-ci.org/github/ubivar/ubivar-node)

# Installation

`npm install ubivar`

# Documentation

Documentation is available at [https://ubivar.com/docs/nodejs](https://ubivar.com/docs/nodejs)

# API Overview

Every resource is accessed via your `ubivar` instance: 

```
var Ubivar    = require("ubivar")
  , ubivar    = new Ubivar("your-token", "your-api-version") 
```

Every resource accepts an optional callback as the last argument. 

```
ubivar.accounts.create( {
    "user_id"       : "test_123"
  , "session_id"    : "test_session_id_123"
  , "user_email"    : "test_email@email-123.com"
  , "first_name"    : "test_yourfirstname_123"
  , "last_name"     : "test_yourlastname_123"
  , "primary_phone" : "+123456789-123"
  }, function(err, resource){
    err // null if no error
    resource // the created resource (account)
  })
```

# Available resources and methods

+ [Account](https://www.ubivar.com/docs/#account)
    + create(params)
    + retrieve(id)
    + update(id, params)
    + del(id)
    + list()
+ [Transaction](https://www.ubivar.com/docs/#transaction)
    + create(params)
    + retrieve(id)
    + update(id, params)
    + del(id)
    + list()
+ [Login](https://www.ubivar.com/docs/#login)
    + create(params)
    + retrieve(id)
    + update(id, params)
    + del(id)
    + list()
+ [Logout](https://www.ubivar.com/docs/#logout)
    + create(params)
    + retrieve(id)
    + update(id, params)
    + del(id)
    + list()
+ [Item](https://www.ubivar.com/docs/#item)
    + create(params)
    + retrieve(id)
    + update(id, params)
    + del(id)
    + list()
+ [Label](https://www.ubivar.com/docs/#label)
    + create(params)
    + retrieve(id)
    + update(id, params)
    + del(id)
    + list()
