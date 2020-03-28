var express = require('express');
var app = express();
var Twitter = require('twitter-lite');
const crypto = require('crypto');
const qs = require('querystring');
const request = require('request');
const util = require('util');
const get = util.promisify(request.get);
//var twitterData = require('./twitterData');
// var sampledb = { constellation:[ ]};

var reqTkn;
var reqTknSecret;
var verifier;
var accTkn;
var accTknSecret;
var userId;
var screenName;
var buf = crypto.randomBytes(32).toString('base64');
console.log(buf);
var signature;
const endpointURL = new URL(`https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${screenName}`);
const consumer_key = 'SiPSBNbS3Z07JISLrMbpMytHG'; // Add your API key here
const consumer_secret = 'Tiqnm2d0FHUoc4nXDU1PNIj17p7kWdCs2uLiEpO2SFGXfZX9zT'; // Add your API secret key here
const params = {
  ids: '1067094924124872705',
  'tweet.fields': 'created_at',
};



const client = new Twitter({
  consumer_key: "SiPSBNbS3Z07JISLrMbpMytHG",
  consumer_secret: "Tiqnm2d0FHUoc4nXDU1PNIj17p7kWdCs2uLiEpO2SFGXfZX9zT"
});

var port = process.env.PORT || 3000;

app.use('/background', express.static(__dirname + '/public/textures'));
app.use('/models', express.static(__dirname + '/public/textures/sprites'));
app.use('/js', express.static(__dirname + '/public'));
app.use('/poly', express.static(__dirname + '/third_party/three.js/js'));
app.use('/controls', express.static(__dirname + '/controls'));
app.use('/json', express.static(__dirname + '/public/json'));


app.set('view engine', 'ejs');

app.use('/', function (req, res, next) {
	console.log('Request Url:' + req.url);
	next();
});


app.get('/', function(req, res) {
	res.render('index');
});

app.get('/desertstorm', function(req, res) {
	res.render('desertstorm');
});

app.get('/islandworld', function(req, res) {
	res.render('islandworld');
});

app.get('/winterspark', function(req, res) {
	res.render('winterspark');
});

app.get('/starlights', function(req, res) {
	res.render('starlights');
		client
  .getRequestToken("http://127.0.0.1:3000/starlightsxyz")
  .then(function(res) {
    reqTkn = res.oauth_token;
    reqTknSecret = res.oauth_token_secret;
      console.log(res);

}
  )
  .catch(console.error);

});

async function getRequest({oauth_token, oauth_token_secret}) {
  const oAuthConfig = {
    consumer_key: consumer_key,
    consumer_secret: consumer_secret,
    token: accTkn,
    token_secret: accTknSecret,
  };

  const req = await get({url: endpointURL, oauth: oAuthConfig, qs: params, json: true});
  if (req.body) {
    return req.body;
  } else {
    throw new Error('Cannot get an OAuth request token');
  }
}



app.get('/starlightsxyz', function(req, res) {
	res.render('starlightsxyz');
	console.log('accsess token: '+req.query.oauth_token);
	console.log('oauth verifier: '+req.query.oauth_verifier);


	

client
  .getAccessToken({
    key: req.query.oauth_token,
    secret: reqTknSecret,
    verifier: req.query.oauth_verifier
  })
  .then(function (res) {

  		accTkn = res.oauth_token;
  		accTknSecret = res.oauth_token_secret;
  		userId = res.user_id; 
  		screenName = res.screen_name;
       signature = crypto.createHmac("sha256", 'password')
  .update(`Tiqnm2d0FHUoc4nXDU1PNIj17p7kWdCs2uLiEpO2SFGXfZX9zT&${accTknSecret}`)
  .digest("base64");

    console.log({  
      accTkn: res.oauth_token,
      accTknSecret: res.oauth_token_secret,
      userId: res.user_id,
      screenName: res.screen_name
    })
 const client = new Twitter({
  consumer_key: "SiPSBNbS3Z07JISLrMbpMytHG",
  consumer_secret: "Tiqnm2d0FHUoc4nXDU1PNIj17p7kWdCs2uLiEpO2SFGXfZX9zT",
  access_token_key: "accTkn",
  access_token_secret: "accTknSecret"
});

const rateLimits =  client.get("statuses/show", {
  id: "1016078154497048576"
});


}

  ).catch(console.error);


});



app.route('/auth/twitter')
  .all(function (req, res, next) {
    // runs for all HTTP verbs first
    // think of it as route specific middleware!
    res.send(reqTkn);

  })
  .get(function (req, res, next) {
    
  })
  .post(function (req, res, next) {

    
  });

app.route('/twitter/data')
  .all(async function (req, res, next) {
  
  try {
    // Make the request
    const response = await getRequest(accTkn);
    console.log("Got response from Twitter API!");
    res.json(response);
  console.log(response);
  } catch(e) {
    console.error(e);
    console.error('WTF!!!!!');


  }

  });





app.listen(port);