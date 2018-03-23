var express = require("express");
var bodyParser = require("body-parser");
var https = require('https');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var dateFormat = require('dateformat');
var azure = require('azure');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.static(__dirname + "/dist"));

const port = process.env.PORT || 3001;

app.listen(port,() => {
    console.log(`App Server Listening at ${port}`);
    });

app.get('/', (req,res) => {
return res.end('Api working');
});

app.post('/sendRsvp', (req, res) => {
    //console.log(req.body.firstName);
    //console.log("in send rsvp");

    var {google} = require('googleapis');
    var OAuth2 = google.auth.OAuth2;

    var key = require('./key.json');
    var jwtClient = new google.auth.JWT(
    key.client_email,
    null,
    key.private_key,
    ['https://www.googleapis.com/auth/spreadsheets'], // an array of auth scopes
    null
    );

    jwtClient.authorize(function (err, tokens) {
    if (err) {
        console.log(err);
        return;
    }
    console.log(tokens);

    var accessToken = tokens.access_token;

    var sheetId = "1_0IFOD-JbYSKO_lShJd965yIN1Z6guCpktqc46_Np94"; //Our wedding worksheet, shared with a service account
    var postUrl = "/v4/spreadsheets/"+sheetId+"/values/RSVP!A1:D1:append?valueInputOption=USER_ENTERED&access_token=" + accessToken;

    var values = '[' +
        '"' + req.body.firstName + '",' +
        '"' + req.body.lastName + '",' +
        '"' + req.body.mealOption + '",' +
        '"' + req.body.dietaryRestrictions + '"' +
    ']';

    var body = '{ "values": [' +
        values + 
    ']}';
    var post_options = {
        host: 'sheets.googleapis.com',
        port: '443',
        path: postUrl,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    //console.log(values);

    //console.log(body);
    //console.log("String body: " + querystring.stringify(values));

    var post_req = https.request(post_options, function(res) {
        console.log("in post req");
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('Response: ' + chunk);
        }).on('error', function(err) {
            console.log(err);
        });
    });
    post_req.on('error', function(e) {
        console.log("problem with request: " + e.message);
    });

    // post the data
    post_req.write(body);
    post_req.end();


});


    res.send("Success");
    });


app.post('/uploadImage', upload.single('file'), (req, res) => {
    console.log("hit action");
    console.log(req.file);

    var key = require('./blob-storage-key.json');

    var filename = req.file.originalname;
    var contentType = req.file.mimetype;
    var url = "/default";

    var host = "balesrussweddingpics.blob.core.windows.net";


    var blobService = azure.createBlobService("balesrussweddingpics", key.key, host);
    blobService.createContainerIfNotExists("default", {
        publicAccessLevel: 'blob'
    }, function (error) {
        if (!error) {
            var sharedAccessPolicy = {
                AccessPolicy: {
                    Permissions: azure.Constants.BlobConstants.SharedAccessPermissions.WRITE,
                    Expiry: new Date(new Date().getTime() + 5*60*1000)
                }
            };

            var queryUrl = blobService.generateSharedAccessSignature("default", '', sharedAccessPolicy);
            var uri = queryUrl.baseUrl + queryUrl.path + '/' + filename;

            var put_options = {
                host: host,
                port: '443',
                path: uri,
                method: 'POST',
                headers: {
                    'x-ms-blob-content-type': contentType,
                    'x-ms-blob-type': 'BlockBlob'
                }
            };

            var put_req = https.request(put_options, function(res) {
                console.log("in put req");
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    console.log('Response: ' + chunk);
                }).on('error', function(err) {
                    console.log(err);
                });
            });
            put_req.on('error', function(e) {
                console.log("problem with request: " + e.message);
            });
        
            // post the data
            put_req.write(req.file);
            put_req.end();
        
        }
    });

    

});

exports = module.exports = app;