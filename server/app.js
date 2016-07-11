
'use strict';

/// Set default node environment to development; Bluemix runtime is production
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var cloudantUtil = require('./lib/cloudantUtil');
var config = require('./config/environment');

// cloudantUtil.init();
// Setup server
var app = express();
var server = require('http').createServer(app);
var cloudant;
var http = require('http');
var querystring = require('querystring');
var db;
// bootstrap bluemix
var host = (process.env.VCAP_APP_HOST || 'localhost');
var port = (process.env.VCAP_APP_PORT || 9000);

if (host !== 'localhost') app.set('env', 'production');

//require('./config/express')(app);
//require('./routes')(app);


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
         //clsconsole.warn('VCAP_SERVICES environment variable not set - data will be unavailable to the UI');
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
initDBConnection();



 //sso start
 var cookieParser = require('cookie-parser');
 var session = require('express-session');
 var passport = require('passport');

 app.use(cookieParser());
 app.use(session({resave: 'true', saveUninitialized: 'true' , secret: 'keyboard cat'}));
 app.use(passport.initialize());
 app.use(passport.session());
 app.use(session());
 app.use(ensureAuthenticated);

 passport.serializeUser(function(user, done) {
 done(null, user);
 });

 passport.deserializeUser(function(obj, done) {
 done(null, obj);
 });


 var services = JSON.parse(process.env.VCAP_SERVICES || "{}");
 var ssoConfig = services.SingleSignOn[0];
 var client_id = ssoConfig.credentials.clientId;
 var client_secret = ssoConfig.credentials.secret;
 var authorization_url = ssoConfig.credentials.authorizationEndpointUrl;
 var token_url = ssoConfig.credentials.tokenEndpointUrl;
 var issuer_id = ssoConfig.credentials.issuerIdentifier;
 var callback_url = "http://devmsp.mybluemix.net/auth/sso/callback";

 console.log("sso config : " + ssoConfig);
 console.log("client_id : " + client_id);
 console.log("authorization_url : " + authorization_url);
 console.log("token_url : " + token_url);
 console.log("issuer_id : " + issuer_id);
 console.log("callback_url : " + callback_url);

 var OpenIDConnectStrategy = require('passport-idaas-openidconnect').IDaaSOIDCStrategy;
 var Strategy = new OpenIDConnectStrategy({
 authorizationURL : authorization_url,
 tokenURL : token_url,
 clientID : client_id,
 scope: 'openid',
 response_type: 'code',
 clientSecret : client_secret,
 callbackURL : callback_url,
 skipUserProfile: true,
 issuer: issuer_id},
 function(iss, sub, profile, accessToken, refreshToken, params, done)  {
 process.nextTick(function() {
 profile.accessToken = accessToken;
 profile.refreshToken = refreshToken;
 done(null, profile);
 })
 });

 passport.use(Strategy);
 app.get('/login', passport.authenticate('openidconnect', {
 // successRedirect: redirect_url,
 //failureRedirect: "/failure",

 }));
 function ensureAuthenticatedold(req, res, next) {
 if(!req.isAuthenticated()) {

 req.session.originalUrl = req.originalUrl;
 res.redirect('/login');

 } else {
 return next();
 }
 }


 function ensureAuthenticated(req, res, next) {
 console.log("----------------------------------------------------------------------------");
 console.log(" *** ensureAuthenticated *** ");
 console.log(" *** req.isAuthenticated() *** " + req.isAuthenticated());
 console.log(" *** req.path.indexOf('/login') *** " + req.path.indexOf('/login'));
 console.log(" *** req.path.indexOf('/auth') *** " + req.path.indexOf('/auth'));
 console.log(" *** req.originalUrl *** " + req);
 console.log(" *** req.path.indexOf('/') *** " + req.path.indexOf('/'));
 console.log(" *** req.originalUrl ***" + req.originalUrl);
 console.log(" *** req.baseUrl ***" + req.baseUrl);
 console.log(" *** req.path ***" + req.path);


 if(!req.isAuthenticated() && !req.path.indexOf('/login') == 0 && !req.path.indexOf('/auth') == 0)
 {

 console.log(" redirecting for authentication *** ");
 req.session.originalUrl = req.originalUrl;
 console.log(" *** req.session.originalUr *** " + req.session.originalUrl);
 res.redirect('/login');
 console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@outside redirect");
 }
 else
 {
 console.log("Authenticated");
 return next();
 }
 }


var redirect_url;
var sessionData;

 app.get("/auth/sso/callback",function(req,res,next) {
 console.log(" !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! /auth/sso/callback *** ");
 ///console.log(redirect_url);
 require('./config/express')(app);
 require('./routes')(app);
 redirect_url = req.session.originalUrl;
 console.log(redirect_url);
 //var redirect_url2="https://msp-portal.mybluemix.net";
 //console.log("Request : " + req.originalUrl);
 //console.log("Request 1: " + req);
 console.log("redirect_url 1: " + redirect_url);
 //console.log("Request 2: " + JSON.parse(req));
 //var redirect_url = req.originalUrl;
 passport.authenticate('openidconnect', {
 successRedirect: "/success",
 failureRedirect: "/failure",
 })(req,res,next);
 });
 
app.get('/success',ensureAuthenticated,function(request,response){
    response.redirect(redirect_url);
    sessionData=request.session;
    console.log('Session data-->'+JSON.stringify(sessionData));
    console.log(JSON.stringify(request.user));
    response.write(JSON.stringify(request.user));
    response.end();
});

 app.get('/failure', function(req, res) {
 console.log(" *** /failure *** ");
 res.send('login failed'); });
 
 app.get('/api/thing',function(request,response){
 	//sessionData=request.session;
 	console.log('Session Data-->'+JSON.stringify(sessionData));
    response.send(JSON.stringify(sessionData));
    response.end();
}); 

 //sso end


 // single sign on ends here

 //sso ends here


// Start server
app.listen(port, host);
console.log('App started on port ' + port);

// Expose app
exports = module.exports = app;
