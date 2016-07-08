/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');
var solution = require('./api/solution');
var bluemixjs = require('./api/bluemix');
var mspjs = require('./api/msp');


module.exports = function(app) {

/*  // Insert routes below


//sso starts here


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

// VCAP_SERVICES contains all the credentials of services bound to
// this application. For details of its content, please refer to
// the document or sample of each service.
  var services = JSON.parse(process.env.VCAP_SERVICES || "{}");
  var ssoConfig = services.SingleSignOn[0];
  var client_id = ssoConfig.credentials.clientId;
  var client_secret = ssoConfig.credentials.secret;
  var authorization_url = ssoConfig.credentials.authorizationEndpointUrl;
  var token_url = ssoConfig.credentials.tokenEndpointUrl;
  var issuer_id = ssoConfig.credentials.issuerIdentifier;
  var callback_url = "http://devmsp.mybluemix.net/net/auth/sso/callback";

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
  /!*
   app.get('/home',  function(req, res) {
   res.redirect('http://msp-portal.mybluemix.net/#/');
   });

   // app.get('/',  function(req, res) {
   //   res.redirect('http://msp-portal.mybluemix.net/home');
   // });

   app.get('/home2',  function(req, res) {
   res.redirect('http://msp-portal.mybluemix.net');
   });*!/

  /!*app.get('/',function(req,  res){
   console.log("I am hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
   require('./config/express')(app);
   require('./routes')(app);


   app.set('views', config.root + '/server/views');
   app.engine('html', require('ejs').renderFile);
   app.set('view engine', 'html');
   app.use(compression());
   app.use(bodyParser.urlencoded({ extended: false }));
   app.use(bodyParser.json());
   app.use(methodOverride());
   app.use(cookieParser());


   app.use(require('connect-livereload')());
   app.use(express.static(path.join(config.root, '.tmp')));
   app.use(express.static(path.join(config.root, 'public')));
   app.set('appPath', path.join(config.root, 'public'));
   app.use(morgan('dev'));
   app.use(errorHandler()); // Error handler - has to be last
   console.log("redirectinggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg");
   //var api=require('/app/app');
   res.redirect('/');
   //var redirect_url="http://msp-portal.mybluemix.net";
   });
   *!/
  /!*
   app.get('/#/',function(req,  res){
   console.log(" In root# tag");
   res.redirect('http://msp-portal.mybluemix.net/#/login');
   });

   app.get('/',function(req,  res){
   console.log(" In root tag");
   res.redirect('http://msp-portal.mybluemix.net/#/login');
   });*!/
//app.get('/',routes.index);

//var redirect_url="https://msp-portal.mybluemix.net";





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
    //if(!req.isAuthenticated())
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



  app.get("/auth/sso/callback",function(req,res,next) {
    console.log(" !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! /auth/sso/callback *** ");
    console.log(redirect_url);
    require('./config/express')(app);
    require('./routes')(app);
    var redirect_url = req.session.originalUrl;
    console.log(redirect_url);
    var redirect_url2="https://msp-portal.mybluemix.net";
    console.log("Request : " + req.originalUrl);
    console.log("Request 1: " + req);
    console.log("redirect_url 1: " + redirect_url);
    //console.log("Request 2: " + JSON.parse(req));
    //var redirect_url = req.originalUrl;
    passport.authenticate('openidconnect', {
      successRedirect: redirect_url,
      failureRedirect: "/failure",
    })(req,res,next);
  });

  app.get('/failure', function(req, res) {
    console.log(" *** /failure *** ");
    res.send('login failed'); });



//
//app.get('/',  function(request, response) {
//  console.log(" *** /success *** ");
//   response.send('Hello');
// });



//sso end


// single sign on ends here

//sso ends here*/


// ************************************************************************************************************************************************
// This API creates an empty document in solution database when canvas
// initiated.
  app.post('/api/createSolution',solution.createSolution);


//API to create a new structure in database.
  app.post('/api/v1/creatHybridSolution',solution.creatHybridSolution);


//API to create a new structure in database.
  app.post('/api/v1/creatMpsSolution',solution.creatMpsSolution);


// ************************************************************************************************************************************************
// This API will update the solution database whenever the user add component in
// the deployment architecture


//old one
  app.put('/api/AddComponentToCanvas', solution.AddComponentToCanvas);

// ************************************************************************************************************************************************
// This V1 API will update the solution database whenever the user add component
// in the deployment architecture
  app.put('/api/v1/AddComponentToCanvas', solution.v1_AddComponentToCanvas);

// ************************************************************************************************************************************************
// This API will update the solution database whenever the user add bluemix
// component in the deployment architecture
  app.put('/api/AddBMComponentToCanvas', bluemixjs.AddBMComponentToCanvas);





// ************************************************************************************************************************************************
// This V1 API will update the solution database whenever the user add bluemix
// component in the deployment architecture
  app.put('/api/v1/AddBMComponentToCanvas', bluemixjs.v1_AddComponentToCanvas);

// ************************************************************************************************************************************************
// This API will update the solution database whenever the user add bluemix
// component in the deployment architecture
  app.put('/api/AddBMRuntimeToCanvas',bluemixjs.AddBMRuntimeToCanvas);

// ************************************************************************************************************************************************
// This v1 API will update the solution database whenever the user add bluemix
// component in the deployment architecture
  app.put('/api/v1/AddBMRuntimeToCanvas',bluemixjs.v1_AddBMRuntimeToCanvas);

// ************************************************************************************************************************************************
// This API will fetch msp service info of component.
  app.put('/api/getServiceInfo', solution.getServiceInfo);




// ************************************************************************************************************************************************
// This API will fetch msp service info of component.

//currently done, need to check
  app.put('/api/v1/getServiceInfo',mspjs.getServiceInfo);


// ************************************************************************************************************************************************
// This API will fetch service info of component.
  app.put('/api/getBluemixServiceInfo',bluemixjs.getBluemixServiceInfo);

// ************************************************************************************************************************************************
// This V1 API will fetch service info of component.
//currently doing...
  app.put('/api/v1/getBluemixServiceInfo',bluemixjs.v1_getBluemixServiceInfo);

// ************************************************************************************************************************************************
// This API will fetch service info of component.
  app.put('/api/getBluemixRuntimeInfo',bluemixjs.getBluemixRuntimeInfo);

// ************************************************************************************************************************************************
// This V1 API will fetch service info of component.
//currently doing...
  app.put('/api/v1/getBluemixRuntimeInfo',bluemixjs.v1_getBluemixRuntimeInfo);

// ************************************************************************************************************************************************
// This API will update msp service info of component in solution table.
  app.put('/api/updateServiceInfo',mspjs.updateServiceInfo);

// ************************************************************************************************************************************************
// This V1 API will update service info of component in solution table.
  app.put('/api/v1/updateServiceInfo',mspjs.v1_updateServiceInfo);

// ************************************************************************************************************************************************
// This API will update service info of component in solution table.
  app.put('/api/updateBMServiceInfo',bluemixjs.updateBMServiceInfo);

// ************************************************************************************************************************************************
// This API will update runtime info of bluemix runtime in solution table.
  app.put('/api/updateBMRuntimeInfo',bluemixjs.updateBMRuntimeInfo);

// Now this is splitted into two - 1. canvas update , 2 connection update.
// Please refer code below
// ************************************************************************************************************************************************
// This API will update canvas info in solution table. now implemented only for
// canvas update. connection info we have to think
  app.put('/api/updateCanvasConnectionInfo',solution.updateCanvasConnectionInfo);

// ************************************************************************************************************************************************
// This API will update canvas info in solution table. now implemented only for
// canvas update.
  app.put('/api/updateCanvasInfo',solution.updateCanvasInfo);


// ************************************************************************************************************************************************
// This API will update MSP connection info in solution table.
  app.put('/api/updateMspConnectionInfo',mspjs.updateMspConnectionInfo);
  app.put('/api/updateMspConnectionInfo',mspjs.updateMspConnectionInfo);

// ************************************************************************************************************************************************
// This API will update Bluemix connection info in solution table.
  app.put('/api/updateBMConnectionInfo',bluemixjs.updateBMConnectionInfo);

// This v1 API fetches all components added in canvas along with price details
// to view bill of material
  app.get('/api/v1/viewBillofMaterial', solution.v1_viewBillOfMaterial);

// This v1 API fetches all components added in canvas along with price details
// to view bill of material
  app.get('/api/v1/viewMspBillofMaterial',solution.viewMspBillofMaterial);

// This API fetches all components added in canvas along with price details to
// view bill of material
  app.get('/api/viewBillofMaterial',solution.viewBillofMaterial);

// This API will fetch all the solution which are created by the user.
  app.get('/api/viewMyDeployArch', solution.viewMyDeployArch);
// ************************************************************************************************************************************************
// This API will update the solution database whenever the user remove component
// in the deployment architecture
  app.put('/api/removeComponentFromSolutiondb',solution.removeComponentFromSolutiondb);

// ************************************************************************************************************************************************
// This API will update the solution database whenever the user remove entire the deployment architecture
  app.post('/api/deleteSolution',solution.deleteSolution);


  app.get('/api/getBluemixComponentlist', bluemixjs.getBluemixComponentlist);

  app.get('/api/getBluemixComponentlists', bluemixjs.getBluemixComponentLists);

  app.get('/api/v1/getBluemixComponentlists', bluemixjs.getBluemixComponentlists);


  app.post('/api/getBluemixComponentProperties',bluemixjs.getBluemixComponentProperties);

// This is in active for getting MSP services for catalog
  app.get('/api/getMspComponentlists', mspjs.getMspComponentlists);

  app.post('/api/v1/getBluemixComponentProperties',bluemixjs.v1_getBluemixComponentProperties);

// Need to edit. jst added v1.
  app.get('/api/v1/getMspComponentlists', mspjs.getMspComponentLists);



// This is fetch the data those are hardcoded in our DB
  app.get('/api/getMspComponentlist',mspjs.getMspComponentlist);


  app.post('/api/getComponentPrice',mspjs.getComponentPrice);


  app.post('/api/v1/getComponentPrice',mspjs.v1_getComponentPrice);


  app.get('/api/getMspOfferings', mspjs.getMspOfferings);

  app.post('/api/login',  solution.login);




  app.post('/api/getbluemixtoken',bluemixjs.getbluemixtoken);


// This API is to fetch bluemix services and insert into cloudant.
  app.get('/api/getBluemixServices', bluemixjs.getBluemixServices);
// This API provides to UI with list of services provided by bluemix along with
// a static icon.
  app.get('/api/getBluemixServicesList', bluemixjs.getBluemixServicesList);

// This API provides to UI with list of services provided by bluemix along with
// a static icon.
  app.get('/api/getBluemixBuildpackList', bluemixjs.getBluemixBuildpackList);

// API to fetch bluemic token -- provided by Aravind
  app.get('/api/getbluemixtoken',bluemixjs.getbluemixtoken);

// This API is to fetch properties of each component and update in database.
  app.post('/api/getbluemixServicesproperties',bluemixjs.getbluemixServicesproperties);


  app.post('/api/placeOrder',solution.placeOrder);

  app.post('/api/v1/placeOrder',solution.v1_placeOrder);


  app.post('/api/getCanvasInfo',solution.getCanvasInfo);




  app.post('/api/getRuntimePrice',bluemixjs.getRuntimePrice);




  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
      .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
      .get(function(req, res) {
        res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
      });
};
