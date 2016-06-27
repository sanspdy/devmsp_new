/**
 * Created by tangross on 15/8/15.
 */
'use restrict'

var config = require('../config/environment/development');
var Cloudant = require('cloudant');
var fs = require('fs');

// var dbName = config.ROOT_DB,
//     chost = "25064b88-10f3-4362-8343-ef934099c077-bluemix.cloudant.com",
//     cport = config.CPORT,
//     cuser = config.CUSER,
//     cpassword = config.CPASSWORD,
//     curl = config.CURL,
//     rootDoc = config.ROOT_DOC,
//     dbNameDeal = config.ROOT_DB_DEAL;

var db,
    cloudantConn;


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

exports.init = function() {

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


exports.connectToDB = function (dbName, rootDocName) {
  db = cloudantConn.db.use(dbName);
  console.log("db in util " + db);
  rootDoc = rootDocName;
};

function handleError(res, err) {
    return res.status(500).send(err);
}

exports.initRefdataDB = function(callbackFn) {
  var dbName = "ref_data";

  console.log("#### Seeding DB: Creating database. " + dbName + "...");
  cloudantConn.db.create(dbName, function (err) {
      if (err) {
        console.log(err);
        //return callbackFn(err,null);
      }

      console.log("#### Seeding DB: Inserting root document.");
      db = cloudantConn.db.use(dbName);
      fs.readFile(__dirname + '/seed_refdata.json', 'utf8', function (err, data) {
        if (err) {
          console.log(err);
          return callbackFn(err,null);
        }

        var docs = JSON.parse(data);
        //var i;
        //for(i = 0; i < docs.length; i++) {
          db.insert(docs, function (err) {
            if (err) {
              console.log(err);
              return callbackFn(err,null);
            }
            console.log("Insertion completion for " + dbName);
            return callbackFn(null,docs);
          });
        //}
      })
    });
};

