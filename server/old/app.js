/**
 * Main application file
 */

'use strict';

//old code--->

//process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var cloudantUtil = require('./lib/cloudantUtil');
var config = require('./config/environment');

////old--->

// Set default node environment to development; Bluemix runtime is production
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
//santhosh new code--->
var express = require('express'), http = require('http'), routes = require('./routes'), user = require('./routes/user'), http = require('http'), path = require('path'), fs = require('fs');
var querystring = require('querystring');
var app = express();
var qs = require('querystring');
var db;

var cloudant;
var fileToUpload;

var cloudantUtil = require('./lib/cloudantUtil');
var config = require('./config/environment');

// cloudantUtil.init();

// Setup server

var server = require('http').createServer(app);

// bootstrap bluemix
var host = (process.env.VCAP_APP_HOST || 'localhost');
var port = (process.env.VCAP_APP_PORT || 9000);

if (host !== 'localhost') app.set('env', 'production');

require('./config/express')(app);
require('./routes')(app);
//santhos new code----->
var dbCredentials = {
    dbComponents : 'components',
    dbBlueprints : 'blueprint',
    dbSolution : 'solutions',
    dbTmpMidComponent : 'tmp_midcomponent',
    dbTmpBluemix : 'tmp_bluemixdb',
    dbTmpBluemixProp : 'tmp_bluemixpropdb',
    dbMsp : 'msp',
    dbuser : 'userdb',
    dbBluemix_services : 'bluemixdb',
    dbBluemix_buildpack : 'bluemix_buildpack',
    dbFinalJson: 'final_json_order'
};
var solution = require('./api/solution');
var bluemixjs = require('./api/bluemix');
var mspjs = require('./api/msp');
var v2_solution=require('./api/v2/solution');
var v2_bluemixjs = require('./api/v2/bluemix');
var v2_mspjs = require('./api/v2/msp');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

// all environments
app.set('port', process.env.PORT || 9000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended : true
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/style', express.static(path.join(__dirname, '/views/style')));

// To allow Cross Origin Resource Sharing
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods','POST, GET, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Credentials', 'true');
    return next();
});

// development only
if ('development' == app.get('env')) {
    app.use(errorHandler());
}

function initDBConnection() {

    if (process.env.VCAP_SERVICES) {
        var vcapServices = JSON.parse(process.env.VCAP_SERVICES);
        // Pattern match to find the first instance of a Cloudant service in
        // VCAP_SERVICES. If you know your service key, you can access the
        // service credentials directly by using the vcapServices object.
        for ( var vcapService in vcapServices) {
            if (vcapService.match(/cloudant/i)) {
                dbCredentials.host = vcapServices[vcapService][0].credentials.host;
                dbCredentials.port = vcapServices[vcapService][0].credentials.port;
                dbCredentials.user = vcapServices[vcapService][0].credentials.username;
                dbCredentials.password = vcapServices[vcapService][0].credentials.password;
                dbCredentials.url = vcapServices[vcapService][0].credentials.url;

                cloudant = require('cloudant')(dbCredentials.url);

                // check if DB exists if not create
                cloudant.db.create(dbCredentials.dbComponents, function(err,
                                                                        res) {
                    if (err) {
                        console.log('could not create db ', err);
                    }
                });

                db = cloudant.use(dbCredentials.dbComponents);
                break;
            }
        }
        if (db == null) {
            console
                .warn('Could not find Cloudant credentials in VCAP_SERVICES environment variable - data will be unavailable to the UI');
        }
    } else {
        console
            .warn('VCAP_SERVICES environment variable not set - data will be unavailable to the UI');
        // For running this app locally you can get your Cloudant credentials
        // from Bluemix (VCAP_SERVICES in "cf env" output or the Environment
        // Variables section for an app in the Bluemix console dashboard).
        // Alternately you could point to a local database here instead of a
        // Bluemix service.
        // dbCredentials.host = "REPLACE ME";
        // dbCredentials.port = REPLACE ME;
        // dbCredentials.user = "REPLACE ME";
        // dbCredentials.password = "REPLACE ME";
        // dbCredentials.url = "REPLACE ME";

        dbCredentials.host = "25064b88-10f3-4362-8343-ef934099c077-bluemix.cloudant.com";// vcapServices[vcapService][0].credentials.host;
        dbCredentials.port = "443";// vcapServices[vcapService][0].credentials.port;
        dbCredentials.user = "25064b88-10f3-4362-8343-ef934099c077-bluemix";// vcapServices[vcapService][0].credentials.username;
        dbCredentials.password = "2da94111ea872c6a1e1ea36b91a3f078ad3a581e1249f21615bc83a953bfaabc";// vcapServices[vcapService][0].credentials.password;
        dbCredentials.url = "https://25064b88-10f3-4362-8343-ef934099c077-bluemix:2da94111ea872c6a1e1ea36b91a3f078ad3a581e1249f21615bc83a953bfaabc@25064b88-10f3-4362-8343-ef934099c077-bluemix.cloudant.com";// vcapServices[vcapService][0].credentials.url;

        cloudant = require('cloudant')(dbCredentials.url);
        console.log("cloudant instance");

        console.warn('local settings completed');
    }
}


// Initiating Database connection function
//initDBConnection();
//santhosh new code---->
app.get('/', routes.index);

var requestMessage = "*** Message Received ***";
var responseMessage = "*** Message Responded ***";

function defaultMessage() {
    var message = {
        "message" : "Sorry for inconvenience! We are feeding data at this moment!"
    };
}

http.createServer(app).listen(app.get('port'), '0.0.0.0', function() {
    console.log('Express server listening on port ' + app.get('port'));
});

var success_response = {
    "status" : "success"
};

var failure_response = {
    "status" : "failed",
    "description" : ""
};





// Original Start server
//server.listen(config.port, config.ip, function () {
//  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
//});

/*// Start server
app.listen(port, host);
console.log('App started on port ' + port);

// Expose app
exports = module.exports = app;*/
