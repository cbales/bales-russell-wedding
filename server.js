var express = require("express");
var bodyParser = require("body-parser");
var https = require('https');
var multer = require('multer');

var MulterAzureStorage = require('multer-azure-storage');
var key = require('./blob-storage-key.json');
var upload = multer({
  storage: new MulterAzureStorage({
    azureStorageConnectionString: key.connectionString,
    containerName: 'default',
    containerSecurity: 'blob'
  })
})

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
return res.end('The robots are working on refreshing the website. Try again in a minute or two.');
});

app.post('/sendRsvp', (req, res) => {
    //console.log(req);
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

    var accessToken = tokens.access_token;

    var sheetId = "1_0IFOD-JbYSKO_lShJd965yIN1Z6guCpktqc46_Np94"; //Our wedding worksheet, shared with a service account
    var postUrl = "/v4/spreadsheets/"+sheetId+"/values/RSVP!A1:D1:append?valueInputOption=USER_ENTERED&access_token=" + accessToken;

    var values = '';

    req.body.forEach(guest => {
        values+= '["' + guest.firstName + '",'+
        '"' + guest.lastName + '",' +
        '"' + guest.rsvp + '",' +
        '"' + guest.dietaryRestrictions + '",' +
        '"' + guest.songRequest +'"],'
    });

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

    var post_req = https.request(post_options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            //throwing away the response!
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
    res.send("Success!");
});

app.post('/lookupUser', (req, res) => {
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
        //console.log(tokens);

        var accessToken = tokens.access_token;
        //console.log(accessToken);

        var sheetId = "1_0IFOD-JbYSKO_lShJd965yIN1Z6guCpktqc46_Np94"; //Our wedding worksheet, shared with a service account
        var getUrl = "https://sheets.googleapis.com/v4/spreadsheets/"+sheetId+"/values/Guests!A5:C300?access_token=" + accessToken;

        var partyList = [];
        var rsvpData = [];

        https.get(getUrl, (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
                var x = JSON.parse(data);
                var users = x['values'];

                users.forEach(user =>
                {
                    if (user[0] == req.body.firstName && user[1] == req.body.lastName) {
                        partyList.push(user);

                        // Now look for other party members
                        users.forEach(guest => {
                            if (guest[2] == user[2] && !(user[0] == guest[0] && user[1] == guest[1])) {
                                partyList.push(guest);
                            }
                        });
                    }
                });
                // NOW we look for whether we have marked them as yes or no yet
                var rsvpUrl = "https://sheets.googleapis.com/v4/spreadsheets/"+sheetId+"/values/RSVP!A2:E300?access_token=" + accessToken;
    
                if(partyList.length > 0) {
                    https.get(rsvpUrl, (resp) => {
                        let data = '';
                        resp.on('data', (chunk) => {
                            data += chunk;
                        });
                        resp.on('end', () => {
                            //console.log(JSON.parse(data));
                            var x = JSON.parse(data);
                            var users = x['values'];
        
                            users.forEach(user =>
                            {
                                partyList.forEach(party => {
                                    if(user[0] == party[0] && user[1] == party[1]) {
                                        rsvpData.push(user);
                                    }
                                });
                            });
                        var response = { party: partyList, rsvpData: rsvpData};
                        res.send(response);
        
                        });
                    });
                } else {
                    var response = { party: partyList, rsvpData: null};
                    res.send(response);
                }
            });
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        }); 
    });
});

function getAccessToken(callback) {
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
    }
    callback(tokens.access_token);
    });
}

app.get('/getState', (req, res) => {
    var stateParks = [];
    var state = Object.keys(req.query)[0];
    getAccessToken(function(accessToken){
        var sheetId = "1pJH_upOGrzfSuTk1JHz5WQdZRNaOqcAPdMtHC2n9pWs"; // National parks workbook
        var parkUrl = "https://sheets.googleapis.com/v4/spreadsheets/"+sheetId+"/values/Parks!A2:F418?access_token=" + accessToken;

        https.get(parkUrl, (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
              data += chunk;
            });
            resp.on('end', () =>{
              var results = JSON.parse(data);
              parks = results['values'];

              parks.forEach(park => {
                if (park[2].includes(state)) {
                    stateParks.push(park);
                }
              });
              res.send(stateParks);
        });
    });
    });
});

app.post('/createPin', (req, res) => {
    getAccessToken(function(accessToken) {
        var sheetId = "1pJH_upOGrzfSuTk1JHz5WQdZRNaOqcAPdMtHC2n9pWs"; // National parks workbook
        var postUrl = "https://sheets.googleapis.com/v4/spreadsheets/"+sheetId+"/values/Visitors!A2:B600:append?valueInputOption=USER_ENTERED&access_token=" + accessToken;

        var values = '[' +
            '"' + req.body.parkId + '",' +
            '"' + req.body.name + '"' +
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

        var post_req = https.request(post_options, function(res) {
            
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
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

app.post('/sendBug', (req, res) => {
    getAccessToken(function(accessToken){

        var sheetId = "1_0IFOD-JbYSKO_lShJd965yIN1Z6guCpktqc46_Np94"; // Our wedding worksheet
        var postUrl = "https://sheets.googleapis.com/v4/spreadsheets/"+sheetId+"/values/WebsiteBugs!A2:C2:append?valueInputOption=USER_ENTERED&access_token=" + accessToken;

        var values = '["' + req.body.issue + '","' + req.body.notify+'","' + req.body.name +'"]';

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

    var post_req = https.request(post_options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {

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
    res.send("Success");
    });
    
});

app.get('/getPins', (req, res) => {
    var markers = [];
    var parks = [];

    getAccessToken(function(accessToken){

    var sheetId = "1pJH_upOGrzfSuTk1JHz5WQdZRNaOqcAPdMtHC2n9pWs"; // National parks workbook
    var parkUrl = "https://sheets.googleapis.com/v4/spreadsheets/"+sheetId+"/values/Parks!A2:F418?access_token=" + accessToken;
    var visitUrl = "https://sheets.googleapis.com/v4/spreadsheets/"+sheetId+"/values/Visitors!A2:B600?access_token=" + accessToken;

    https.get(parkUrl, (resp) => {
      let data = '';
      resp.on('data', (chunk) => {
        data += chunk;
      });
      resp.on('end', () =>{
        var results = JSON.parse(data);
        parks = results['values'];

        https.get(visitUrl, (resp) => {
          let data = '';
          resp.on('data', (chunk) => {
            data += chunk;
          });
          resp.on('end', () =>{
            var results = JSON.parse(data);
            var visits = results['values'];

            visits.forEach(visit => {
              var visitedPark = [];
                parks.forEach(park => {
                  if (park[0] == visit[0])
                    visitedPark = park;
                });

                let m = {
                  lat: visitedPark[3],
                  lng: visitedPark[4],
                  label: '',
                  visitor: visit[1],
                  location: visitedPark[1]
                };
                markers.push(m);
            });
            //console.log(markers);
            //return markers;
            res.send(markers);
          });
        });
      });
    });
});
}); 

exports = module.exports = app;