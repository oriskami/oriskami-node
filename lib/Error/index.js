/*
 * FACTORY 
 */
function _Error(raw){
  this.populate.apply(this, arguments)
  this.stack = (new Error(this.message))
}

/*
 * PROTOTYPES
 */
_Error.prototype          = Object.create(Error.prototype)
_Error.prototype.type     = "GenericError"
_Error.prototype.populate = function(type, message){
  this.type               = type
  this.message            = message
}

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

var UbivarError = _Error.UbivarError = _Error.extend({
    "type"    : "UbivarError"
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

// Helper factory taking raw ubivar error that outputs wrapping instances
UbivarError.generate = function(rawUbivarError){
  switch (rawUbivarError.type) {
    case "invalid_request_error":
      return new _Error.UbivarInvalidRequestError(rawUbivarError)
    case "api_error":
      return new _Error.UbivarAPIError(rawUbivarError)
  }
  return new _Error("Generic", "Unknown Error")
}

/*
 * SPECIFIC ERROR TYPES
 */
_Error.UbivarInvalidRequestError  = UbivarError.extend({"type": "UbivarInvalidRequestError" })
_Error.UbivarAPIError             = UbivarError.extend({"type": "UbivarAPIError"            })
_Error.UbivarAuthenticationError  = UbivarError.extend({"type": "UbivarAuthenticationError" })
_Error.UbivarConnectionError      = UbivarError.extend({"type": "UbivarConnectionError"     })

module.exports = _Error
