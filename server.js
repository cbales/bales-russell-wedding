var express = require("express");

const app = express();

app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.static(__dirname + "/dist"));

const port = process.env.PORT || 3001;

app.get('/', (req,res) => {
return res.end('Api working');
});

    app.listen(port,() => {
    console.log(`App Server Listening at ${port}`);
    });