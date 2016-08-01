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
var https=require('https');

var success_response = {
    "status" : "success"
};

var failure_response = {
    "status" : "failed",
    "description" : ""
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

initDBConnection();


exports.getBluemixServiceInfo=function(request, response) {
    console.log(requestMessage);
    console
        .log("*************************************************************************")
    var dbSoln = cloudant.use(dbCredentials.dbSolution);

    var username = request.body.uname;
    var SolName = request.body.solnName;
    console.log(request.body);
    var service_det = request.body.service_details;
    var service_name = request.body.service_name;
    var compcnt = request.body.component_cnt;

    if (username == null) {
        console
            .log("no sufficient details. returning false info");
        var resjson = {
            "status" : "failed"
        };
        response.write(JSON.stringify(resjson));
        response.end();
    } else if (SolName == null) {
        console
            .log("no sufficient details. returning false info");
        var resjson = {
            "status" : "failed"
        };
        response.write(JSON.stringify(resjson));

        response.end();
    } else if (service_name == null) {
        console
            .log("no sufficient details. returning false info");
        var resjson = {
            "status" : "failed"
        };
        response.write(JSON.stringify(resjson));

        response.end();
    } else if (compcnt == null) {
        console
            .log("no sufficient details. returning false info");
        var resjson = {
            "status" : "failed"
        };
        response.write(JSON.stringify(resjson));

        response.end();
    }

    else {
        try {
            if (service_det == "bluemix") {

                // console.log("Response from body:
                // "+solutionJson);
                // console.log(JSON.stringify(solutionJson));
                // response.write(JSON.stringify(solutionJson));

                dbSoln
                    .find(
                        {
                            selector : {
                                solution_name : SolName
                            }
                        },
                        function(err, result) {
                            if (!err) {
                                console.log(result);
                                if (result.docs[0] == null) {
                                    console
                                        .log("null value in result");
                                    var resjson = {
                                        "status" : "failed"
                                    };
                                    response
                                        .write(JSON
                                            .stringify(resjson));
                                    response.end();
                                } else if (result.docs[0].service_details.bluemix[0].services.length <= compcnt) {
                                    console
                                        .log("less value in result and u requested impossible value");
                                    var resjson = {
                                        "status" : "failed"
                                    };
                                    response
                                        .write(JSON
                                            .stringify(resjson));

                                    response.end();
                                } else {
                                    var services = result.docs[0].service_details.bluemix[0].services[compcnt];
                                    var nameofservice = result.docs[0].service_details.bluemix[0].services[compcnt].title;
                                    if (nameofservice == service_name) {
                                        console
                                            .log(services);
                                        response
                                            .write(JSON
                                                .stringify(services));
                                        response.end();
                                    } else {
                                        var resjson = {
                                            "status" : "failed"
                                        };

                                        console
                                            .log("Service Name Not matching");
                                        response
                                            .write(JSON
                                                .stringify(resjson));
                                        response.end();
                                    }
                                }
                            } else {
                                var errMessage = "Error occurred while accessing components : \n"
                                    + JSON
                                        .stringify(err);
                                response
                                    .write(errMessage);
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
                                        response
                                            .end();
                                    }, 1000);
                            }
                        });
            } else {
                console.log("service details wrong");
                var resjson = {
                    "status" : "failed",
                };
                response.write(JSON.stringify(resjson));

                response.end();
            }

        } catch (err) {
            console.log("There is some error:");
            console.log(err.stack);
            console.log("*** Request Responded ***");
            var resjson = {
                "status" : "failed"
            };
            response.write(JSON.stringify(resjson));
        }
    }

}

exports.v1_getBluemixServiceInfo=function(request, response) {
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
            getbmserviceinfo();
        }
    }
    else{
        console.log("There is no username, solution name, servicename, component count defined in JSON in body");
        failure_response.description="There is no username, solution name, servicename, component count defined in JSON in body"
        response.write(JSON.stringify(failure_response));
        response.end();
    }

    function getbmserviceinfo(){
        try {
            if (service_det == "bluemix") {

                dbSoln.find({selector: {solution_name: SolName}},function (err, result) {
                    if (!err) {
                        console.log(result);
                        if (result.docs === null || result.docs === undefined) {
                            console.log("null value in result. there is no such data");
                            failure_response.description="null value in result. there is no such data"
                            response.write(JSON.stringify(failure_response));
                            response.end();
                        } else if (result.docs[0].service_details.bluemix[0].services.length <= compcnt) {
                            console.log("less value in result and u requested impossible value");
                            failure_response.description="less value in result and u requested impossible value"
                            response.write(JSON.stringify(failure_response));
                            response.end();
                        } else {
                            if(result.docs[0].hasOwnProperty("service_details") !== undefined || result.docs[0].service_details !== null) {
                                if (result.docs[0].hasOwnProperty("bluemix") !== undefined || result.docs[0].hasOwnProperty("bluemix") !==null) {
                                    if (result.docs[0].bluemix !== null || (result.docs[0].bluemix[0].hasOwnProperty("services") !== null || result.docs[0].bluemix[0].hasOwnProperty("services") !== undefined)) {

                                        var services = result.docs[0].service_details.bluemix[0].services[compcnt];
                                        var nameofservice = result.docs[0].service_details.bluemix[0].services[compcnt].title;
                                        //services.properties[0].extra = JSON.parse(services.properties[0].extra);
                                        if (nameofservice == service_name) {

                                            for (var i = 0; i < services.properties[0].length; i++) {
                                                if (services.properties[0][i].entity.extra === null || services.properties[0][i].entity.extra === undefined) {
                                                    console.log("Inside if");
                                                }
                                                else if ( !services.properties[0][i].entity.extra.hasOwnProperty("costs")) {
                                                    console.log("Inside else if 1");
                                                    /*response.send(services);
                                                     response.end();*/
                                                }
                                                else if (services.properties[0][i].entity.extra.costs[0] === null) {
                                                    console.log("Inside else if 2");
                                                    /*response.send(services);
                                                     response.end();*/
                                                }
                                                else if (!services.properties[0][i].entity.extra.costs[0].hasOwnProperty("currencies")) {
                                                    console.log("Inside else if 3")
                                                    /*response.send(services);

                                                     response.end();*/
                                                }
                                                else {
                                                    console.log("Hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
                                                    for(var j=0;j<services.properties[0][i].entity.extra.costs.length;j++){
                                                        delete services.properties[0][i].entity.extra.costs[j].currencies;
                                                        console.log("*************************************", services);
                                                    }


                                                    /* response.send(services);
                                                     //response.write(JSON.stringify(services));
                                                     response.end();*/
                                                }

                                            }
                                            response.send(services);
                                            response.end();


                                        }
                                        else {
                                            console.log("Service name in the requested component count is not matching");
                                            failure_response.description = "Service name in the requested component count is not matching";
                                            response.write(JSON.stringify(failure_response));
                                            response.end();
                                        }

                                    }else{
                                        console.log("There is no property called bluemix services");
                                        failure_response.description = "There is no property called services in bluemix";
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

                        }
                    } else {
                        var errMessage = "Error occurred while accessing components : \n"+ JSON.stringify(err);
                        response.write(errMessage);
                        console.log(errMessage);
                        failure_response.description="Error occurred while accessing components"
                        response.write(JSON.stringify(failure_response));
                        response.end();
                    }
                });
            } else {
                console.log("service details wrong");
                failure_response.description="service details wrong"
                response.write(JSON.stringify(failure_response));
                response.end();
            }

        } catch (err) {
            var errMessage = "Error occurred while accessing components : \n"+ JSON.stringify(err);
            response.write(errMessage);
            console.log(errMessage);
            failure_response.description="Error occurred while accessing components"
            response.write(JSON.stringify(failure_response));
            response.end();
        }
    }

}


exports.getBluemixRuntimeInfo=function(request, response) {
    console.log(requestMessage);
    console
        .log("*************************************************************************")
    var dbSoln = cloudant.use(dbCredentials.dbSolution);

    var username = request.body.uname;
    var SolName = request.body.solnName;
    console.log(request.body);
    var service_det = request.body.service_details;
    var service_name = request.body.service_name;
    var compcnt = request.body.component_cnt;

    if (username == null) {
        console
            .log("no sufficient details. returning false info");
        var resjson = {
            "status" : "failed",
        };
        response.write(JSON.stringify(resjson));
        response.end();
    } else if (SolName == null) {
        console
            .log("no sufficient details. returning false info");
        var resjson = {
            "status" : "failed",
        };
        response.write(JSON.stringify(resjson));

        response.end();
    } else if (service_name == null) {
        console
            .log("no sufficient details. returning false info");
        var resjson = {
            "status" : "failed",
        };
        response.write(JSON.stringify(resjson));

        response.end();
    } else if (compcnt == null) {
        console
            .log("no sufficient details. returning false info");
        var resjson = {
            "status" : "failed",
        };
        response.write(JSON.stringify(resjson));

        response.end();
    }

    else {
        try {
            if (service_det == "runtime") {
                // console.log("Response from body:
                // "+solutionJson);
                // console.log(JSON.stringify(solutionJson));
                // response.write(JSON.stringify(solutionJson));

                dbSoln
                    .find(
                        {
                            selector : {
                                solution_name : SolName
                            }
                        },
                        function(err, result) {
                            if (!err) {
                                console.log(result);
                                if (result.docs[0] == null) {
                                    console
                                        .log("null value in result");
                                    var resjson = {
                                        "status" : "failed",
                                    };
                                    response
                                        .write(JSON
                                            .stringify(resjson));
                                    response.end();
                                } else if (result.docs[0].service_details.bluemix[0].runtime.length <= compcnt) {
                                    console
                                        .log("less value in result and u requested impossible value");
                                    var resjson = {
                                        "status" : "failed",
                                    };
                                    response
                                        .write(JSON
                                            .stringify(resjson));

                                    response.end();
                                } else {
                                    var services = result.docs[0].service_details.bluemix[0].runtime[compcnt];
                                    var nameofservice = result.docs[0].service_details.bluemix[0].runtime[compcnt].title;
                                    if (nameofservice == service_name) {
                                        console
                                            .log(services);
                                        response
                                            .write(JSON
                                                .stringify(services));
                                        response.end();
                                    } else {
                                        var resjson = {
                                            "status" : "failed",
                                        };

                                        console
                                            .log("Service Name Not matching");
                                        response
                                            .write(JSON
                                                .stringify(resjson));
                                        response.end();
                                    }
                                }
                            } else {
                                var errMessage = "Error occurred while accessing components : \n"
                                    + JSON
                                        .stringify(err);
                                response
                                    .write(errMessage);
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
                                        response
                                            .end();
                                    }, 1000);
                            }
                        });
            } else {
                console.log("service details wrong");
                var resjson = {
                    "status" : "failed",
                };
                response.write(JSON.stringify(resjson));

                response.end();
            }
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

exports.v1_getBluemixRuntimeInfo=function(request, response) {
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
            getbmruntimeinfo();
        }
    }
        else{
        console.log("There is no username, solution name, servicename, component count defined in JSON in body");
        failure_response.description="There is no username, solution name, servicename, component count defined in JSON in body"
        response.write(JSON.stringify(failure_response));
        response.end();
    }

    function getbmruntimeinfo(){
        try {
            if (service_det == "runtime") {

                dbSoln.find({selector: {solution_name: SolName}},function (err, result) {
                    if (!err) {
                        console.log(result);
                        if (result.docs === null || result.docs === undefined) {
                            console.log("null value in result. there is no such data");
                            failure_response.description="null value in result. there is no such data"
                            response.write(JSON.stringify(failure_response));
                            response.end();
                        } else if (result.docs[0].service_details.bluemix[0].runtime.length <= compcnt) {
                            console.log("less value in result and u requested impossible value");
                            failure_response.description="less value in result and u requested impossible value"
                            response.write(JSON.stringify(failure_response));
                            response.end();
                        } else {
                            if(result.docs[0].hasOwnProperty("service_details") !== undefined || result.docs[0].service_details !== null) {
                                if (result.docs[0].hasOwnProperty("bluemix") !== undefined || result.docs[0].hasOwnProperty("bluemix") !==null) {
                                    if (result.docs[0].bluemix !== null || (result.docs[0].bluemix[0].hasOwnProperty("runtime") !== null || result.docs[0].bluemix[0].hasOwnProperty("runtime") !== undefined)) {

                                        var services = result.docs[0].service_details.bluemix[0].runtime[compcnt];
                                        var nameofservice = result.docs[0].service_details.bluemix[0].runtime[compcnt].title;
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

                        }
                    } else {
                        var errMessage = "Error occurred while accessing components : \n"+ JSON.stringify(err);
                        response.write(errMessage);
                        console.log(errMessage);
                        failure_response.description="Error occurred while accessing components"
                        response.write(JSON.stringify(failure_response));
                        response.end();
                    }
                });
            } else {
                console.log("service details wrong");
                failure_response.description="service details wrong"
                response.write(JSON.stringify(failure_response));
                response.end();
            }

        } catch (err) {
            var errMessage = "Error occurred while accessing components : \n"+ JSON.stringify(err);
            response.write(errMessage);
            console.log(errMessage);
            failure_response.description="Error occurred while accessing components"
            response.write(JSON.stringify(failure_response));
            response.end();
        }
    }

}

exports.updateBMRuntimeInfo=function(request, response) {
    console.log(requestMessage);
    console
        .log("*************************************************************************")
    var dbSoln = cloudant.use(dbCredentials.dbSolution);

    var username = request.body.uname;
    var SolName = request.body.solnName;
    // console.log(request.body);
    var service_det = request.body.service_details;
    var service_name = request.body.service_name;
    var compcnt = request.body.component_cnt;
    var solution_json = request.body.solnjson;
    console.log("Response from body: "
        + JSON.stringify(solution_json));
    // console.log(JSON.stringify(solutionJson));
    // response.write(JSON.stringify(solutionJson));

    if (username == null) {
        console
            .log("no sufficient details. returning false info");
        var resjson = {
            "status" : "failed",
        };
        response.write(JSON.stringify(resjson));
        response.end();
    } else if (SolName == null) {
        console
            .log("no sufficient details. returning false info");
        var resjson = {
            "status" : "failed",
        };
        response.write(JSON.stringify(resjson));
        response.end();
    } else if (service_name == null) {
        console
            .log("no sufficient details. returning false info");
        var resjson = {
            "status" : "failed",
        };
        response.write(JSON.stringify(resjson));
        response.end();
    } else if (compcnt == null) {
        console
            .log("no sufficient details. returning false info");
        var resjson = {
            "status" : "failed",
        };
        response.write(JSON.stringify(resjson));
        response.end();
    } else if (solution_json == null) {
        console
            .log("no sufficient details. returning false info");
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
                        if (!err) {
                            // var services=
                            // result.docs[0].service_details.msp[compcnt];

                            result.docs[0].service_details.bluemix[0].runtime[compcnt] = solution_json;
                            dbSoln
                                .insert(
                                    result.docs[0],
                                    function(
                                        err2,
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

exports.updateBMConnectionInfo=function(request, response) {
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
                        result.docs[0].connection_info.bluemix = connection_info;
                        // console.log(result.docs[0].canvas_details[0]);
                        console
                            .log(result.docs[0].connection_info.bluemix);
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

exports.getBluemixComponentProperties=function(request, response) {
    console.log("*** Request Received ***");
    db = cloudant.use(dbCredentials.dbTmpBluemixProp);

    console.log(requestMessage);
    console
        .log("*************************************************************************")
    var title = request.body.label;
    console.log(request.body);
    // var service_det=request.body.service_details;
    // var service_name=request.body.service_name;
    // var compcnt=request.body.component_cnt;
    // console.log("Response from body: "+solutionJson);
    // console.log(JSON.stringify(solutionJson));
    // response.write(JSON.stringify(solutionJson));

    db
        .find(
            {
                selector : {
                    label : title
                }
            },
            function(err, result) {
                if (!err) {
                    // var services=
                    // result.docs[0].service_details.msp[compcnt];
                    console.log("Result received");
                    console.log(result);
                    // response.write(JSON.stringify(result));
                    response.end();
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

}

exports.v1_getBluemixComponentProperties=function(request, response) {
    console.log("*** Request Received ***");
    db = cloudant.use(dbCredentials.dbTmpBluemixProp);

    console.log(requestMessage);
    console.log("*************************************************************************")
    var title = request.body.label;
    console.log(request.body);
    db.find({selector : {label : title}},function(err, result) {
        if (!err) {
            // var services=
            // result.docs[0].service_details.msp[compcnt];
            console.log("Result received");
            console.log(result);
            // response.write(JSON.stringify(result));
            response.end();
        } else {
            var errMessage = "Error occurred while accessing components : \n"+ JSON.stringify(err);
            response.write(errMessage);
            console.log(errMessage);
            response.end();
            console.log(responseMessage);

            var resjson = {
                "status" : "failed"
            };
            response.write(JSON.stringify(resjson));

        }
    });

}

exports.getbluemixtoken=function(reqst, response) {
    console.log("*** Request Received ***");

    var https = require('https');
    var data = JSON.stringify({
        'grant_type' : 'password',
        'username' : 'santhoshmuniswami@in.ibm.com',
        'password' : '*****'
    });

    var options = {
        host : 'login.ng.bluemix.net',
        port : 80,
        path : '/UAALoginServerWAR/oauth/token',
        method : 'POST',
        headers : {
            'Content-Type' : 'application/x-www-form-urlencoded;charset=utf-8',
            'Content-Length' : data.length,
            'Accept' : 'application/json;charset=utf-8',
            'Authorization' : 'Basic Y2Y6'
        }

    };

    var req = https.request(options, function(res) {
        var msg = '';
        // console.log("response received : " + JSON.stringify(res));
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            msg += chunk;
        });
        res.on('end', function() {
            console.log(JSON.stringify(msg));
            response.write(msg);
            response.end();
        });
    });
    req.on('error',function(err,result) {
        console.log(err);
        console.log("Error while fetching authorised token from server");
        failure_response.description = "Error while fetching authorised token from server"
        response.write(JSON.stringify(failure_response));
        response.end();
    });

    req.write(data);
    req.end();

}

exports.getbluemixtoken=function(reqst, response) {

    console.log("*** Request Received ***");
    var querystring = require('querystring');
    var http = require('http');
    var data = JSON.stringify({
        'grant_type' : 'password'
    });

    var dataString = JSON.stringify(data);

    // console.log("data string : " + dataString);

    var options = {
        host : 'login.ng.bluemix.net',
        port : 80,
        path : '/UAALoginServerWAR/oauth/token'
        + '?grant_type=password&username=santhoshmuniswami@in.ibm.com&password=sans1@MPAS',
        method : 'POST',
        headers : {
            'Content-Type' : 'application/x-www-form-urlencoded;charset=utf-8',
            'Content-Length' : data.length,
            'Accept' : 'application/json;charset=utf-8',
            'Authorization' : 'Basic Y2Y6'
        }

    };
    var token = '';
    var msg = '';
    var req = http.request(options, function(res) {

        // console.log("response received : " + res);
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            msg += chunk;
        });
        res.on('end', function() {
            response.write(msg);
            response.end();
        });
        console.log("message : " + msg);
    });
    req.on('error', function() {
        failure_response.description = "Error while fetching bluemix token"
        response.write(JSON.stringify(failure_response));
        response.end();
    });

    req.write(data);
    req.end();

}

exports.getbluemixServicesproperties=function(reqst, resp) {
    console.log("*** Request Received ***");
    var label_name = reqst.body.title;

    var token_json = "";
    var original_url = "api.ng.bluemix.net"
    var full_serviceplan_url = "";
    var full_token = "";
    var service_planUrl = "";
    var properties = [];
    var properties1 = [];
    var property_json;
    db = cloudant.use(dbCredentials.dbBluemix_services);
    console.log(label_name);

    try {
        db.find({selector : {"entity" : {"label" : label_name}}}, function(err, result) {
            if (!err) {
                console.log(result);
                if(result.docs !== null || result.docs !== undefined || result.docs !== []) {
                    service_planUrl = result.docs[0].entity.service_plans_url;
                    console.log("Service plan URL:" + service_planUrl);
                    full_serviceplan_url = original_url + service_planUrl;
                    console.log("Full URL for service plan is : "
                        + full_serviceplan_url);
                    // resp.write(JSON.stringify(result));
                    // resp.end();
                }
                else{
                    failure_response.description="There is no record found";
                    resp.write(failure_response);
                    resp.end();
                }
            } else {
                console.log("Error while fetching services");
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
    /*
     *
     * var request =
     * http.get("http://cbicportal.mybluemix.net/api/getbluemixtoken",
     * function(response){ console.log(response.statusCode); //Read the Data
     * response.on('data', function (chunk) { console.log('BODY: ' + chunk)
     * token_json = chunk; }); });
     *
     * request.on("error", function(error){ console.error(error.message); })
     */
    try {
        var data = "";
        url = "http://cbicportal.mybluemix.net/api/getbluemixtoken";

        function download(url, callback) {
            http.get(url, function(res) {

                res.on('data', function(chunk) {
                    data += chunk;
                });
                res.on("end", function() {
                    callback(data);
                });
            }).on("error", function() {
                callback(null);
            });
        }

        download(url, function(data) {
            if (data) {
                console.log("Data 1 is ready to send and now sending....");

                // response.write(data);
                var Datajson = JSON.parse(data);
                // var total_page=Datajson_page1.total_pages;
                console.log("result: " + Datajson);

                tokentype = Datajson.token_type;
                token_data = Datajson.access_token;

                full_token = tokentype + " " + token_data;
                console.log(full_token);

            } else {
                console.log("Error in data reception");
            }
        });
    }

    catch (err) {
        console.log("There is some error:")
        console.log(err.stack);
        console.log("*** Request Responded ***");
        var resjson = {
            "status" : "failed"
        };
        response.write(JSON.stringify(resjson));
    }

    // to get bluemix service properties requested by user.

    try {

        setTimeout(function() {

            var options = {
                host : original_url,
                path : service_planUrl,
                method : 'GET',
                headers : {
                    'Accept': 'application/json',
                    'Authorization' : full_token
                }

            };

            var reqq = https.request(options, function(res) {

                // console.log("response received : " + JSON.stringify(res));

                res.on('data', function(chunk) {
                    properties += chunk;
                    console.log(properties);

                });
                res.on('end', function() {
                    properties = JSON.stringify(properties);
                    console.log(properties);
                    properties1 = JSON.parse(properties);
                    properties1 = JSON.parse(properties1);
                    console.log(properties1.total_results);
                    //var service_guid = properties1.resources[0].metadata.guid;
                    //console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",service_guid);
                    filtered_properties = properties1.resources;
                    for(var i=0; i<filtered_properties.length; i++){
                        filtered_properties[i].entity.extra = JSON.parse(filtered_properties[i].entity.extra);
                    }
                    // filtered_properties.extra = JSON.parse(filtered_properties.extra);
                    // delete filtered_properties.extra.costs[0].currencies;
                    property_json = {
                        "title" : label_name,
                        "properties" : [ filtered_properties ]
                    };
                    //property_json = JSON.stringify(property_json)
                    console.log(property_json);

                    try{
                        console.log("Hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
                        dbplan = cloudant.use("bluemixserviceplans");
                        dbplan.find({selector : {"title":label_name}},function(err,result){
                            console.log("selectorrrrrrrrrrrrrrrrrrrrrrr");
                            if(result.docs.length === 0){
                                console.log("in resultttttttttttttttttttttttttttttttt");
                                dbplan.insert(property_json,function(err,result){
                                    if(!err){
                                        console.log("Data inserted");


                                    }
                                    else{
                                        console.log("Error in inserting");

                                    }
                                    /*                                   dbplan.find({selector : {"title":label_name}},function(err,result){
                                     console.log("findinggggggggggggggggggggggggggggggggggggggggggg");
                                     for(var i=1;i<property_json.properties.length;i++){
                                     console.log("/////////////////////////////////////",property_json.properties[i]);
                                     result.docs[0].properties[i]=property_json.properties[i];
                                     console.log("++++++++++++++++++++++++++++++++++++++",result.docs[0].properties[i]);
                                     dbplan.insert(result.docs[0],function(err,result){
                                     if(!err){
                                     console.log(result.docs);
                                     console.log("------------Data inserted----------------");
                                     }
                                     else{
                                     console.log("------------Error inserting data----------------");
                                     }

                                     });
                                     }

                                     });*/


                                });

                            }
                            else{
                                console.log("Data already exists");

                            }
                        });

                    }
                    catch(err){
                        console.log("There was some error");

                    }
                    resp.send(property_json);
                    resp.end();

                });
            });

            reqq.write(data);
            reqq.end();

        }, 3000);

    } catch (err) {
        console.log("There is some error:")
        console.log(err.stack);
        console.log("*** Request Responded ***");
        failure_response.description = "Error while fetching services list from server"
        response.write(JSON.stringify(failure_response));
        console.log(errMessage);
        response.end();
    }
}

exports.getRuntimePrice=function(reqst, resp) {

    var instances = parseInt(reqst.body.inst);
    var memories = parseInt(reqst.body.memory);

    console.log("Instances:" + instances);
    console.log("Memories:" + memories);

    if (instances == null) {
        failure_response.description = "Please give instance details";
        resp.write(JSON.stringify(failure_response));
        resp.end();
    } else if (memories == null) {
        failure_response.description = "Please give memory details";
        resp.write(JSON.stringify(failure_response));
        resp.end();
    } else {
        var runtimes = ((((memories * instances) / 128) - 5) * 380.37 + 316.97)/66;
        runtimes=Math.round(runtimes);
        console.log(runtimes);
        var resjson = {
            "final_price" : runtimes
        };
        resp.write(JSON.stringify(resjson));
        resp.end();
    }

}

/*
 exports.getBMServicePrice=function(reqst, resp) {

 var qty = parseInt(reqst.body.qty);
 var price = parseInt(reqst.body.price);

 console.log("Quantity:" + qty);
 console.log("Price:" + price);

 if (qty == null) {
 failure_response.description = "Please give instance details";
 resp.write(JSON.stringify(failure_response));
 resp.end();
 } else if (price == null) {
 failure_response.description = "Please give memory details";
 resp.write(JSON.stringify(failure_response));
 resp.end();
 } else {
 var service_price = (qty * price) ;
 service_price=Math.round(service_price);
 console.log(service_price);
 var resjson = {
 "final_price" : service_price
 };
 resp.write(JSON.stringify(resjson));
 resp.end();
 }

 }
 */

exports.updateBMServiceInfo=function(request, response) {
    console.log(requestMessage);
    console
        .log("*************************************************************************")
    var dbSoln = cloudant.use(dbCredentials.dbSolution);

    var username = request.body.uname;
    var SolName = request.body.solnName;
    // console.log(request.body);
    // var service_det=request.body.service_details;
    var service_name = request.body.service_name;
    var compcnt = request.body.component_cnt;
    var solution_json = request.body.solnjson;
    var service_guid = request.body.service_guid;
    console.log("Response from body: "
        + JSON.stringify(solution_json));
    // console.log(JSON.stringify(solutionJson));
    // response.write(JSON.stringify(solutionJson));

    if (username === null) {
        console
            .log("no sufficient details. returning false info");
        var resjson = {
            "status" : "failed",
        };
        response.write(JSON.stringify(resjson));
        response.end();
    } else if (SolName == null) {
        console
            .log("no sufficient details. returning false info");
        var resjson = {
            "status" : "failed",
        };
        response.write(JSON.stringify(resjson));
        response.end();
    } else if (service_name == null) {
        console
            .log("no sufficient details. returning false info");
        var resjson = {
            "status" : "failed",
        };
        response.write(JSON.stringify(resjson));
        response.end();
    } else if (compcnt == null) {
        console
            .log("no sufficient details. returning false info");
        var resjson = {
            "status" : "failed",
        };
        response.write(JSON.stringify(resjson));
        response.end();
    } else if (solution_json == null) {
        console
            .log("no sufficient details. returning false info");
        var resjson = {
            "status" : "failed",
        };
        response.write(JSON.stringify(resjson));
        response.end();
    }

    else {
        try {
            console.log(solution_json);

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
                            console.log("------------------------------------------------",JSON.stringify(result.docs[0]));
                            console.log("vfhvsfjjjjjjjjjjvllssssssssssssssss",JSON.stringify(solution_json.properties[0]));
                            for(var i=0;i<solution_json.properties[0].length;i++){
                                console.log("printing ele",solution_json.properties[0][i].metadata.guid);
                                if(solution_json.properties[0][i].metadata.guid === service_guid){
                                    solution_json.properties[0][i].selected = "true";
                                    break;
                                }
                                else{
                                    console.log("No service selected");
                                }
                            }

                            result.docs[0].service_details.bluemix[0].services[compcnt] = solution_json;
                            dbSoln
                                .insert(
                                    result.docs[0],
                                    function(
                                        err2,
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


exports.AddBMRuntimeToCanvas=function(request, response) {
    console.log(requestMessage);
    console
        .log("*************************************************************************")
    var dbSoln = cloudant.use(dbCredentials.dbSolution);

    var username = request.body.uname;
    var SolName = request.body.solnName;
    console.log(request.body);
    var service_det = request.body.service_details;
    var service_name = request.body.service_name;
    var compcnt = request.body.component_cnt;
    var properties = {};
    // console.log("Response from body: "+solutionJson);
    // console.log(JSON.stringify(solutionJson));
    // response.write(JSON.stringify(solutionJson));

    if (username == null) {
        console
            .log("no sufficient details. returning false info");
        response.write("{result:failed}");
        response.end();
    } else if (SolName == null) {
        console
            .log("no sufficient details. returning false info");
        response.write("{result:failed}");
        response.end();
    } else if (service_name == null) {
        console
            .log("no sufficient details. returning false info");
        response.write("{result:failed}");
        response.end();
    } else if (compcnt == null) {
        console
            .log("no sufficient details. returning false info");
        response.write("{result:failed}");
        response.end();
    }

    else {

        if (service_det == "runtime") {
            /*
             * var data = JSON.stringify({ "title": service_name
             * });
             *
             *
             * console.log(data.length); // This should moved to
             * cloudant and make it parameterised var options = {
             * host: 'cbicportal.mybluemix.net', path:
             * '/api/getbluemixServicesproperties', method:
             * 'POST', headers: { 'Content-Type':
             * 'application/json', 'Content-Length': data.length } };
             *
             *
             * console.log(data);
             *
             * var req = http.request(options, function(res) {
             * //res.setEncoding('utf8'); res.on('data',
             * function (chunk) {
             *
             * console.log(data); console.log("body: " + chunk);
             * properties += chunk;
             * console.log("******************** Result
             * ******************"); console.log(properties);
             *
             * }); });
             *
             * req.write(data);
             *
             * req.end();
             *
             */
            properties = {
                "title" : service_name,
                "plan" : "default",
                "properties" : {
                    "instance" : "1",
                    "memory" : "512MB",
                    "price" : "0.0"
                }
            };
            properties = JSON.stringify(properties);
        } else {

            console.log("Service Details is not valid");
            var resjson = {
                "status" : "failed"
            };
            response.write(JSON.stringify(resjson));
            response.end();
        }

        setTimeout(
            function() {
                console.log("*** Request Responded ***");
                console.log(properties);
                var status = {
                    "result" : "catalog-name-not-found"
                };
                if (JSON.stringify(properties) == JSON
                        .stringify(status)) {
                    var resjson = {
                        "status" : "failed"
                    };
                    response.write(JSON.stringify(resjson));
                    response.end();
                }
                //

                // properties.NewField='catalog_name';
                // console.log(properties);
                // properties.body["catalog_name"]=service_name;
                // console.log("******************** after
                // catalog name
                // ******************");
                // console.log(properties);
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

                                    console
                                        .log("---------------------------------------------------------");
                                    console
                                        .log("Entering to insert into database");
                                    console
                                        .log("These are the data to insert in bluemix");
                                    console
                                        .log(properties);
                                    console
                                        .log("-------------------------------------------------");

                                    console
                                        .log(result.docs[0]);

                                    console
                                        .log("-------------------------------------------------");
                                    result.docs[0].service_details.bluemix[0].runtime[compcnt] = JSON
                                        .parse(properties);
                                    dbSoln
                                        .insert(
                                            result.docs[0],
                                            function(
                                                err2,
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

                                } else {
                                    var errMessage = "Error occurred while accessing components : \n"
                                        + JSON
                                            .stringify(err);
                                    // response.write(errMessage);
                                    console
                                        .log(errMessage);
                                    // response.end();
                                    console
                                        .log(responseMessage);
                                    setTimeout(
                                        function() {
                                            console
                                                .log("*** Request Responded ***");
                                            var resjson = {
                                                "status" : "failed"
                                            };
                                            response
                                                .write(JSON
                                                    .stringify(resjson));

                                            response
                                                .end();
                                        }, 1000);
                                }
                            });
                }
                    // response.end();
                    // console.log(responseMessage);
                catch (err) {
                    console.log("There is some error:")
                    console.log(err.stack);
                    console
                        .log("*** Request Responded ***");
                    var resjson = {
                        "status" : "failed"
                    };
                    response.write(JSON.stringify(resjson));
                }
            }, 5000);
    }

}



exports.getBluemixComponentlist = function(request, response) {
    initDBConnection();
    console.log("*** Request Received ***");
    var componentId = "Components";
    url = "http://api.ng.bluemix.net/v2/services";
    url1 = "http://api.ng.bluemix.net/v2/services?order-direction=asc&page=2&results-per-page=50";
    url2 = "http://api.ng.bluemix.net/v2/services?order-direction=asc&page=3&results-per-page=50";

    var DatajsonObj1 = {
        components_page1 : {

        }
    }
    var DatajsonObj2 = {
        components_page2 : {

        }
    }
    var DatajsonObj3 = {
        components_page3 : {

        }
    }
    var data = "";
    function download(url, callback) {
        http.get(url, function(res) {

            res.on('data', function(chunk) {
                data += chunk;
            });
            res.on("end", function() {
                callback(data);
            });
        }).on("error", function() {
            callback(null);
        });
    }

    var data1 = "";
    function download1(url1, callback) {
        http.get(url1, function(res1) {

            res1.on('data', function(chunk1) {
                data1 += chunk1;
            });
            res1.on("end", function() {
                callback(data1);
            });
        }).on("error", function() {
            callback(null);
        });
    }

    var data2 = "";
    function download2(url2, callback) {
        http.get(url2, function(res2) {

            res2.on('data', function(chunk2) {
                data2 += chunk2;
            });
            res2.on("end", function() {
                callback(data2);
            });
        }).on("error", function() {
            callback(null);
        });
    }

    download(url,function(data) {
        if (data) {
            console
                .log("Data 1 is ready to send and now sending....");

            // response.write(data);
            var Datajson = JSON.parse(data)
            // console.log("my response:
            // "+data1.resources[0].entity.label);
            console.log("my response: "
                + Datajson.resources.length);

            len = Datajson.resources.length;
            for (i = 0; i < len; i++) {
                var compcnt = "component" + i;
                var lbl = Datajson.resources[i].entity.label;
                console.log("my response: " + lbl);
                DatajsonObj1.components_page1[compcnt] = lbl;
            }
            // console.log(DatajsonObj);
            // response.write(JSON.stringify(DatajsonObj));

            // response.write("-----------------------------------------------------------------------------------");
            // response.write(output);
            // console.log("*** Response Sent ***");
            // response.end();
        } else
            console.log("error");
    });

    download1(
        url1,
        function(data1) {
            if (data1) {
                console
                    .log("Data 2 is ready to send and now sending....");

                // response.write(data);
                var Datajson1 = JSON.parse(data1)
                // console.log("my response:
                // "+data1.resources[0].entity.label);
                console.log("my response: "
                    + Datajson1.resources.length);
                page1 = 50
                len1 = Datajson1.resources.length;
                for (i = 0; i < len1; i++) {
                    page2 = page1 + i;
                    var compcnt = "component" + page2;
                    var lbl = Datajson1.resources[i].entity.label;
                    console.log("my response: " + lbl);
                    DatajsonObj2.components_page2[compcnt] = lbl;
                }
                // console.log(DatajsonObj);
                // response.write(JSON.stringify(DatajsonObj));

                // response.write("-----------------------------------------------------------------------------------");
                // response.write(output);
                // console.log("*** Response Sent ***");
                // response.end();
            } else
                console.log("error");
        });

    download2(
        url2,
        function(data2) {
            if (data2) {
                console
                    .log("Data  3 is ready to send and now sending....");

                // response.write(data);

                var Datajson2 = JSON.parse(data2)
                // console.log("my response:
                // "+data1.resources[0].entity.label);
                console.log("my response: "
                    + Datajson2.resources.length);
                page2 = 100
                len2 = Datajson2.resources.length;
                for (i = 0; i < len2; i++) {
                    page3 = page2 + i
                    var compcnt = "component" + page3;
                    var lbl = Datajson2.resources[i].entity.label;
                    console.log("my response: " + lbl);
                    DatajsonObj3.components_page3[compcnt] = lbl;
                }

                // response.write("-----------------------------------------------------------------------------------");
                // response.write(output);
                // console.log("*** Response Sent ***");
                // response.end();
            } else
                console.log("error");
        });

    setTimeout(function() {
        console.log("*** Request Responded ***");
        console.log(DatajsonObj1);
        console.log(DatajsonObj2);
        console.log(DatajsonObj3);
        response.write(JSON.stringify(DatajsonObj1));
        response.write(JSON.stringify(DatajsonObj2));
        response.write(JSON.stringify(DatajsonObj3));
        response.end();
    }, 5000);

}

exports.getBluemixComponentLists = function(request, response) {
    console.log("*** Request Received ***");
    initDBConnection();
    db = cloudant.use(dbCredentials.dbTmpBluemix);
    var docList = [];
    var componenttitle = [];
    var i = 1;
    db
        .list(function(err, result) {
            // console.log("*** Request Received *** " +
            // JSON.stringify(result));
            if (!err) {
                var len = result.rows.length;
                console
                    .log("*** Total number of records *** "
                        + len);
                if (len == 0) {
                    response
                        .write("Sorry for inconvenience! We are feeding data at this moment!");
                    console
                        .log("Sorry for inconvenience! We are feeding data at this moment!");
                    response.end();
                    console.log(responseMessage);
                }
                result.rows
                    .forEach(function(document) {
                        // console.log("*** Entered into
                        // loop *** " +
                        // JSON.stringify(document));
                        db
                            .get(
                                document.id,
                                function(err,
                                         doc) {
                                    // console.log("***
                                    // Fetched
                                    // record
                                    // for " +
                                    // JSON.stringify(doc));
                                    if (!err) {
                                        docList.push(doc);
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

exports.getBluemixComponentlists = function(request, response) {
    console.log("*** Request Received ***");
    initDBConnection();
    db = cloudant.use(dbCredentials.dbTmpBluemix);
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
                db.get(
                    document.id,function(err,doc) {
                        if (!err) {
                            docList.push(doc);

                            if (i >= len) {
                                docListJson = JSON.stringify(docList);
                                // console.log(docListJson);
                                var docListJson1 = JSON.parse(docListJson);
                                console.log(docListJson1);
                                response.write(JSON.stringify(docList));
                                console.log('Components are successfully fetched');
                                response.end();
                                console.log(responseMessage);
                            }
                        } else {
                            err.id = document.id;
                            docList.push(err);
                            var errMessage = "Error occurred while accessing components : \n"+ JSON.stringify(err);
                            console.log(errMessage);
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

exports.getBluemixServices = function(request, response) {
    console.log(requestMessage);
    initDBConnection();
    db = cloudant.use(dbCredentials.dbBluemix_services);

    var org_url = "http://api.ng.bluemix.net";
    url = "http://api.ng.bluemix.net/v2/services?order-direction=asc&page=1&results-per-page=100";
    url2 = "http://api.ng.bluemix.net/v2/services?order-direction=asc&page=2&results-per-page=100";
    api_url = [];
    full_url = [];

    var data = "";
    function download(url, callback) {
        http.get(url, function(res) {

            res.on('data', function(chunk) {
                data += chunk;
            });
            res.on("end", function() {
                callback(data);
            });
        }).on("error", function() {
            callback(null);
        });
    }

    download(url,function(data) {
        if (data) {
            console.log("Data 1 is ready to send and now sending....");

            // response.write(data);
            var Datajson_page1 = JSON.parse(data);
            // console.log("my response:
            // "+data1.resources[0].entity.label);
            console.log("my response: "+ Datajson_page1.resources.length);
            var total_page = Datajson_page1.total_pages;
            console.log("Total pages: " + total_page);
            console.log("Prev URL:"+ Datajson_page1.prev_url);
            console.log("NextURL:"+ Datajson_page1.next_url);

            len = Datajson_page1.resources.length;
            console.log("Length" + len);
            for (i = 0; i < len; i++) {
                var compcnt = "component" + i;
                var lbl = Datajson_page1.resources[i];
                // console.log("my response:
                // "+i+":"+JSON.stringify(lbl));

                db.insert(lbl,function(err, result) {
                    if (!err) {
                        console
                            .log("Fetched and inserted record");

                    } else {
                        console.log("Error in inserting data");
                        response.write("Error");
                    }
                });
            }
        } else {
            console.log("Error in data reception");
        }
    });

    var data1 = "";
    function download2(url2, callback) {
        http.get(url2, function(res1) {

            res1.on('data', function(chunk1) {
                data1 += chunk1;
            });
            res1.on("end", function() {
                callback(data1);
            });
        }).on("error", function() {
            callback(null);
        });
    }

    download2(url2,function(data1) {
        if (data1) {
            console
                .log("Data 2 is ready to send and now sending....");

            // response.write(data);
            // var Datajson_page1=JSON.parse(data);
            var Datajson_page1 = JSON.parse(data1);
            console.log(Datajson_page1);
            // console.log("my response:
            // "+data1.resources[0].entity.label);
            // console.log("my response:
            // "+Datajson_page1.resources.length);
            var total_page = Datajson_page1.total_pages;
            console.log("Total pages: " + total_page);
            console.log("Prev URL:"
                + Datajson_page1.prev_url);
            console.log("NextURL:"
                + Datajson_page1.next_url);

            len = Datajson_page1.resources.length;
            console.log("Length" + len);
            // len=100+len;
            for (i = 0; i < len; i++) {
                var compcnt = "component" + i;
                var lbl = Datajson_page1.resources[i];
                // console.log("my response:
                // "+i+":"+JSON.stringify(lbl));

                db.insert(lbl,function(err, result) {
                    if (!err) {
                        console
                            .log("Fetched and inserted record");
                    } else {
                        consol.log("Error in inserting data");
                        response.write("Error");
                    }
                });
            }
        } else {
            console.log("Error in data reception");
        }
    });

    var token;

    var request = http.get(
        "http://cbicportal.mybluemix.net/api/getbluemixtoken",
        function(response) {
            console.log(response.statusCode);
            // Read the Data
            response.on('data', function(chunk) {
                console.log('BODY: ' + chunk)
                token += chunk;
            });
            // Parse the data
            // Print the data
        });

    request.on("error", function(error) {
        console.error(error.message);
    })

    console.log(token);
    // token = JSON.parse(token);
    // console.log(token);
}

exports.getBluemixServicesList = function(request, response) {
    console.log("*** Request Received ***");
    initDBConnection();
    db = cloudant.use(dbCredentials.dbBluemix_services);
    var docList = [];
    var componenttitle = [];
    var i = 1;
    var output = [];
    try {
        db.list(function(err, result) {
            if (!err) {
                var len = result.rows.length;
                console.log("*** Total number of records *** "+len);
                if (len == 0) {
                    response.write("Sorry for inconvenience! We are feeding data at this moment!");
                    console.log("Sorry for inconvenience! We are feeding data at this moment!");
                    response.end();
                    console.log(responseMessage);
                }
                result.rows.forEach(function(document) {

                    db.get(document.id,function(err,doc) {

                        if (!err) {


                            docList.push(doc);



                            if (i >= len) {

                                docListJson = JSON.stringify(docList);
                                // console.log(docListJson);

                                var docListJson1 = JSON.parse(docListJson);
                                // console.log(docListJson1);

                                doc_count = docListJson1.length;
                                console.log("Total Records:"+ doc_count);
                                var titles = [];
                                var label = [];

                                console.log(docListJson1);
                                for (i = 0; i < doc_count; i++) {
                                    if(docListJson1[i]!=null) {
                                        if(docListJson1[i].hasOwnProperty("entity")) {
                                            if(docListJson1[i].entity!=null && docListJson1[i].entity!=undefined) {
                                                if(docListJson1[i].entity.hasOwnProperty("display_name") && docListJson1[i].entity.hasOwnProperty("label")) {
                                                    if (!docListJson1[i].language) {
                                                        titles[i] = docListJson1[i].entity.display_name;
                                                        label[i] = docListJson1[i].entity.label;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                for (i = 0; i < doc_count; i++) {
                                    //if(titles[i] !== undefined && label[i] !== undefined ) {
                                        output[i] = {
                                            "title": titles[i],
                                            "label": label[i],
                                            "icon": "/images/MSP_Logos/IBM.png"
                                        };
                                    //}
                                }
                                console.log(output);

                                response.write(JSON.stringify(output));
                                console.log('Components are successfully fetched');
                                response.end();
                                console.log(responseMessage);
                            }
                        } else {
                            err.id = document.id;
                            docList.push(err);
                            var errMessage = "Error occurred while accessing components : \n"+ JSON.stringify(err);
                            console.log(errMessage);
                        }
                        i++;
                    });

                });
            } else {
                console.log("Error while fetching services list from server");
                failure_response.description = "Error while fetching services list from server"
                response.write(JSON.stringify(failure_response));
                console.log(errMessage);
                response.end();
                console.log(responseMessage);
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

exports.old_getBluemixBuildpackList = function(request, response) {
    console.log("*** Request Received ***");
    initDBConnection();
    db = cloudant.use(dbCredentials.dbBluemix_buildpack);

    var docList = [];
    var componenttitle = [];
    var i = 1;
    try {
        db.list(function(err, result) {

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

                    db.get(document.id,function(err,doc) {

                        if (!err) {
                            docList.push(doc);

                            if (i >= len) {

                                docListJson = JSON.stringify(docList);
                                console.log(docListJson);

                                var docListJson1 = JSON.parse(docListJson);
                                console.log(docListJson1);

                                if(docListJson1 != null && docListJson1 != undefined){
                                    if(docListJson1[0] != null && docListJson1[0] != undefined) {
                                        if(docListJson1[0].hasOwnProperty("resources")) {
                                            if(docListJson1[0].resources != null && docListJson1[0].resources != undefined) {
                                                doc_count = docListJson1[0].resources.length;
                                                console.log("Total Records:" + doc_count);
                                                var titles = [];
                                                var output = [];

                                                for (i = 0; i < doc_count; i++) {
                                                    titles[i] = docListJson1[0].resources[i].entity.label;
                                                }

                                                titles = titles.sort();

                                                for (i = 0; i < doc_count; i++) {

                                                    output[i] = {
                                                        "title": titles[i],
                                                        "icon": "/images/MSP_Logos/IBM.png"
                                                    };
                                                }
                                                console.log(output);
                                                response.write(JSON.stringify(output));
                                                console.log('Components are successfully fetched');
                                                response.end();
                                                console.log(responseMessage);
                                            }
                                            else {
                                                console.log("Error while fetching services list from server");
                                                failure_response.description = "Error while fetching services list from server"
                                                response.write(JSON.stringify(failure_response));
                                                console.log(errMessage);
                                                response.end();
                                                console.log(responseMessage);
                                            }
                                        }
                                        else {
                                            console.log("Error while fetching services list from server");
                                            failure_response.description = "Error while fetching services list from server"
                                            response.write(JSON.stringify(failure_response));
                                            console.log(errMessage);
                                            response.end();
                                            console.log(responseMessage);
                                        }
                                    }
                                    else {
                                        console.log("Error while fetching services list from server");
                                        failure_response.description = "Error while fetching services list from server"
                                        response.write(JSON.stringify(failure_response));
                                        console.log(errMessage);
                                        response.end();
                                        console.log(responseMessage);
                                    }
                                }
                                else {
                                    console.log("Error while fetching services list from server");
                                    failure_response.description = "Error while fetching services list from server"
                                    response.write(JSON.stringify(failure_response));
                                    console.log(errMessage);
                                    response.end();
                                    console.log(responseMessage);
                                }
                            }
                        } else {
                            err.id = document.id;
                            docList.push(err);
                            var errMessage = "Error occurred while accessing components : \n"+ JSON.stringify(err);
                            console.log(errMessage);
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





exports.getBluemixBuildpackList = function(request, response) {
    console.log("*** Request Received ***");
    db = cloudant.use(dbCredentials.dbBluemix_buildpack);

    var docList = [];
    var componenttitle = [];
    var i = 1;
    var titles = [];
    var output = [];
    var labels = [];
    try {
        db.find({selector: {service:"runtime"}},function(err, result) {

            if (!err) {

                docList = result.docs;
                docListJson = JSON.stringify(docList);
                console.log("doc list printing", docListJson);

                var docListJson1 = JSON.parse(docListJson);
                console.log(docListJson1);
                console.log("no of docs", docListJson1.length);

                for(var j=0;j<docListJson1.length;j++){

                if (docListJson1[j] != null && docListJson1[j] != undefined) {
                    if (docListJson1[j] != null && docListJson1[j] != undefined) {
                        if (docListJson1[j].hasOwnProperty("resources")) {
                            if (docListJson1[j].resources != null && docListJson1[j].resources != undefined) {
                                /*doc_count = docListJson1.resources.length;
                                 console.log("Total Records:" + doc_count);*/
                                    titles[j] = docListJson1[j].resources[0].entity.display_name;
                                    labels[j] = docListJson1[j].resources[0].entity.label;

                                console.log("title",titles[j]);


                                //titles = titles.sort();



                                    output[j] = {
                                        "title": titles[j],
                                        "label": labels[j],
                                        "icon": "/images/MSP_Logos/IBM.png"
                                    };

                                console.log("output",output[j]);



                            }
                            else {
                                console.log("Error while fetching services list from server 1");
                                failure_response.description = "Error while fetching services list from server"
                                response.write(JSON.stringify(failure_response));
                                console.log(errMessage);
                                response.end();
                                console.log(responseMessage);
                            }
                        }
                        else {
                            console.log("Error while fetching services list from server 2");
                            failure_response.description = "Error while fetching services list from server"
                            response.write(JSON.stringify(failure_response));
                            console.log(errMessage);
                            response.end();
                            console.log(responseMessage);
                        }
                    }
                    else {
                        console.log("Error while fetching services list from server 3");
                        failure_response.description = "Error while fetching services list from server"
                        response.write(JSON.stringify(failure_response));
                        console.log(errMessage);
                        response.end();
                        console.log(responseMessage);
                    }
                }
                else {
                    console.log("Error while fetching services list from server 4");
                    failure_response.description = "Error while fetching services list from server"
                    response.write(JSON.stringify(failure_response));
                    console.log(errMessage);
                    response.end();
                    console.log(responseMessage);
                }
            }
                console.log(output);
                response.write(JSON.stringify(output));
                console.log('Components are successfully fetched');
                response.end();
                console.log(responseMessage);




            } else {
                var errMessage = "Error occurred while accessing components : \n"
                    + JSON.stringify(err);
                response.write(errMessage);
                console.log(errMessage);
                response.end();
                console.log(responseMessage);
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


exports.AddBMComponentToCanvas = function(request, response) {
    console.log(requestMessage);
    console.log("*************************************************************************")
    initDBConnection();
    var dbSoln = cloudant.use(dbCredentials.dbSolution);

    var username = request.body.uname;
    var SolName = request.body.solnName;
    console.log(request.body);
    var service_det = request.body.service_details;
    var service_name = request.body.service_name;
    var compcnt = request.body.component_cnt;
    var properties = [];
    // console.log("Response from body: "+solutionJson);
    // console.log(JSON.stringify(solutionJson));
    // response.write(JSON.stringify(solutionJson));

    if (username == null) {
        console
            .log("no sufficient details. returning false info");
        response.write("{result:failed}");
        response.end();
    } else if (SolName == null) {
        console
            .log("no sufficient details. returning false info");
        response.write("{result:failed}");
        response.end();
    } else if (service_name == null) {
        console
            .log("no sufficient details. returning false info");
        response.write("{result:failed}");
        response.end();
    } else if (compcnt == null) {
        console
            .log("no sufficient details. returning false info");
        response.write("{result:failed}");
        response.end();
    }

    else {

        if (service_det == "bluemix") {

            var data = JSON.stringify({
                "title" : service_name
            });

            console.log(data.length);

            // This should moved to cloudant and make it
            // parameterised
            var options = {
                host : 'cbicportal.mybluemix.net',
                path : '/api/getbluemixServicesproperties',
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                    'Content-Length' : data.length

                }
            };

            console.log(data);

            var req = http
                .request(
                    options,
                    function(res) {
                        // res.setEncoding('utf8');
                        res
                            .on(
                                'data',
                                function(chunk) {

                                    console
                                        .log(data);
                                    console
                                        .log("body: "
                                            + chunk);
                                    properties += chunk;
                                    console
                                        .log("******************** Result ******************");
                                    console
                                        .log(properties);
                                    properties = JSON
                                        .stringify(properties);
                                    // properties=JSON.parse(properties);
                                    properties = JSON
                                        .parse(properties);

                                });
                    });

            req.write(data);

            req.end();

        } else {

            console.log("Service Details is not valid");
            var resjson = {
                "status" : "failed"
            };
            response.write(JSON.stringify(resjson));
            response.end();
        }

        setTimeout(
            function() {
                console.log("*** Request Responded ***");
                console.log(properties);
                var status = {
                    "result" : "catalog-name-not-found"
                };
                if (JSON.stringify(properties) == JSON
                        .stringify(status)) {
                    var resjson = {
                        "status" : "failed"
                    };
                    response.write(JSON.stringify(resjson));
                    response.end();
                }
                //

                // properties.NewField='catalog_name';
                // console.log(properties);
                // properties.body["catalog_name"]=service_name;
                // console.log("******************** after
                // catalog name
                // ******************");
                // console.log(properties);
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

                                    console
                                        .log("---------------------------------------------------------");
                                    console
                                        .log("Entering to insert into database");
                                    console
                                        .log("These are the data to insert in bluemix");
                                    console
                                        .log(properties);
                                    // properties1=JSON.stringify(properties);

                                    console
                                        .log("-------------------------------------------------");

                                    console
                                        .log(result.docs[0]);

                                    console
                                        .log("-------------------------------------------------");
                                    result.docs[0].service_details.bluemix[0].services[compcnt] = JSON
                                        .parse(properties);
                                    dbSoln
                                        .insert(
                                            result.docs[0],
                                            function(
                                                err2,
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

                                } else {
                                    var errMessage = "Error occurred while accessing components : \n"
                                        + JSON
                                            .stringify(err);
                                    // response.write(errMessage);
                                    console
                                        .log(errMessage);
                                    // response.end();
                                    console
                                        .log(responseMessage);
                                    setTimeout(
                                        function() {
                                            console
                                                .log("*** Request Responded ***");
                                            var resjson = {
                                                "status" : "failed"
                                            };
                                            response
                                                .write(JSON
                                                    .stringify(resjson));

                                            response
                                                .end();
                                        }, 1000);
                                }
                            });
                }
                    // response.end();
                    // console.log(responseMessage);
                catch (err) {
                    console.log("There is some error:")
                    console.log(err.stack);
                    console
                        .log("*** Request Responded ***");
                    var resjson = {
                        "status" : "failed"
                    };
                    response.write(JSON.stringify(resjson));
                }
            }, 10000);
    }

}

exports.v1_AddBMComponentToCanvas = function(request, response) {
    console.log(requestMessage);
    console.log("*************************************************************************")
    initDBConnection();
    var dbSoln = cloudant.use(dbCredentials.dbSolution);

    if(request.body == null) {
        console.log("There is no data in body");
        failure_response.description = "There is no data in body"
        response.write(JSON.stringify(failure_response));
        response.end();
    }
    else if(request.body.hasOwnProperty("uname") && request.body.hasOwnProperty("solnName") && request.body.hasOwnProperty("service_name") && request.body.hasOwnProperty("component_cnt")) {

        var username = request.body.uname;
        var SolName = request.body.solnName;
        console.log(request.body);
        var service_det = request.body.service_details;
        var service_name = request.body.service_name;
        var compcnt = request.body.component_cnt;
        var properties = [];
        var options={};

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
            var data={};
            AddBMComponentToCanvas();
        }
    }
    else{
        console.log("Request details are not valid");
        failure_response.description="Request details are not valid"
        response.write(JSON.stringify(failure_response));
        response.end();
    }

    function AddBMComponentToCanvas(){
        if (service_det == "bluemix") {

            data = JSON.stringify({
                "title": service_name
            });

            options = {
                host: 'cbicportal.mybluemix.net',
                path: '/api/getbluemixServicesproperties',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': data.length

                }
            };

            var req = http.request(options,function (res) {
                // res.setEncoding('utf8');
                res.on('data',function (chunk) {

                    console.log(data);
                    console.log("body: "+ chunk);
                    properties += chunk;
                    console.log("******************** Result ******************");
                    console.log(properties);
                    properties = JSON.stringify(properties);
                    // properties=JSON.parse(properties);
                    properties = JSON.parse(properties);

                });
                res.on('end',function (err,result) {
                    if (!err) {
                        console.log("*** Request Responded ***");
                        try {

                            dbSoln.find({selector: {solution_name: SolName}},
                                function (err,result) {
                                    if (!err) {

                                        console.log("---------------------------------------------------------");
                                        console.log("Entering to insert into database");
                                        console.log("Fetched records successfully");

                                        if (service_det == "bluemix") {
                                            console.log("Properties got from Bluemix Services:"+properties);
                                            var dbplan = cloudant.use("bluemixserviceplans");
                                            dbplan.find({selector:{"title":service_name}},function(err3,result3){
                                                for(var i=0;i<result3.docs[0].properties[0].length;i++){
                                                    result3.docs[0].properties[0][i].selected="false";
                                                }
                                                console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",result3.docs[0].properties);
                                                var d = new Date();
                                                var n = d.getTime();
                                                console.log("Time stamp",n);
                                                var service_name = result3.docs[0].title + n;
                                                console.log("Service name",service_name);
                                                if(result.docs !== null || result.docs !==undefined){
                                                    if(result.docs[0].hasOwnProperty("service_details") !== undefined || result.docs[0].service_details !== null) {
                                                        if (result.docs[0].hasOwnProperty("bluemix") !== undefined || result.docs[0].hasOwnProperty("bluemix") !==null) {
                                                            if (result.docs[0].bluemix !== null || (result.docs[0].bluemix[0].hasOwnProperty("services") !== null || result.docs[0].bluemix[0].hasOwnProperty("services") !== undefined)) {
                                                                result.docs[0].service_details.bluemix[0].services[compcnt] = {
                                                                    "title": result3.docs[0].title,
                                                                    "service_name": service_name,
                                                                    "properties": [ result3.docs[0].properties[0] ]
                                                                };
                                                                dbSoln.insert(result.docs[0], function (err2, result2) {
                                                                    console.log("response from insert");
                                                                    if (err2) {
                                                                        console.log(err2);
                                                                        console.log(errMessage);
                                                                        console.log("Error occurred while inserting components and values in database");
                                                                        failure_response.description = "Error occurred while accessing components : ";
                                                                        response.write(JSON.stringify(failure_response));
                                                                        response.end();
                                                                    } else {
                                                                        console.log("New doc created ..");
                                                                        console.log("*** Request Responded ***");
                                                                        response.write(JSON.stringify(success_response));
                                                                        response.end();
                                                                    }
                                                                });
                                                            }
                                                            else{
                                                                console.log("There is no property called bluemix services");
                                                                failure_response.description = "There is no property called msp";
                                                                response.write(JSON.stringify(failure_response));
                                                                response.end();
                                                            }
                                                        }
                                                        else{
                                                            console.log("There is no property called bluemix");
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

                                            });

                                        }
                                        else{
                                            console.log("There is no data in result");
                                            failure_response.description = "There is no data in result";
                                            response.write(JSON.stringify(failure_response));
                                            response.end();
                                        }

                                    } else {
                                        var errMessage = "Error occurred while accessing components : \n"+ JSON.stringify(err);
                                        console.log(errMessage);
                                        console.log(responseMessage);
                                        console.log("Error occurred while accessing components ");
                                        failure_response.description="Error occurred while accessing components : ";
                                        response.write(JSON.stringify(failure_response));
                                        response.end();
                                    }
                                });
                        }
                        catch (err) {
                            console.log(responseMessage);
                            console.log("Error occurred while accessing components ");
                            failure_response.description="Error occurred while accessing components : ";
                            response.write(JSON.stringify(failure_response));
                            response.end();
                        }

                    } else {
                        console.log(responseMessage);
                        console.log("Error occurred while accessing components ");
                        failure_response.description="Error occurred while accessing components : ";
                        response.write(JSON.stringify(failure_response));
                        response.end();
                    }

                });
            });

            req.write(data);

            req.end();

        } else {
            console.log(responseMessage);
            console.log("service details are not valid");
            failure_response.description="service details are not valid";
            response.write(JSON.stringify(failure_response));
            response.end();
        }
    }
}

exports.v1_AddBMRuntimeToCanvas = function(request, response) {
    console.log(requestMessage);
    console.log("*************************************************************************")
    initDBConnection();
    var dbSoln = cloudant.use(dbCredentials.dbSolution);


    if(request.body == null) {
        console.log("There is no data in body");
        failure_response.description = "There is no data in body"
        response.write(JSON.stringify(failure_response));
        response.end();
    }
    else if(request.body.hasOwnProperty("uname") && request.body.hasOwnProperty("solnName") && request.body.hasOwnProperty("service_name") && request.body.hasOwnProperty("component_cnt")) {

        var username = request.body.uname;
        var SolName = request.body.solnName;
        console.log(request.body);
        var service_det = request.body.service_details;
        var service_name = request.body.service_name;
        var compcnt = request.body.component_cnt;
        var properties = {};
        // console.log("Response from body: "+solutionJson);
        // console.log(JSON.stringify(solutionJson));
        // response.write(JSON.stringify(solutionJson));

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
            var data = {};
            AddBMRuntimeToCanvas();
        }

    }
    else {
        console.log(responseMessage);
        console.log("Request details are not valid");
        failure_response.description="Request details are not valid";
        response.write(JSON.stringify(failure_response));
        response.end();
    }


    function AddBMRuntimeToCanvas() {
        if (service_det == "runtime") {

            properties = {
                "title": service_name,
                "plan": "default",
                "properties": {
                    "instance": "1",
                    "memory": "1024MB",
                    "price": "0.0"
                }
            };
            properties = JSON.stringify(properties);
        } else {
            console.log("Service details are not valid");
            failure_response.description = "Service details are not valid"
            response.write(JSON.stringify(failure_response));
            response.end();
        }
        try {
            dbSoln.find({selector: {solution_name: SolName}},function (err, result) {
                if (!err) {

                    console.log("---------------------------------------------------------");
                    console.log("Entering to insert into database");

                    if(result.docs !== null && result.docs !==undefined){
                        if(result.docs[0].hasOwnProperty("service_details") !== undefined && result.docs[0].service_details !== null) {
                            if (result.docs[0].service_details.hasOwnProperty("bluemix") !== undefined || result.docs[0].service_details.hasOwnProperty("bluemix") !==null) {
                                if (result.docs[0].service_details.bluemix !== null && result.docs[0].service_details.bluemix !== undefined && (result.docs[0].service_details.bluemix[0].hasOwnProperty("runtime") !== null && result.docs[0].service_details.bluemix[0].hasOwnProperty("runtime") !== undefined)) {

                                    result.docs[0].service_details.bluemix[0].runtime[compcnt] = JSON.parse(properties);
                                    dbSoln.insert(result.docs[0],function (err2,result2) {

                                        if (err2) {
                                            console.log(err2);
                                            console.log("Error occurred while inserting components ");
                                            failure_response.description = "Error occurred while inserting components "
                                            response.write(JSON.stringify(failure_response));
                                            response.end();
                                        }
                                        else{
                                            console.log("response from insert");
                                            console.log("*** Request Responded ***");
                                            response.write(JSON.stringify(success_response));
                                            response.end();
                                        }

                                    });

                                }
                                else{
                                    console.log("There is no property called bluemix runtime");
                                    failure_response.description = "There is no property bluemix runtime";
                                    response.write(JSON.stringify(failure_response));
                                    response.end();
                                }
                            }
                            else{
                                console.log("There is no property called bluemix");
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



                } else {
                    var errMessage = "Error occurred while accessing components : \n"+ JSON.stringify(err);
                    console.log(errMessage);
                    console.log("Error occurred while accessing components ");
                    failure_response.description = "Error occurred while accessing components "
                    response.write(JSON.stringify(failure_response));
                    response.end();
                }
            });
        }
        catch (err) {
            var err = "Error occurred while accessing components : \n"+ JSON.stringify(err);
            console.log(err);
            console.log("Error occurred while accessing components ");
            failure_response.description = "Error occurred while accessing components "
            response.write(JSON.stringify(failure_response));
            response.end();
        }
    }
}

exports.getBMServicePrice=function(reqst, resp) {

    var quantity = reqst.body.quantity;
    //var quantity = parseInt(qty);
    var country = reqst.body.country;
    console.log("Country ===="+country);
    //var compcnt = parseInt(reqst.body.cnt);
    var serviceplan_guid = reqst.body.serviceplan_guid;
    var service_name = reqst.body.service_name;
    var unit_id = reqst.body.unit_id;
    var price = null;

    console.log("Quantity:" + quantity);
    console.log("Country:" + country);
    var dbplan = cloudant.use("bluemixserviceplans");
    var dbdiscount = cloudant.use("serviceplan_discount");
    var final_price = 0.0;
    var price_cal = {};

    if (quantity === null) {
        resp.write("Quantity not provided");
        resp.end();
    }
    else if (country === null) {
        resp.write("please select a country");
        resp.end();
    }
    else if (service_name === null) {
        resp.write("Please provide service name");
        resp.end();
    }

    else if (unit_id === null) {
        resp.write("Please provide unit_id");
        resp.end();
    }
    else {
    dbplan.find({selector: {"title": service_name}}, function (err, result) {
        if (!err) {
            if (result.docs !== null || result.docs !== undefined) {
            if (result.docs[0].properties[0] !== undefined || result.docs[0].properties[0] !== null) {
                for (var i = 0; i < result.docs[0].properties[0].length; i++) {
                    var properties = result.docs[0].properties[0][i];
                    if (properties.metadata.guid === serviceplan_guid) {
                        if (properties.hasOwnProperty("entity") && properties.entity !== undefined && properties.entity !== null) {
                            if (properties.entity.hasOwnProperty("extra") && properties.entity.extra !== undefined && properties.entity.extra !== null) {
                                if (properties.entity.extra.hasOwnProperty("costs") && properties.entity.extra.costs !== undefined && properties.entity.extra.costs !== null) {
                                    for (var j = 0; j < properties.entity.extra.costs.length; j++) {
                                        if (properties.entity.extra.costs[j].unitId === unit_id)
                                            price_cal = properties.entity.extra.costs[j].currencies;
                                    }
                                    // var price_cal = properties.entity.extra.costs[0].currencies;
                                    dbdiscount.find({selector: {"guid": serviceplan_guid}}, function (err1, result1) {
                                        console.log(unit_id);
                                        console.log("Printing result===="+JSON.stringify(result1.docs[0]));
                                        var discount = result1.docs[0].cost_plan[unit_id];
                                        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$", discount);
                                        if (discount === "free") {
                                            final_price = 0.0;
                                            resp.status(200).send(final_price.toString());
                                            //resp.send(final_price);
                                            resp.end();
                                        }
                                        else {
                                            // discount = parseInt(discount);
                                            if (country === "IND") {
                                                console.log(i);
                                                console.log("***************************", price_cal[14].amount.INR);
                                                var actual_price = parseFloat(price_cal[14].amount.INR);

                                                final_price = (quantity - discount) * actual_price;
                                                console.log("Finallll",final_price);
                                                final_price = parseFloat(final_price).toFixed(2);

                                                console.log(final_price);
                                                if (final_price < 0) {
                                                    final_price = 0.0;
                                                    resp.status(200).send(final_price.toString());
                                                    //resp.send(final_price);
                                                    resp.end();
                                                }
                                                else {
                                                    resp.status(200).send(final_price.toString());
                                                    resp.end();
                                                }


                                            }
                                            if (country === "USD") {
                                                console.log("***************************", price_cal[25].amount.USD);
                                                var actual_price = price_cal[25].amount.USD;
                                                console.log("vsfvsf", actual_price);

                                                final_price = (quantity - discount) * actual_price;
                                                console.log("dhuvhdvadv", final_price);
                                                if (final_price < 0) {
                                                    final_price = 0.0;
                                                    resp.status(200).send(final_price.toString());
                                                    //resp.send(final_price);
                                                    resp.end();
                                                }
                                                else {
                                                    resp.status(200).send(final_price.toString());
                                                    resp.end();
                                                }

                                            }

                                        }
                                    });
                                }
                                else {
                                    final_price = 0.0;
                                    resp.status(200).send(final_price.toString());
                                    //resp.send(final_price);
                                    resp.end();
                                    console.log("There's no property costs");
                                }
                            }
                            else {
                                resp.write("0.0");
                                resp.end();
                                console.log("There's no property extra");
                            }
                        }
                        else {
                            resp.write("There's no property entity");
                            resp.end();
                            console.log("There's no property entity");
                        }


                    }
                    else {
                        console.log(i);
                        /*if(i === (result.docs[0].properties[0].length -1)){
                         console.log(result.docs[0].properties[0].length - 1);
                         resp.write("There is no matching guid for this service. Please select another");
                         resp.end();
                         }*/

                        console.log("There is no matching guid for this service. Please select another");
                    }
                }
                // console.log(final_price);

                /*resp.write("There is no matching guid for this service. Please select another");
                 resp.end();*/
            }
            else {
                resp.write("There's no properties for this service");
                resp.end();
                console.log("There's no properties for this service")
            }
        }
        else{
                resp.write("No data returned");
                resp.end();
            }


        }

        else {
            resp.write("There is some error");
            console.log("There is some error");
        }


    });
}


}