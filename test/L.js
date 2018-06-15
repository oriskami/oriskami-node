module.exports = { 
  "logError": function(done){
    return function(err, res){
      if(err){ 
        console.log("error>", err)
        console.log("response>", res)
      }
      done(err) 
    }
  }
}
