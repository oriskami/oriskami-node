var fs          = require("fs")
  , path        = require("path")
  , apiVersion  = fs.readFileSync(path.join(__dirname, "../API_VERSION"), {"encoding": "utf8"})

// _________________________________________________________________________
// 2018-06-05: routines:SSL23_GET_SERVER_HELLO:sslv3 alert handshake failure
// https://github.com/nodejs/node/issues/16196
require("tls").DEFAULT_ECDH_CURVE = "auto"
// _________________________________________________________________________

module.exports = require("../lib")(process.env["ORISKAMI_TEST_TOKEN_NODEJS_1"], apiVersion)
