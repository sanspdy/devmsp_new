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

var success_response = {
    "status" : "success"
};

var failure_response = {
    "status" : "failed",
    "description" : ""
};
// Initiating Database connection function
initDBConnection();

exports.updateServiceInfo=function(request, response) {
    console.log("updateServiceInfo : " + requestMessage);
    console
        .log("*************************************************************************")
    console.log("Request message: " + "updateServiceInfo : "
        + JSON.stringify(request.body));
    var dbSoln = cloudant.use(dbCredentials.dbSolution);
    var username = request.body.uname;
    var SolName = request.body.solnName;
    // console.log(request.body);
    // var service_det=request.body.service_details;
    var service_name = request.body.service_name;
    var compcnt = request.body.component_cnt;
    var solution_json = request.body.solnjson;

    console.log("Request from solution info: "
        + "updateServiceInfo : "
        + JSON.stringify(solution_json));
    // console.log(JSON.stringify(solutionJson));
    // response.write(JSON.stringify(solutionJson));

    if (username == null) {
        console
            .log("updateServiceInfo : "
                + "no sufficient details. returning false info");
        var resjson = {
            "status" : "failed",
        };

        response.write(JSON.stringify(resjson));
        response.end();
    } else if (SolName == null) {
        console
            .log("updateServiceInfo : "
                + "no sufficient details. returning false info");

        var resjson = {
            "status" : "failed",
        };

        response.write(JSON.stringify(resjson));
        response.end();
    } else if (service_name == null) {
        console
            .log("updateServiceInfo : "
                + "no sufficient details. returning false info");
        var resjson = {
            "status" : "failed",
        };
        response.write(JSON.stringify(resjson));
        response.end();

    } else if (compcnt == null) {
        console
            .log("updateServiceInfo : "
                + "no sufficient details. returning false info");
        var resjson = {
            "status" : "failed",
        };
        response.write(JSON.stringify(resjson));
        response.end();
    } else if (solution_json == null) {
        console
            .log("updateServiceInfo : "
                + "no sufficient details. returning false info");
        var resjson = {
            "status" : "failed",
        };
        response.write(JSON.stringify(resjson));
        response.end();
    }

    else {
        try {

            dbSoln
                .find(
                    {
                        selector : {
                            solution_name : SolName
                        }
                    },
                    function(err, result) {
                        console
                            .log("updateServiceInfo : fetch exact record from dB "
                                + JSON
                                    .stringify(result));
                        if (!err) {
                            // var services=
                            // result.docs[0].service_details.msp[compcnt];

                            result.docs[0].service_details.msp[compcnt] = solution_json;
                            dbSoln
                                .insert(
                                    result.docs[0],
                                    function(
                                        err2,
                                        result2) {

                                        console
                                            .log("updateServiceInfo : "
                                                + "response from insert "
                                                + JSON
                                                    .stringify(result2));
                                        if (err2) {
                                            console
                                                .log("updateServiceInfo : "
                                                    + "Error while inserting : "
                                                    + err2);
                                        } else {
                                            console
                                                .log("updateServiceInfo : "
                                                    + "New doc created ..");
                                            setTimeout(
                                                function() {
                                                    console
                                                        .log("updateServiceInfo : "
                                                            + "*** Request Responded ***");
                                                    var resjson = {
                                                        "status" : "success",
                                                    };
                                                    response
                                                        .write(JSON
                                                            .stringify(resjson));
                                                    response
                                                        .end();
                                                },
                                                1000);

                                        }
                                    });

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

exports.v1_updateServiceInfo=function(request, response) {
    console.log("updateServiceInfo : " + requestMessage);
    console.log("*************************************************************************")
    console.log("Request message: " + "updateServiceInfo : "+ request);
    var dbSoln = cloudant.use(dbCredentials.dbSolution);

    var username = request.body.uname;
    var SolName = request.body.solnName;
    // console.log(request.body);
    // var service_det=request.body.service_details;
    var service_name = request.body.service_name;
    var compcnt = request.body.component_cnt;
    var solution_json = request.body.solnjson;

    console.log("Request from solution info: "+ "updateServiceInfo : "+ JSON.stringify(solution_json));

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

            dbSoln.find({selector : {solution_name : SolName}},function(err, result) {
                console.log("updateServiceInfo : fetch exact record from dB "+ JSON.stringify(result));
                if (!err) {


                    if(result.docs[0].hasOwnProperty("service_details") !== undefined || result.docs[0].service_details !== null) {
                        if (result.docs[0].hasOwnProperty("msp") !== undefined || result.docs[0].hasOwnProperty("msp") !==null) {
                            if (result.docs[0].msp !== null || result.docs[0].msp !== undefined ) {

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
                                console.log("There is no property called bluemix runtime");
                                failure_response.description = "There is no property called runtime";
                                response.write(JSON.stringify(failure_response));
                                response.end();
                            }
                        }
                        else{
                            console.log("There is no property called bluemix");
                            failure_response.description = "There is no property called bluemix";
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

exports.updateMspConnectionInfo=function(request, response) {
    console.log(requestMessage);
    console
        .log("*************************************************************************")
    var dbSoln = cloudant.use(dbCredentials.dbSolution);

    var username = request.body.uname;
    var SolName = request.body.solnName;
    // console.log(request.body);
    // var service_det=request.body.service_details;
    // var service_name=request.body.service_name;
    // var canvas_info=request.body.canvasinfo;
    var connection_info = request.body.connectioninfo;
    // var solution_json=request.body.solnjson;
    console.log("Response from body: "
        + JSON.stringify(canvas_info));
    console.log(request.body);
    // console.log(JSON.stringify(solutionJson));
    // response.write(JSON.stringify(solutionJson));

    try {
        dbSoln
            .find(
                {
                    selector : {
                        solution_name : SolName
                    }
                },
                function(err, result) {
                    if (!err) {
                        // var services=
                        // result.docs[0].service_details.msp[compcnt];

                        // result.docs[0].canvas_details[0]=canvas_info;
                        result.docs[0].connection_info.msp.middleware_comp[0] = connection_info;
                        // console.log(result.docs[0].canvas_details[0]);
                        console
                            .log(result.docs[0].connection_info.msp);
                        dbSoln
                            .insert(
                                result.docs[0],
                                function(err2,
                                         result2) {
                                    console
                                        .log("response from insert");
                                    console
                                        .log("response from insert "
                                            + JSON
                                                .stringify(result));
                                    if (err) {
                                        console
                                            .log(err2);
                                    } else {
                                        console
                                            .log("New doc created ..");
                                        setTimeout(
                                            function() {
                                                console
                                                    .log("*** Request Responded ***");
                                                console
                                                    .log("Status Success");
                                                response
                                                    .write("{'status': 'success'}");
                                                response
                                                    .end();
                                            },
                                            1000);

                                    }

                                });

                        // console.log(services);
                        // response.write(JSON.stringify(services));
                        // response.end();
                    } else {
                        var errMessage = "Error occurred while accessing components : \n"
                            + JSON.stringify(err);
                        response.write(errMessage);
                        console.log(errMessage);
                        response.end();
                        console.log(responseMessage);
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

var http=require('http');

exports.getComponentPrice=function(reqst, response) {
    console.log("*** Request Received ***");

    var priceJson = reqst.body;
    console.log(priceJson);

    priceJson.Pattern=JSON.parse(priceJson.Pattern);


    //var data = JSON.stringify(priceJson);

    var result = "";
    try
    {
        var data = JSON.stringify(priceJson);

        // var options="http://5.10.122.181:8080/mpaas/rest/item/price"
        var options = {
            host : '5.10.122.180',
            port : 9092,
            path : '/CBSMSP/rest/item/price',
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
            res.on('end',function(err,res1){
                console.log("*** Request Responded ***");
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


    } catch (err){
        console.log("There is some error:")
        console.log(err.stack);
        console.log("*** Request Responded ***");
        var resjson = {
            "status" : "failed"
        };
        response.write(JSON.stringify(resjson));
    }

}

exports.v1_getComponentPrice=function(reqst, response) {
    console.log("*** Request Received ***");

    var priceJson = reqst.body;
    console.log(priceJson);

    var http=require('http');

    var data = JSON.stringify(priceJson);

    var result = "";
    try
    {
        var data = JSON.stringify(priceJson);

        // var options="http://5.10.122.181:8080/mpaas/rest/item/price"
        var options = {
            host : '5.10.122.180',
            port : 9092,
            path : '/CBSMSP/rest/item/price',
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
            res.on('end',function(err,res1){
                console.log("*** Request Responded ***");
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


    } catch (err){
        console.log("There is some error:")
        console.log(err.stack);
        console.log("*** Request Responded ***");
        failure_response.description = "Error while fetching data from IMI Server. Please try later"
        response.write(JSON.stringify(failure_response));
    }

}


exports.getServiceInfo=function (request, response) {

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
                dbSoln.find({selector: {solution_name: SolName}}, function (err, result) {
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

}


exports.getMspComponentlists = function(reqst, response) {
    console.log("*** Request Received ***");
    initDBConnection();
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
            res.on('end',function(err,res1){
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

        setTimeout(function() {
            console.log("*** Request Responded ***");
            lengthofresult = result.length;
            console.log(lengthofresult);

            console.log(result);
            response.write(result);
            response.end();
        }, 500);

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

exports.getMspComponentlist = function(reqst, response) {
    console.log("*** Request Received ***");

    // Created temporary database and hardcoded all the values.
    console.log(requestMessage);
    initDBConnection();
    db = cloudant.use(dbCredentials.dbTmpMidComponent);
    var docList = [];
    var componenttitle = [];
    var i = 1;
    db.list(function(err, result) {
        // console.log("*** Request Received *** " +
        // JSON.stringify(result));
        if (!err) {
            var len = result.rows.length;
            console.log("*** Total number of records *** "+ len);
            if (len == 0) {
                response.write("Sorry for inconvenience! We are feeding data at this moment!");
                console.log("Sorry for inconvenience! We are feeding data at this moment!");
                response.end();
                console.log(responseMessage);
            }
            result.rows.forEach(function(document) {
                // console.log("*** Entered into
                // loop *** " +
                // JSON.stringify(document));
                db.get(document.id,function(err,doc) {
                    // console.log("***
                    // Fetched
                    // record
                    // for " +
                    // JSON.stringify(doc));
                    if (!err) {
                        docList
                            .push(doc);

                        // docListJson=JSON.stringify(docList);
                        // docListJson1=JSON.parse(docListJson);
                        // console.log(docList);
                        // console.log(docListJson1);

                        if (i >= len) {

                            docListJson = JSON
                                .stringify(docList);
                            // console.log(docListJson);

                            var docListJson1 = JSON
                                .parse(docListJson);
                            console
                                .log(docListJson1);
                            response
                                .write(JSON
                                    .stringify(docList));
                            console
                                .log('Components are successfully fetched');
                            response
                                .end();
                            console
                                .log(responseMessage);
                        }
                    } else {
                        err.id = document.id;
                        docList
                            .push(err);
                        var errMessage = "Error occurred while accessing components : \n"
                            + JSON
                                .stringify(err);
                        console
                            .log(errMessage);
                    }
                    i++;
                });

            });
        } else {
            var errMessage = "Error occurred while accessing components : \n"
                + JSON.stringify(err);
            response.write(errMessage);
            console.log(errMessage);
            response.end();
            console.log(responseMessage);
        }
    });

}

exports.getMspOfferings = function(reqst, response) {
    console.log("*** Request Received ***");
    initDBConnection();
    var data = JSON.stringify({
        "category" : "Business Stack"
    });

    var result = "";

    // var options="http://5.10.122.180:9092/CBSMSP/rest/catalog/fetch"

    var options = {
        host : '5.10.122.180',
        port : 9092,
        path : '/CBSMSP/rest/catalog/fetch',
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json',
            'Content-Length' : data.length

        }
    };

    var req = http.request(options, function(res) {
        // res.setEncoding('utf8');
        res.on('data', function(chunk) {

            console.log(data);
            console.log(typeof data);

            console.log("body: " + chunk);
            result += chunk;
            console.log("******************** Result ******************");
            console.log(result);


        });
        res.on('end', function(chunk) {


            console.log("*** Request Responded ***");
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

}