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
      var err     = Error.UbivarError.generate({"type": "invalid_request_error"})
      expect(err).to.be.instanceOf(Error.UbivarInvalidRequestError)
    })

    it("Should have API error", function(){
      var err     = Error.UbivarError.generate({"type": "api_error"})
      expect(err).to.be.instanceOf(Error.UbivarAPIError)
    })
  })
})
