var fs          = require("fs")
  , path        = require("path")
  , apiVersion  = fs.readFileSync(path.join(__dirname, "../VERSION"), {"encoding": "utf8"})

module.exports = require("../lib")(process.env.UBIVAR_TEST_TOKEN, apiVersion)
