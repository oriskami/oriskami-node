var fs          = require("fs")
  , path        = require("path")
  , apiVersion  = fs.readFileSync(path.join(__dirname, "../API_VERSION"), {"encoding": "utf8"})

module.exports = require("../lib")(process.env["ORISKAMI_TEST_TOKEN_NODEJS_1"], apiVersion)
