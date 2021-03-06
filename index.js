// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var S3Adapter = require('parse-server-s3-adapter');

var s3Options = new S3Adapter(
  process.env.S3_ACCESS_KEY,
  process.env.S3_SECRET_KEY,
  process.env.S3_BUCKET,
  {"region": process.env.S3_REGION, // default value
  "directAccess": true // Setting this to true allows direct downloads
  }
);


var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'myAppId',
  masterKey: process.env.MASTER_KEY || '', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',  // Don't forget to change to https if needed
  publicServerURL: process.env.PUBLIC_SERVER_URL || 'http://localhost:1337/parse',  // Don't forget to change to https if needed
  appName: process.env.APP_NAME,
  filesAdapter: s3Options,
  fileKey: process.env.FILE_KEY,
  push: {
    android: {
      senderId: process.env.ANDROID_PUSH_SENDER_ID || '',
      apiKey: process.env.ANDROID_PUSH_API_KEY || ''
    },
      ios: [
      {
        pfx:'FitProdPush.p12',
        bundleId: 'com.FitLivinLLC.FitLivin',
        production: true
      },
      {
        pfx:'FitLivinDev.p12',
        bundleId: 'com.FitLivinLLC.FitLivin',
        production: false
      }
    ]},
  auth: {
   twitter: {
     consumer_key: process.env.TWITTER_CONSUMER_KEY || '',
     consumer_secret: process.env.TWITTER_CONSUMER_SECRET || ''
   }
  },
  emailAdapter: {
    module: 'parse-server-simple-mailgun-adapter',
    options: {
      // The address that your emails come from
      fromAddress: process.env.MG_FROM_ADDRESS || 'support@elevenfiftyconsulting.com',
      // Your domain from mailgun.com
      domain: process.env.MG_DOMAIN || 'mg.elevenfiftyconsulting.com',
      // Your API key from mailgun.com
      apiKey: process.env.MG_API_KEY || '',
    },
  }
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('I dream of being a website.  Please star the parse-server repo on GitHub!');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
// ParseServer.createLiveQueryServer(httpServer);
