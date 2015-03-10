# Ubivar node.js bindings [![Build Status](https://travis-ci.org/ubivar/ubivar-node.png?branch=master)](https://travis-ci.org/ubivar/ubivar-node)

# Installation

`git clone https://github.com/ubivar/ubivar-node.git`

# Documentation

Documentation is available at https://ubivar.com/docs/nodejs

# API Overview

Every resource is accessed via your `ubivar` instance: 

```
var Ubivar    = require("ubivar")
  , clientId  = "your-client-id"
  , secretKey = "your-secret-key"
  , apiVersion= "your-api-version"
  , ubivar    = new Ubivar(clientId, secretKey, apiVersion) 
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

+ Account
    + create(params)
    + retrieve(id)
    + update(id, params)
    + del(id)
    + list()
+ Transaction
    + create(params)
    + retrieve(id)
    + update(id, params)
    + del(id)
    + list()
+ Login
    + create(params)
    + retrieve(id)
    + update(id, params)
    + del(id)
    + list()
+ Logout
    + create(params)
    + retrieve(id)
    + update(id, params)
    + del(id)
    + list()
+ Item
    + create(params)
    + retrieve(id)
    + update(id, params)
    + del(id)
    + list()
+ Label
    + create(params)
    + retrieve(id)
    + update(id, params)
    + del(id)
    + list()
