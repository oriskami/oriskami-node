/*
 * Error factory
 * @raw [Error] error
 */
function _Error(raw){
  this.populate.apply(this, arguments)
  this.stack = (new Error(this.message))
}

/*
 * Set default Error prototypes and type on _Error 
 */
_Error.prototype          = Object.create(Error.prototype)
_Error.prototype.type     = "GenericError"

/*
 * Prototype function that set attributes of the _Error
 * @type [String] the type of the error 
 * @message [String] the message associated with the error
 */
_Error.prototype.populate = function(type, message){
  this.type               = type
  this.message            = message
}

/*
 * Generic extend mechanisms to create new _Error types
 * @sub [Object]
 */
_Error.extend     = function(sub) {
  var hasOwn      = {}.hasOwnProperty
    , Super       = this
    , Constructor = hasOwn.call(sub, 'constructor') ? sub.constructor : function() {
    Super.apply(this, arguments)
  }
  Constructor.prototype = Object.create(Super.prototype)
  for (var i in sub) {
    if (hasOwn.call(sub, i)) {
      Constructor.prototype[i] = sub[i]
    }
  }
  for (i in Super) {
    if (hasOwn.call(Super, i)) {
      Constructor[i] = Super[i]
    }
  }
  return Constructor
}

/*
 * Map default Error attributes to _Error attributes 
 */
var OriskamiError = _Error.OriskamiError = _Error.extend({
    "type"    : "OriskamiError"
  /* Populate a raw error */
  , "populate": function(raw){ 
    this.type   = this.type
    this.stack  = (new Error(raw.message)).stack
    this.rawType= raw.type
    this.code   = raw.code
    this.param  = raw.param
    this.message= raw.message
    this.detail = raw.detail
    this.raw    = raw
  }
})

/*
 * Helper factory that returns an instance of OriskamiError 
 * @rawOriskamiError [Error] a raw error  
 */
OriskamiError.generate = function(rawOriskamiError){
  switch (rawOriskamiError.type) {
    /* 4xx errors */
    case "invalid_request_error"    : return new _Error.OriskamiInvalidRequestError(rawOriskamiError)
    case "unauthorized_error"       : return new _Error.OriskamiUnauthorizedError(rawOriskamiError)
    case "method_not_allowed_error" : return new _Error.OriskamiMethodNotAllowedError(rawOriskamiError)
    case "payment_required_error"   : return new _Error.OriskamiPaymentRequiredError(rawOriskamiError)
    case "too_many_requests_error"  : return new _Error.OriskamiTooManyRequestsError(rawOriskamiError)
    /* 5xx errors */
    case "internal_server_error"    : return new _Error.OriskamiInternalServerError(rawOriskamiError)
    case "bad_gateway_error"        : return new _Error.OriskamiBadGatewayError(rawOriskamiError)
    case "api_error"                : return new _Error.OriskamiAPIError(rawOriskamiError)
  }
  return new _Error("Generic", "Unknown Error")
}

/*
 * Generate _Error subtypes
 */
_Error.OriskamiInvalidRequestError  = OriskamiError.extend({"type": "OriskamiInvalidRequestError"   })
_Error.OriskamiUnauthorizedError    = OriskamiError.extend({"type": "OriskamiUnauthorizedError"     })
_Error.OriskamiConnectionError      = OriskamiError.extend({"type": "OriskamiConnectionError"       })
_Error.OriskamiPaymentRequiredError = OriskamiError.extend({"type": "OriskamiPaymentRequiredError"  })
_Error.OriskamiTooManyRequestsError = OriskamiError.extend({"type": "OriskamiTooManyRequestsError"  })
_Error.OriskamiMethodNotAllowedError= OriskamiError.extend({"type": "OriskamiMethodNotAllowedError" })

_Error.OriskamiInternalServerError  = OriskamiError.extend({"type": "OriskamiInternalServerError"   })
_Error.OriskamiBadGatewayError      = OriskamiError.extend({"type": "OriskamiBadGatewayError"       })
_Error.OriskamiAPIError             = OriskamiError.extend({"type": "OriskamiAPIError"              })

/*
 * Export the _Error factory
 */
module.exports = _Error
