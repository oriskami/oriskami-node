var fs          = require("fs")
  , request     = require("request")
  , path        = require("path")
  , examples    = require("./test/data/events.js")
  , apiVersion  = fs.readFileSync(path.join(__dirname, "VERSION"), {"encoding": "utf8"})
  , Ubivar      = require("./lib")
  , ubivar      = new Ubivar(process.env.UBIVAR_TEST_TOKEN, apiVersion)

ubivar.events.create(examples[0], function(err, res){
  console.log(err, res)
})
