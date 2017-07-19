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
var UbivarError = _Error.UbivarError = _Error.extend({
    "type"    : "UbivarError"
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
 * Helper factory that returns an instance of UbivarError 
 * @rawUbivarError [Error] a raw error  
 */
UbivarError.generate = function(rawUbivarError){
  switch (rawUbivarError.type) {
    /* 4xx errors */
    case "invalid_request_error"    : return new _Error.UbivarInvalidRequestError(rawUbivarError)
    case "unauthorized_error"       : return new _Error.UbivarUnauthorizedError(rawUbivarError)
    case "method_not_allowed_error" : return new _Error.UbivarMethodNotAllowedError(rawUbivarError)
    case "payment_required_error"   : return new _Error.UbivarPaymentRequiredError(rawUbivarError)
    case "too_many_requests_error"  : return new _Error.UbivarTooManyRequestsError(rawUbivarError)
    /* 5xx errors */
    case "internal_server_error"    : return new _Error.UbivarInternalServerError(rawUbivarError)
    case "bad_gateway_error"        : return new _Error.UbivarBadGatewayError(rawUbivarError)
    case "api_error"                : return new _Error.UbivarAPIError(rawUbivarError)
  }
  return new _Error("Generic", "Unknown Error")
}

/*
 * Generate _Error subtypes
 */
_Error.UbivarInvalidRequestError  = UbivarError.extend({"type": "UbivarInvalidRequestError"   })
_Error.UbivarUnauthorizedError    = UbivarError.extend({"type": "UbivarUnauthorizedError"     })
_Error.UbivarConnectionError      = UbivarError.extend({"type": "UbivarConnectionError"       })
_Error.UbivarPaymentRequiredError = UbivarError.extend({"type": "UbivarPaymentRequiredError"  })
_Error.UbivarTooManyRequestsError = UbivarError.extend({"type": "UbivarTooManyRequestsError"  })
_Error.UbivarMethodNotAllowedError= UbivarError.extend({"type": "UbivarMethodNotAllowedError" })

_Error.UbivarInternalServerError  = UbivarError.extend({"type": "UbivarInternalServerError"   })
_Error.UbivarBadGatewayError      = UbivarError.extend({"type": "UbivarBadGatewayError"       })
_Error.UbivarAPIError             = UbivarError.extend({"type": "UbivarAPIError"              })

/*
 * Export the _Error factory
 */
module.exports = _Error
