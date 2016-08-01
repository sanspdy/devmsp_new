/**
 * Created by Santhosh on 6/21/2016.
 */


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
var cloudant;
var querystring = require('querystring');
var db;
var http = require('http');
var requestMessage = "*** Message Received ***";
var responseMessage = "*** Message Responded ***";
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
initDBConnection();
var success_response = {
    "status" : "success"
};

var failure_response = {
    "status" : "failed",
    "description" : ""
};







exports.getMspComponentLists = function(reqst, response) {
    console.log("*** Request Received ***");
    var http = require('http');
    try {
        // This has to be enabled when IMI team create services with all
        // parameters.
        var data = JSON.stringify({
            "category" : "Components"
        });
        var extracted_title = [];
        var result = "";
        // This should moved to cloudant and make it parameterised
        var options = {
            host : '5.10.122.180',
            port : 9092,
            path : '/CBSMSP/rest/catalog/fetch',
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',
                'Content-Length' : data.length

            },
            // rejectUnauthorized: false,
            // requestCert: true,
            // agent: false
        };

        var req = http.request(options, function(res) {
            // res.setEncoding('utf8');
            res.on('data', function(chunk) {
                console.log(data);
                console.log(options);
                console.log("body: " + chunk);
                result += chunk;
                console.log("******************** Result ******************");
                console.log(result);

            });
            res.on('end',function(){

                console.log("*** Request Responded ***");
                lengthofresult = result.length;
                console.log(lengthofresult);

                console.log(result);
                response.write(result);
                response.end();
            });
        });
        req.on('error',function(err,result) {
            console.log(err);
            console.log("Error while fetching data from IMI Server. Please try later");
            failure_response.description = "Error while fetching data from IMI Server. Please try later"
            response.write(JSON.stringify(failure_response));
            response.end();
        });

        req.write(data);

        req.end();


    } catch (err) {
        console.log("There is some error:")
        console.log(err.stack);
        console.log("*** Request Responded ***");
        var resjson = {
            "status" : "failed"
        };
        response.write(JSON.stringify(resjson));
    }

}









exports.v2_updateServiceInfo=function(request, response) {
    console.log("updateServiceInfo : " + requestMessage);
    console.log("*************************************************************************")
    console.log("Request message: " + "updateServiceInfo : "+ request);
    var dbSoln = cloudant.use(dbCredentials.dbSolution);

    var username = request.body.uname;
    var SolName = request.body.solnName;
    var version=parseInt(request.body.version);
    // console.log(request.body);
    // var service_det=request.body.service_details;
    var service_name = request.body.service_name;
    var compcnt = request.body.component_cnt;
    var solution_json = JSON.parse(request.body.solnjson);

    console.log("Request from solution info: "+ "updateServiceInfo : "+ JSON.stringify(solution_json));

    if (username === null || username === '') {
        console.log("There is no username in body");
        failure_response.description = "There is no username in body"
        response.write(JSON.stringify(failure_response));
        response.end();
    } else if (SolName === null || SolName === '' || version === null || version=== '') {
        console.log("There is no SolName & version  in body");
        failure_response.description = "There is no SolName  & version in body"
        response.write(JSON.stringify(failure_response));
        response.end();
    } else if (service_name === null || service_name === '') {
        console.log("There is no data in service_name");
        failure_response.description = "There is no service_name in body"
        response.write(JSON.stringify(failure_response));
        response.end();
    } else if (compcnt === null || compcnt === '') {
        console.log("There is no compcnt in body");
        failure_response.description = "There is no compcnt in body"
        response.write(JSON.stringify(failure_response));
        response.end();
    } else if (solution_json == null) {
        console.log("There is no solution_json in body");
        failure_response.description = "There is no solution_json in body"
        response.write(JSON.stringify(failure_response));
        response.end();
    }

    else {
        updateserviceinfo();
    }

    function updateserviceinfo(){
        try {
            dbSoln.find({selector : {solution_name: SolName, user: username, version:version}},function(err, result) {
                console.log("updateServiceInfo : fetch exact record from dB "+ JSON.stringify(result));
                if (!err) {

                    if( result.docs !== null && result.docs !== undefined && result.docs[0] !== null && result.docs[0] !== undefined && result.docs[0].hasOwnProperty("service_details")) {
                        if (result.docs[0].service_details.hasOwnProperty("msp")) {
                            if (result.docs[0].service_details.msp !== null && result.docs[0].service_details.msp !== undefined && result.docs[0].service_details.msp[compcnt]!== null && result.docs[0].service_details.msp[compcnt]!== undefined ) {

                                result.docs[0].service_details.msp[compcnt] = solution_json;
                                dbSoln.insert(result.docs[0],function(err2,result2) {
                                    if (err2) {
                                        console.log("updateServiceInfo : "+ "Error while inserting : "+ err2);
                                        console.log("Error while inserting data. Please try again");
                                        failure_response.description = "Error while inserting data. Please try again";
                                        response.write(JSON.stringify(failure_response));
                                        response.end();
                                    } else {
                                        console.log("updateServiceInfo : "+ "New doc created ..");
                                        console.log("updateServiceInfo : "+ "*** Request Responded ***");
                                        response.write(JSON.stringify(success_response));
                                        console.log(responseMessage);
                                        response.end();
                                    }
                                });
                            }else{
                                console.log("There is some error in Solution. It has no value in MSP");
                                failure_response.description = "There is some error in Solution. It has no value in MSP";
                                response.write(JSON.stringify(failure_response));
                                response.end();
                            }
                        }
                        else{
                            console.log("There is some error in Solution. It has no property called MSP");
                            failure_response.description = "There is some error in Solution. It has no property called MSP";
                            response.write(JSON.stringify(failure_response));
                            response.end();
                        }

                    }
                    else{
                        console.log("There is no property called service details");
                        failure_response.description = "There is no property called service details";
                        response.write(JSON.stringify(failure_response));
                        response.end();
                    }

                    // console.log(services);
                    // response.write(JSON.stringify(services));
                    // response.end();
                } else {
                    var errMessage = "Error occurred while accessing components : \n"
                        + JSON
                            .stringify(err);
                    response.write(errMessage);
                    console.log(errMessage);
                    response.end();
                    console
                        .log(responseMessage);
                    setTimeout(
                        function() {
                            console
                                .log("*** Request Responded ***");
                            response
                                .write("{status: failed}");
                            response.end();
                        }, 1000);
                }
            });
        } catch (err) {
            console.log("There is some error:")
            console.log(err.stack);
            console.log("*** Request Responded ***");
            var resjson = {
                "status" : "failed"
            };
            response.write(JSON.stringify(resjson));
        }
    }
}



exports.v2_getServiceInfo=function (request, response) {

    console.log(requestMessage);
    console.log("*************************************************************************")
    var dbSoln = cloudant.use(dbCredentials.dbSolution);

    if(request.body == null) {
        console.log("There is no data in body");
        failure_response.description = "There is no data in body"
        response.write(JSON.stringify(failure_response));
        response.end();
    }
    else if(request.body.hasOwnProperty("uname") && request.body.hasOwnProperty("solnName") && request.body.hasOwnProperty("service_details") && request.body.hasOwnProperty("service_name")  && request.body.hasOwnProperty("component_cnt")) {

        var username = request.body.uname;
        var SolName = request.body.solnName;
        var version=parseInt(request.body.version);
        console.log(request.body);
        var service_det = request.body.service_details;
        var service_name = request.body.service_name;
        var compcnt = request.body.component_cnt;

        if (username === null || username === '') {
            console.log("There is no username in body");
            failure_response.description = "There is no username in body"
            response.write(JSON.stringify(failure_response));
            response.end();
        } else if (SolName === null || SolName === '') {
            console.log("There is no SolName in body");
            failure_response.description = "There is no SolName in body"
            response.write(JSON.stringify(failure_response));
            response.end();
        } else if (service_name === null || service_name === '') {
            console.log("There is no data in service_name");
            failure_response.description = "There is no service_name in body"
            response.write(JSON.stringify(failure_response));
            response.end();
        } else if (compcnt === null || compcnt === '') {
            console.log("There is no compcnt in body");
            failure_response.description = "There is no compcnt" +
                " in body"
            response.write(JSON.stringify(failure_response));
            response.end();
        }
        else {
            getserviceinfo();
        }
    }
    else{
        console.log("There is no username, solution name, servicename, component count defined in JSON in body");
        failure_response.description="There is no username, solution name, servicename, component count defined in JSON in body"
        response.write(JSON.stringify(failure_response));
        response.end();
    }


    function getserviceinfo() {
        try {
            if (service_det == "msp") {
                dbSoln.find({selector: {solution_name: SolName, user: username, version:version}}, function (err, result) {
                    if (!err) {
                        console.log(result);
                        if (result.docs[0] == null) {
                            console.log("There is no data in result");
                            failure_response.description = "There is no data in result. Please check solution name"
                            response.write(JSON.stringify(failure_response));
                            response.end();
                        } else if (result.docs[0].service_details.msp.length <= compcnt) {
                            console.log("less value in result and u requested impossible value");
                            failure_response.description = "less value in result and u requested impossible value"
                            response.write(JSON.stringify(failure_response));
                            response.end();
                        } else {
                            if(result.docs !== null || result.docs !==undefined){
                                if(result.docs[0].hasOwnProperty("service_details") !== undefined || result.docs[0].service_details !== null) {
                                    if (result.docs[0].hasOwnProperty("msp") !== undefined) {
                                        if(result.docs[0].service_details.msp[compcnt] !== null){
                                            var services = result.docs[0].service_details.msp[compcnt];
                                            var nameofservice = result.docs[0].service_details.msp[compcnt].catalog_name;
                                            if (nameofservice == service_name) {
                                                console.log(services);
                                                response.write(JSON.stringify(services));
                                                response.end();
                                            } else {
                                                console.log("Service name in the requested component count is not matching");
                                                failure_response.description = "Service name in the requested component count is not matching";
                                                response.write(JSON.stringify(failure_response));
                                                response.end();
                                            }
                                        }
                                        else{
                                            console.log("There is no value in the requested component count");
                                            failure_response.description = "There is no value in the requested component count";
                                            response.write(JSON.stringify(failure_response));
                                            response.end();
                                        }
                                    }
                                    else{
                                        console.log("There is no property called msp");
                                        failure_response.description = "There is no property called msp";
                                        response.write(JSON.stringify(failure_response));
                                        response.end();
                                    }

                                }
                                else{
                                    console.log("There is no property called service details");
                                    failure_response.description = "There is no property called service details";
                                    response.write(JSON.stringify(failure_response));
                                    response.end();
                                }
                            }
                            else{
                                console.log("There is no data in result");
                                failure_response.description = "There is no data in result";
                                response.write(JSON.stringify(failure_response));
                                response.end();
                            }


                        }
                    } else {
                        var errMessage = "Error occurred while accessing components : \n" + JSON.stringify(err);
                        console.log(errMessage);
                        console.log("Error occurred while accessing components");
                        failure_response.description = "There is no data in result";
                        response.write(JSON.stringify(failure_response));
                        response.end();
                    }
                });
            }

            else {

                console.log("Please check service details");
                failure_response.description = "Please check service details";
                response.write(JSON.stringify(failure_response));
                response.end();
            }

        } catch (err) {
            console.log("There is some error:")
            failure_response.description = "There is some error: please try again";
            response.write(JSON.stringify(failure_response));
            response.end();
        }
    }

};
