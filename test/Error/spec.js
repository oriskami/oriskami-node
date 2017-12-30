"use strict"

var Error         = require("../../lib/Error")
  , expect        = require("chai").expect
  , _             = require("lodash")

describe("Error", function(){
  var errMessage  = "Foo happen"
    , errType     = "FooError"
    , err         = new Error(errType, errMessage)

  describe("Properties", function(){
    it("Should have a type", function(){
      expect(err).to.have.property("type", errType)
    })
    it("Should have a message", function(){
      expect(err).to.have.property("message", errMessage)
    })
    it("Should have a stack", function(){
      expect(err).to.have.property("stack")
    })
  })

  describe("Types", function(){
    it("Should have invalid request error", function(){
      var err     = Error.OriskamiError.generate({"type": "invalid_request_error"})
      expect(err).to.be.instanceOf(Error.OriskamiInvalidRequestError)
    })

    it("Should have API error", function(){
      var err     = Error.OriskamiError.generate({"type": "api_error"})
      expect(err).to.be.instanceOf(Error.OriskamiAPIError)
    })

    it("Should have Unauthorized (401) error", function(){
      var err     = Error.OriskamiError.generate({"type": "unauthorized_error"})
      expect(err).to.be.instanceOf(Error.OriskamiUnauthorizedError)
    })

    it("Should have PaymentRequired (402) error", function(){
      var err     = Error.OriskamiError.generate({"type": "payment_required_error"})
      expect(err).to.be.instanceOf(Error.OriskamiPaymentRequiredError)
    })

    it("Should have MethodNotAllowed (405) error", function(){
      var err     = Error.OriskamiError.generate({"type": "method_not_allowed_error"})
      expect(err).to.be.instanceOf(Error.OriskamiMethodNotAllowedError)
    })

    it("Should have TooManyRequests (429) error", function(){
      var err     = Error.OriskamiError.generate({"type": "too_many_requests_error"})
      expect(err).to.be.instanceOf(Error.OriskamiTooManyRequestsError)
    })

    it("Should have InternalServerError (500) error", function(){
      var err     = Error.OriskamiError.generate({"type": "internal_server_error"})
      expect(err).to.be.instanceOf(Error.OriskamiInternalServerError)
    })

    it("Should have BadGatewayError (502) error", function(){
      var err     = Error.OriskamiError.generate({"type": "bad_gateway_error"})
      expect(err).to.be.instanceOf(Error.OriskamiBadGatewayError)
    })
  })
})
