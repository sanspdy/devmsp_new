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
var http = require('http');
var querystring = require('querystring');
var db;

var requestMessage = "*** Message Received ***";
var responseMessage = "*** Message Responded ***";

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


// Initiating Database connection function
initDBConnection();





exports.v2_getCanvasInfo=function(reqst, resp) {
    console.log("*** Request Received ***");
    var SolName = reqst.body.soln_name;
    var username = reqst.body.uname;
    var version=parseInt(reqst.body.version);

    console.log("Get canvas info for" + SolName);
    var dbSoln = cloudant.use(dbCredentials.dbSolution);

    if (SolName == null) {
        console.log("no sufficient details. returning false info");
        failure_response.description = "no sufficient details. returning false info";
        resp.write(JSON.stringify(failure_response));
        resp.end();
    } else{

        dbSoln.find({selector : {solution_name: SolName, user: username, version:version}}, function(err, result) {
            if (!err) {
                if(result.docs[0]!=null)
                {
                    if(result.docs[0].hasOwnProperty("canvas_details")){
                        var canvas=result.docs[0].canvas_details
                        console.log("Canvas Details \n"+canvas);
                        var services=result.docs[0].service_details;
                        var datatosend={"canvas":canvas,"services":services};
                        resp.write(JSON.stringify(datatosend));
                        resp.end();
                    }
                    else{
                        console.log("There is no property called canvas_details");
                        console.log("*** Request Responded ***");
                        failure_response.description = "There is no property called canvas_details";
                        resp.write(JSON.stringify(failure_response));
                        resp.end();
                    }
                }
                else{
                    console.log("There is no such solution.");
                    console.log("*** Request Responded ***");
                    failure_response.description = "There is no such solution.";
                    resp.write(JSON.stringify(failure_response));
                    resp.end();
                }

            }
            else {
                var errMessage = "Error occurred while accessing components : \n"
                    + JSON.stringify(err);
                console.log(responseMessage);
                console.log("*** Request Responded ***");
                failure_response.description = "Error occurred while accessing components";
                resp.write(JSON.stringify(failure_response));
                resp.end();
            }
        });
    }
}



exports.v2_removeComponentFromSolutiondb=function(request, response) {
    console.log(requestMessage);
    console
        .log("*************************************************************************")
    var dbSoln = cloudant.use(dbCredentials.dbSolution);

    var username = request.body.uname;
    var SolName = request.body.solnName;
    var version=parseInt(request.body.version);
    console.log(request.body);
    var service_det = request.body.service_details;
    var service_name = request.body.service_name;
    var compcnt = request.body.component_cnt;

    var msp_comp_list = [];
    var msp_comp_list_deleted = [];
    var bluemix_comp_list = [];
    var bluemix_comp_list_deleted = [];
    var bluemix_runtime_list = [];
    var bluemix_runtime_list_deleted = [];
    // console.log(" removeComponentFromSolutiondb - Response
    // from body: "+);
    // console.log(JSON.stringify(solutionJson));
    // response.write(JSON.stringify(solutionJson));

    try {dbSoln.find({selector : {solution_name: SolName, user: username, version:version}},
        function(err, result) {
            if (!err) {
                if (service_det == "msp") {

                    console.log("result.docs[0].service_details.msp"+ result.docs[0].service_details.msp);
                    msp_comp_list = result.docs[0].service_details.msp;

                    console.log("msp_comp_list"+ msp_comp_list);
                    msp_comp_list_deleted = msp_comp_list.splice(compcnt, 1);

                    console.log("msp_comp_list_deleted"+ msp_comp_list_deleted);

                    result.docs[0].service_details.msp = msp_comp_list;

                    console.log("msp_comp_list"+ msp_comp_list);

                    console.log("result.docs[0].service_details.msp"+ result.docs[0].service_details.msp);
                    dbSoln.insert(result.docs[0],function(err2,result2) {
                        console.log("response from insert");
                        if (err2) {
                            console.log(err2);
                        } else {
                            console.log("New doc created ..");
                            var resjson = {
                                "status" : "success"
                            };
                            response.write(JSON.stringify(resjson));
                        }
                        response.end();
                    });
                } else if (service_det == "bluemix") {
                    // result.docs[0].service_details.bluemix[compcnt]=null;

                    console.log("result.docs[0].service_details.bluemix[0].services"+ result.docs[0].service_details.bluemix[0].services);
                    bluemix_comp_list = result.docs[0].service_details.bluemix[0].services;

                    console.log("bluemix_comp_list"+ bluemix_comp_list);
                    bluemix_comp_list_deleted = bluemix_comp_list.splice(compcnt, 1);

                    console.log("bluemix_comp_list_deleted"+ bluemix_comp_list_deleted);

                    result.docs[0].service_details.bluemix[0].services = bluemix_comp_list;

                    console.log("bluemix_comp_list"+ bluemix_comp_list);

                    console.log("result.docs[0].service_details.bluemix[0].services"+ result.docs[0].service_details.bluemix[0].services);

                    dbSoln.insert(result.docs[0],function(err2,result2) {
                        console.log("response from insert");
                        if (err2) {
                            console.log(err2);
                        } else {
                            console.log("New doc created ..");
                            var resjson = {
                                "status" : "success"
                            };
                            response.write(JSON.stringify(resjson));
                            response.end();

                        }

                    });
                } else if (service_det == "runtime") {

                    console.log("result.docs[0].service_details.bluemix[0].runtime[compcnt]"+ result.docs[0].service_details.bluemix[0].runtime);
                    bluemix_runtime_list = result.docs[0].service_details.bluemix[0].runtime;

                    console.log("bluemix_runtime_list"+ bluemix_runtime_list);
                    bluemix_runtime_list_deleted = bluemix_runtime_list
                        .splice(compcnt, 1);

                    console
                        .log("bluemix_runtime_list_deleted"
                            + bluemix_runtime_list_deleted);

                    result.docs[0].service_details.bluemix[0].runtime = bluemix_runtime_list;

                    console
                        .log("bluemix_runtime_list"
                            + bluemix_runtime_list);

                    console
                        .log("result.docs[0].service_details.bluemix[0].runtime"
                            + result.docs[0].service_details.bluemix[0].runtime);

                    dbSoln
                        .insert(
                            result.docs[0],
                            function(
                                err2,
                                result2) {
                                console
                                    .log("response from insert");
                                // console.log("response
                                // from
                                // insert
                                // " +
                                // JSON.stringify(solutionJson));
                                if (err2) {
                                    console
                                        .log(err2);
                                } else {
                                    console
                                        .log("New doc created ..");
                                    var resjson = {
                                        "status" : "success"
                                    };
                                    response
                                        .write(JSON
                                            .stringify(resjson));
                                    response
                                        .end();

                                }

                            });
                } else {
                    var errMessage = "Error in Service Details";
                    response.write(errMessage);
                    var resjson = {
                        "status" : "failed"
                    };
                    response
                        .write(JSON
                            .stringify(resjson));
                }
            } else {
                var errMessage = "Error occurred while accessing components : \n"
                    + JSON.stringify(err);
                // response.write(errMessage);
                console.log(errMessage);
                // response.end();
                var resjson = {
                    "status" : "failed"
                };
                response.write(JSON
                    .stringify(resjson));
                response.end();
                console.log(responseMessage);
            }
        });

        console.log(responseMessage);
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


exports.v2_viewBillOfMaterial = function(request, response) {

    console.log(requestMessage);
    console.log("*************************************************************************")

    var dbSoln = cloudant.use(dbCredentials.dbSolution);

    // var username=request.body.uname;
    var SolName = request.query.solnName;
    var version=parseInt(request.query.version);
    var username = request.query.uname;

    console.log("Solution Name: " + JSON.stringify(SolName));

    if (SolName === null) {
        console
            .log("no sufficient details. returning false info");
        var resjson = {
            "status": "No Solution present",
        };
        response.write(JSON.stringify(resjson));
        response.end();
    }
    else{
        try {
            dbSoln.find({selector: {solution_name: SolName, user: username, version:version}},
                function (err, result) {
                    if (!err) {
                        if (result.docs[0]) {
                            if (result.docs[0].hasOwnProperty("service_details") !== undefined && result.docs[0].hasOwnProperty("service_details") !== null) {
                                if (result.docs[0].service_details.hasOwnProperty("msp") !== undefined && result.docs[0].service_details.hasOwnProperty("msp") !== null) {
                                    if (result.docs[0].service_details.hasOwnProperty("bluemix") !== undefined && result.docs[0].service_details.hasOwnProperty("bluemix") !== null) {
                                        if (result.docs[0].service_details.bluemix[0] !== undefined && result.docs[0].service_details.bluemix[0] !== null){
                                            if (result.docs[0].service_details.bluemix[0].hasOwnProperty("runtime") !== undefined) {

                                                // var
                                                // services=
                                                // result.docs[0].service_details.msp[compcnt];

                                                // result.docs[0].canvas_details[0]=canvas_info;
                                                // result.docs[0].connection_info.msp.middleware_comp[0]=connection_info;
                                                // console.log(result.docs[0].canvas_details[0]);
                                                var msp_services = [];
                                                var blumix_services = [];
                                                var blumix_runtime = [];
                                                var final_msp_totalprice = 0;
                                                var final_msp_licenseprice = 0;
                                                var final_runtime_price = 0;
                                                var final_price = 0;
                                                var priceJson = [];

                                                msp_services = result.docs[0].service_details.msp;
                                                console.log("MSP Service:" + msp_services);

                                                blumix_services = result.docs[0].service_details.bluemix;
                                                console.log("Bluemix Service:" + msp_services);

                                                blumix_runtime = result.docs[0].service_details.bluemix[0].runtime;
                                                console.log("Bluemix Runtime:" + blumix_runtime);

                                                var msp_len = msp_services.length;
                                                console.log("MSP Length:" + msp_len);

                                                var blumix_len = blumix_runtime.length;
                                                console.log("Bluemix Runtime Length:" + blumix_len);

                                                /*
                                                 * msp_services=JSON.parse(msp_services);
                                                 * console.log("MSP
                                                 * Json:"+msp_services);
                                                 *
                                                 * blumix_services=JSON.parse(blumix_services);
                                                 * console.log("Bluemix
                                                 * Json:"+blumix_services);
                                                 */

                                                for (i = 0; i < msp_len; i++) {
                                                    if (msp_services[i] !== undefined) {
                                                        if (msp_services[i].hasOwnProperty("priceDetails") !== undefined) {
                                                            if (msp_services[i].priceDetails === undefined) {
                                                                console
                                                                    .log("Requested service is returning null");
                                                                var resjson = {
                                                                    "status": "failed",
                                                                };
                                                                response.write(JSON.stringify(resjson));
                                                                response.end();
                                                            } else {
                                                                tot_price = parseInt(msp_services[i].priceDetails.TotalPrice);
                                                                lic_price_var = msp_services[i].priceDetails["Total License Cost"];
                                                                tot_lic_price = parseInt(lic_price_var);
                                                                console.log("Total Price " + i + ":" + tot_price);
                                                                final_msp_totalprice = (tot_price) + (final_msp_totalprice);

                                                                console.log("Total License Cost" + i + ":" + tot_lic_price);
                                                                final_msp_licenseprice = (tot_lic_price) + (final_msp_licenseprice);
                                                            }
                                                        }
                                                        else {
                                                            console.log("There is no price details for some components. Error ")
                                                            console.log(err);
                                                            console.log("*** Request Responded ***");
                                                            var resjson = {
                                                                "status": "failed"
                                                            };
                                                            response.write(JSON.stringify(resjson));
                                                            response.end();
                                                        }
                                                    }
                                                    else {
                                                        console.log("There is no price details for some components. Error ")
                                                        console.log(err);
                                                        console.log("*** Request Responded ***");
                                                        var resjson = {
                                                            "status": "failed"
                                                        };
                                                        response.write(JSON.stringify(resjson));
                                                        response.end();
                                                    }

                                                }

                                                for (i = 0; i < blumix_len; i++) {
                                                    if (blumix_runtime[i].hasOwnProperty("properties") !== undefined) {

                                                        if (blumix_runtime[i].properties.hasOwnProperty("price") !== undefined) {
                                                            if ( blumix_runtime[i].properties=== null ||blumix_runtime[i].properties.price === null || blumix_runtime[i].properties.price === undefined) {
                                                                console
                                                                    .log("Requested service is returning null");
                                                                var resjson = {
                                                                    "status": "failed",
                                                                };
                                                                response.write(JSON.stringify(resjson));
                                                                response.end();
                                                            } else {
                                                                runtime_price = parseInt(blumix_runtime[i].properties.price);
                                                                console.log("Runtime price:" + runtime_price);
                                                                final_runtime_price = (runtime_price) + (final_runtime_price);
                                                            }
                                                        }

                                                        else {
                                                            console.log("There is no price details for some components. Error ")
                                                            console.log(err);
                                                            console.log("*** Request Responded ***");
                                                            var resjson = {
                                                                "status": "failed",
                                                                "description": "There is no price details in bluemix"
                                                            };
                                                            response.write(JSON.stringify(resjson));
                                                            response.end();
                                                        }
                                                    }
                                                    else {
                                                        console.log("There is property for that component ")
                                                        console.log(err);
                                                        console.log("*** Request Responded ***");
                                                        var resjson = {
                                                            "status": "failed",
                                                            "description": "There is no property in bluemix"
                                                        };
                                                        response.write(JSON.stringify(resjson));
                                                        response.end();
                                                    }
                                                }

                                                final_price = (final_runtime_price)
                                                    + (final_msp_licenseprice)
                                                    + (final_msp_totalprice);

                                                console.log("Final Total Price:");
                                                console.log(final_msp_totalprice);
                                                console.log(final_msp_licenseprice);
                                                priceJson = JSON
                                                    .stringify({
                                                        "msp": msp_services,
                                                        "bluemix": blumix_services,
                                                        "Final_MSP_Price": final_msp_totalprice,
                                                        "Final_MSP_License_Price": final_msp_licenseprice,
                                                        "Final_Runtime_Price": final_runtime_price,
                                                        "Final_Price": final_price
                                                    });
                                                console.log(priceJson);
                                                response.write(priceJson);
                                                response.end();
                                            }
                                            else {
                                                console.log("There is no property called runtime ")
                                                console.log(err);
                                                console.log("*** Request Responded ***");
                                                var resjson = {
                                                    "status": "failed"
                                                };
                                                response.write(JSON.stringify(resjson));
                                                response.end();
                                            }
                                        }else {
                                            console.log("There is no data in bluemix ")
                                            console.log(err);
                                            console.log("*** Request Responded ***");
                                            var resjson = {
                                                "status": "failed",
                                                "description":"There is no data in bluemix"
                                            };
                                            response.write(JSON.stringify(resjson));
                                            response.end();
                                        }
                                    }
                                    else {
                                        console.log("There is no property called bluemix ")
                                        console.log(err);
                                        console.log("*** Request Responded ***");
                                        var resjson = {
                                            "status": "failed"
                                        };
                                        response.write(JSON.stringify(resjson));
                                    }
                                }
                                else {
                                    console.log("There is no property called msp ")
                                    console.log(err);
                                    console.log("*** Request Responded ***");
                                    var resjson = {
                                        "status": "failed"
                                    };
                                    response.write(JSON.stringify(resjson));
                                    response.end();
                                }
                            }
                            else {
                                console.log("There is no property called service details ")
                                console.log(err);
                                console.log("*** Request Responded ***");
                                var resjson = {
                                    "status": "failed"
                                };
                                response.write(JSON.stringify(resjson));
                            }
                        }
                        else {
                            console.log("There is no document available")
                            console.log(err);
                            console.log("*** Request Responded ***");
                            var resjson = {
                                "status": "failed",
                                "description":"There is no such solution."
                            };
                            response.write(JSON.stringify(resjson));
                            response.end();
                        }

                    } else {
                        var errMessage = "Error occurred while accessing components : \n"
                            + JSON.stringify(err);
                        //response.write(errMessage);
                        console.log(errMessage);
                        // response.end();
                        console.log(responseMessage);
                        var resjson = {
                            "status": "failed",
                            "description":"There is no such solution. Check you solution name."
                        };
                        console.log(JSON.stringify(resjson));
                        response.write(JSON.stringify(resjson));
                        response.end();
                    }
                });
        } catch (err) {
            console.log("There is some error:")
            console.log(err);
            console.log("*** Request Responded ***");
            var resjson = {
                "status": "failed"
            };
            response.write(JSON.stringify(resjson));
        }
    }

}





exports.v2_viewMspBillofMaterial = function(request, response) {
    console.log(requestMessage);
    console
        .log("*************************************************************************")
    initDBConnection();
    var dbSoln = cloudant.use(dbCredentials.dbSolution);

    // var username=request.body.uname;
    var SolName = request.query.solnName;
    var version=parseInt(request.query.version);
    var username = request.body.uname;
    console.log("Solution Name: " + JSON.stringify(SolName));

    if (SolName === null) {
        console
            .log("no sufficient details. returning false info");
        var resjson = {
            "status": "No Solution present",
        };
        response.write(JSON.stringify(resjson));
        response.end();
    }
    else{
        try {
            dbSoln.find({selector: {solution_name: SolName, user: username, version:version}},
                function (err, result) {
                    if (!err) {
                        if (result.docs[0]) {
                            if (result.docs[0] !== undefined && result.docs[0] !== null && result.docs[0].hasOwnProperty("service_details") !== undefined && result.docs[0].service_details !== null ) {
                                if (result.docs[0].service_details.hasOwnProperty("msp") !== undefined && result.docs[0].service_details.msp !== null && result.docs[0].service_details.msp !== undefined ) {
                                    // var
                                    // services=
                                    // result.docs[0].service_details.msp[compcnt];

                                    // result.docs[0].canvas_details[0]=canvas_info;
                                    // result.docs[0].connection_info.msp.middleware_comp[0]=connection_info;
                                    // console.log(result.docs[0].canvas_details[0]);
                                    var msp_services = [];

                                    var final_msp_totalprice = 0;
                                    var final_msp_licenseprice = 0;
                                    var final_runtime_price = 0;
                                    var final_price = 0;
                                    var priceJson = [];

                                    msp_services = result.docs[0].service_details.msp;
                                    console.log("MSP Service:"+ msp_services);


                                    var msp_len = msp_services.length;
                                    console.log("MSP Length:"+ msp_len);

                                    for (i = 0; i < msp_len; i++) {
                                        if (msp_services[i] !== undefined) {
                                            if (msp_services[i].hasOwnProperty("priceDetails") !== undefined) {
                                                if (msp_services[i].priceDetails === undefined) {
                                                    console
                                                        .log("Requested service is returning null");
                                                    var resjson = {
                                                        "status": "failed",
                                                    };
                                                    response.write(JSON.stringify(resjson));
                                                    response.end();
                                                } else {
                                                    tot_price = parseInt(msp_services[i].priceDetails.TotalPrice);
                                                    lic_price_var = msp_services[i].priceDetails["Total License Cost"];
                                                    tot_lic_price = parseInt(lic_price_var);
                                                    console.log("Total Price "+ i+ ":"+ tot_price);
                                                    final_msp_totalprice = (tot_price)+ (final_msp_totalprice);

                                                    console.log("Total License Cost"+ i+ ":"+ tot_lic_price);
                                                    final_msp_licenseprice = (tot_lic_price)+ (final_msp_licenseprice);
                                                }
                                            }
                                            else {
                                                console.log("There is no price details for some components. Error ")
                                                console.log(err);
                                                console.log("*** Request Responded ***");
                                                var resjson = {
                                                    "status": "failed"
                                                };
                                                response.write(JSON.stringify(resjson));
                                                response.end();
                                            }
                                        }
                                        else {
                                            console.log("There is no price details for some components. Error ")
                                            console.log(err);
                                            console.log("*** Request Responded ***");
                                            var resjson = {
                                                "status": "failed"
                                            };
                                            response.write(JSON.stringify(resjson));
                                            response.end();
                                        }

                                    }

                                    final_price = (final_runtime_price)
                                        + (final_msp_licenseprice)
                                        + (final_msp_totalprice);

                                    console.log("Final Total Price:");
                                    console.log(final_msp_totalprice);
                                    console.log(final_msp_licenseprice);
                                    priceJson = JSON
                                        .stringify({
                                            "msp": msp_services,
                                            "Final_MSP_Price": final_msp_totalprice,
                                            "Final_MSP_License_Price": final_msp_licenseprice,
                                            "Final_Price": final_price
                                        });
                                    // priceJson=JSON.stringify([
                                    // msp_services
                                    // ,
                                    // blumix_services,
                                    // {
                                    // "Final_Price"
                                    // :
                                    // final_msp_totalprice,
                                    // "Final_License_Price"
                                    // :
                                    // final_msp_licenseprice
                                    // } ]);
                                    console.log(priceJson);
                                    response.write(priceJson);
                                    response.end();

                                }
                                else {
                                    console.log("There is no property called msp ")
                                    console.log(err);
                                    console.log("*** Request Responded ***");
                                    var resjson = {
                                        "status": "failed"
                                    };
                                    response.write(JSON.stringify(resjson));
                                    response.end();
                                }
                            }
                            else {
                                console.log("There is no property called service details ")
                                console.log(err);
                                console.log("*** Request Responded ***");
                                var resjson = {
                                    "status": "failed"
                                };
                                response.write(JSON.stringify(resjson));
                            }
                        }
                        else {
                            console.log("There is no document available")
                            console.log(err);
                            console.log("*** Request Responded ***");
                            var resjson = {
                                "status": "failed",
                                "description":"There is no such solution."
                            };
                            response.write(JSON.stringify(resjson));
                            response.end();
                        }

                    } else {
                        var errMessage = "Error occurred while accessing components : \n"
                            + JSON.stringify(err);
                        //response.write(errMessage);
                        console.log(errMessage);
                        // response.end();
                        console.log(responseMessage);
                        var resjson = {
                            "status": "failed",
                            "description":"There is no such solution. Check you solution name."
                        };
                        console.log(JSON.stringify(resjson));
                        response.write(JSON.stringify(resjson));
                        response.end();
                    }
                });
        } catch (err) {
            console.log("There is some error:")
            console.log(err);
            console.log("*** Request Responded ***");
            var resjson = {
                "status": "failed"
            };
            response.write(JSON.stringify(resjson));
        }
    }

}



exports.v2_AddComponentToCanvas = function(request, response) {
    console.log(requestMessage);
    console.log("*************************************************************************")
    initDBConnection();
    var dbSoln = cloudant.use(dbCredentials.dbSolution);

    /*if(typeof request.body ===JSON){
     console.log("Type is Json")
     }*/

    if(request.body == null) {
        console.log("There is no data in body");
        failure_response.description = "There is no data in body"
        response.write(JSON.stringify(failure_response));
        response.end();
    }
    else if(request.body.hasOwnProperty("uname") && request.body.hasOwnProperty("solnName") && request.body.hasOwnProperty("service_details") && request.body.hasOwnProperty("service_name")  && request.body.hasOwnProperty("component_cnt")) {

        console.log(request.body);

        var username = request.body.uname;
        var SolName = request.body.solnName;
        var version=parseInt(request.body.version);
        var service_det = request.body.service_details;
        var service_name = request.body.service_name;
        var compcnt = request.body.component_cnt;


        if (username === null || username === '') {
            console.log("There is no username in body");
            failure_response.description = "There is no username in body"
            response.write(JSON.stringify(failure_response));
            response.end();
        } else if (SolName === null || SolName === '' && version === null || version === '') {
            console.log("There is no SolName and version in body");
            failure_response.description = "There is no SolName and version in body"
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
            addcomponent();
        }
    }

    else{
        console.log("There is no username, solution name, solution description defined in body");
        failure_response.description="There is no username, solution name, solution description defined in body"
        response.write(JSON.stringify(failure_response));
        response.end();
    }

    function addcomponent(){

        //write actual functions here...
        var data = JSON.stringify({
            "catalog_name" : service_name
        });

        console.log(data.length);

        var properties = "";
        // This should moved to cloudant and make it
        // parameterised
        var options = {
            host : '5.10.122.180',
            port : 9092,
            path : '/CBSMSP/rest/item/basePrice',
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',
                'Content-Length' : data.length

            },
            // rejectUnauthorized: false,
            // requestCert: true,
            // agent: false
        };

        console.log(data);

        var req = http.request(options,function(res) {
            // res.setEncoding('utf8');
            res.on('data',function(chunk) {

                console.log(data);
                console.log("body: "+ chunk);
                properties += chunk;
                console.log("******************** Result ******************");
                console.log(properties);

            });
            // res.on('error',function(err,result) {
            //     console.log("Error while fetching data from IMI Server. Please try later");
            //     failure_response.description = "Error while fetching data from IMI Server. Please try later"
            //     response.write(JSON.stringify(failure_response));
            //     response.end();
            // });
            res.on('end',function(err,result) {

                if (!err) {
                    var status = {
                        "result" : "catalog-name-not-found"
                    };
                    if (JSON.stringify(properties) == JSON.stringify(status)) {
                        var resjson = {
                            "status" : "failed"
                        };
                        response.write(JSON.stringify(resjson));
                        response.end();
                    }
                    try {
                        dbSoln.find({selector : {solution_name: SolName, user: username, version:version }},
                            function(err,result) {
                                if (!err) {
                                    if (service_det == "msp") {

                                        console.log("Properties got from IMI Services:"+properties);
                                        console.log('result ========= '+typeof(result.docs));

                                        if(result.docs[0] !== null && result.docs[0] !== undefined){

                                            if(result.docs[0].hasOwnProperty("service_details") !== undefined && result.docs[0].service_details !== null) {

                                                if (result.docs[0].hasOwnProperty("msp") !== undefined) {
                                                    //Assigning the properties into MSP array in solution DB
                                                    result.docs[0].service_details.msp[compcnt] = JSON.parse(properties);

                                                    //Inserting the updated JSON in solution DB
                                                    dbSoln.insert(result.docs[0],function(err2,result2) {
                                                        console.log("response from insert");
                                                        if (err2) {
                                                            console.log(err2);
                                                            console.log("Error in insertion");
                                                            failure_response.description = "Error in insertion of data";
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
                                    else{
                                        console.log("Service details are not msp");
                                        failure_response.description = "Service details are not msp";
                                        response.write(JSON.stringify(failure_response));
                                        response.end();
                                    }

                                } else {
                                    var errMessage = "Error occurred while accessing components : \n"+ JSON.stringify(err);
                                    // response.write(errMessage);
                                    console.log(errMessage);

                                    console.log("Error occurred while accessing components");
                                    failure_response.description = "Error occurred while accessing components";
                                    response.write(JSON.stringify(failure_response));
                                    response.end();
                                    console.log(responseMessage);
                                }
                            });
                    }
                        // response.end();
                        // console.log(responseMessage);
                    catch (err) {
                        console.log("There is some error:")
                        console.log(err.stack);
                        console.log("*** Request Responded ***");

                        console.log("Error occurred while accessing components");
                        failure_response.description = "Error occurred while accessing components";
                        response.write(JSON.stringify(failure_response));
                        response.end();

                    }
                } else {
                    console.log("There is some error:")
                    console.log(err.stack);
                    console.log("*** Request Responded ***");

                    console.log("Error occurred while accessing components");
                    failure_response.description = "Error occurred while accessing components";
                    response.write(JSON.stringify(failure_response));
                    response.end();

                }
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
}



exports.modifysolutionversion=function (request, response) {

    console.log(requestMessage);

    var dbSoln = cloudant.use(dbCredentials.dbSolution);

    if(request.body == null) {
        console.log("There is no data in body");
        failure_response.description = "There is no data in body"
        response.write(JSON.stringify(failure_response));
        response.end();
    }
    else if(request.body.hasOwnProperty("uname") && request.body.hasOwnProperty("version") && request.body.hasOwnProperty("solnName") && request.body.hasOwnProperty("solnDesc") ) {

        var username = request.body.uname;
        var SolName = request.body.solnName;
        var date = new Date();
        var SolDesc = request.body.solnDesc;
        var old_version=parseInt(request.body.version);
        var totalversion=0;
        var new_solutionJson;
        //var new_version= parseInt(old_version)+1;
        // var new_version=request.body.version;
        // var existing_solution=request.body.solution;


        if (username === null) {
            console.log("no username details. returning false info");
            failure_response.description = "no username details."
            response.write(JSON.stringify(failure_response));
            response.end();
        } else if (SolName === null) {
            console.log("no solution name details. returning false info");
            failure_response.description = "no solution name details. "
            response.write(JSON.stringify(failure_response));
            response.end();
        }
        else if (SolDesc === null) {
            console.log("no solution description details. ");
            failure_response.description = "no solution description details. "
            response.write(JSON.stringify(failure_response));
            response.end();
        }
        else if (old_version === null) {
            console.log("no solution description details. ");
            failure_response.description = "no version details. "
            response.write(JSON.stringify(failure_response));
            response.end();
        }
        else {
            try {
                var abc={solution_name: SolName, user: username, version:old_version };
                console.log(abc);
                dbSoln.find({selector: {solution_name: SolName, user: username}}, function (err, resultofall) {
                    if (!err) {
                        
                        if (resultofall.docs[0] !== null && resultofall.docs[0] !== undefined) {
                            if (resultofall.docs[0].hasOwnProperty("solution_name") !== undefined && resultofall.docs[0].hasOwnProperty("solution_name") !== null) {

                                totalversion = resultofall.docs.length;

                                for(k=0;k<totalversion;k++){
                                    if(resultofall.docs[k].version === old_version){
                                        new_solutionJson = {
                                            "user": username,
                                            "solution_name": SolName,
                                            "type": "hybrid",
                                            "date_created": date,
                                            "solution_desc": SolDesc,
                                            "version":totalversion + 1,
                                            "provisioning_status": [{
                                                "msp_status": "Not submitted",
                                                "bluemix_status": "Not Submitted"
                                            }],
                                            "order_status":"saved",
                                            "service_details": {
                                                "msp": resultofall.docs[k].service_details.msp,
                                                "bluemix": resultofall.docs[k].service_details.bluemix
                                            },
                                            "canvas_details": resultofall.docs[k].canvas_details,
                                            "connection_info": {
                                                "msp": resultofall.docs[k].connection_info.msp,
                                                "bluemix": resultofall.docs[k].connection_info.bluemix
                                            }
                                        };
                                    }
                                }

                                // if(new_solutionJson === undefined){
                                //     failure_response.description = "You have entered wrong version. please give correct version to be modified"
                                //     response.write(JSON.stringify(failure_response));
                                //     response.end();
                                // }



                                console.log("----------new solution---------------");
                                console.log(new_solutionJson);


                                dbSoln.insert(new_solutionJson, function (err, result2) {
                                    console.log("response from insert");
                                    //console.log("response from insert "+ JSON.stringify(solutionJson));
                                    if (err) {
                                        console.log(err);
                                        failure_response.description = "error while inserting. please try again"
                                        response.write(JSON.stringify(failure_response));
                                        response.end();
                                    } else {
                                        console.log("New doc created ..");
                                        console.log(result2);

                                        dbSoln.find({selector: {user: username,solution_name: SolName,version:totalversion + 1}},function(err,doc) {

                                            var responsejson={"user": doc.docs[0].user,
                                                "solution_name": doc.docs[0].solution_name,
                                                "type": doc.docs[0].type,
                                                "version": doc.docs[0].version,
                                                "canvas_details":doc.docs[0].canvas_details,
                                            "service_details":doc.docs[0].service_details};
                                            response.write(JSON.stringify(responsejson));
                                            console.log(responseMessage);
                                            response.end();
                                        });



                                    }
                                });
                            }
                        }
                        else {
                            console.log("no solution exist. Please create new solution in name of this ");
                            failure_response.description = "no solution exist. Please create new solution in name of this"
                            response.write(JSON.stringify(failure_response));
                            response.end();
                        }
                    }
                    else{
                        console.log(err);
                        failure_response.description = "There is no such solution with version. Please check"
                        response.write(JSON.stringify(failure_response));
                        response.end();
                    }


                    // dbSoln.find({selector: {solution_name: SolName, user: username, version:old_version }}, function (err, result) {
                    //
                    //         console.log();
                    //
                    // });
                });
            }
            catch (err) {
                console.log("error while fetching existing solution")
                console.log(err.stack);
                console.log("*** Request Responded ***");
                failure_response.description = "error while fetching existing solution. please try again"
                response.write(JSON.stringify(failure_response));


            }
        }


    }

    else{
        console.log("There is no username, solution name, solution description defined in body");
        failure_response.description="There is no username, solution name, solution description defined in body. Please provide keys in following format: uname, solnName, solnDesc ";
        response.write(JSON.stringify(failure_response));
        response.end();
    }

}



exports.v1_viewMyDeployArch = function(request, response) {
    var username = request.query.uname;
    if(username==null){
        console.log("There is some error:");
        console.log("*** Request Responded ***");
        var resjson = {
            "status" : "failed",
            "description": "Please check username"
        };
        response.write(JSON.stringify(resjson));
        response.end();
    }
    else {

        console.log(requestMessage);
        console
            .log("*************************************************************************");
        var dbSoln = cloudant.use(dbCredentials.dbSolution);
        var solnames = [];
        var docList = [];
        var length=[];
        var doc_len;
        var soln_list={};
        var failure_response = {
            "status": "failed",
            "description": ""
        };
        var msplist=[];
        var hybridlist=[];

        var mspuniquelist = [], mspversionlist = [], prev1;
        var hybriduniquelist = [], hybridversionlist = [], prev2;

        dbSoln.find({selector : {user : username} },function(err, result) {
            if (!err) {
                console.log(JSON.stringify(result));
                length=result.length;
                console.log("Length of result:"+length);

                if (result != null) {
                    if (result.hasOwnProperty("docs")) {
                        console.log(result.docs);
                        if (result.docs != null) {
                            doc_len=result.docs.length;
                            console.log("Length of docs:"+doc_len);
                            for(i=0;i<doc_len;i++){
                                if(result.docs[i]!=null){
                                    if(result.docs[i].hasOwnProperty("solution_name")!==null || result.docs[i].hasOwnProperty("solution_name")!== undefined){


                                        solnames[i]=result.docs[i].solution_name;

                                        if(result.docs[i].type === "msp"){
                                            msplist.push(solnames[i]);
                                        }
                                        else{
                                            hybridlist.push(solnames[i]);
                                        }

                                    }
                                }
                            }
                            //soln_list={ "solution_names": solnames.sort(), "msp": msplist.sort(), "hybrid":hybridlist.sort() };


                            console.log("Near count function");
                            var msplist_withcounts=msplist_withcount(msplist);

                            function msplist_withcount(msplist){

                                console.log("Getting into msp list");

                                msplist.sort();
                                for ( var i = 0; i < msplist.length; i++ ) {
                                    if ( msplist[i] !== prev1 ) {
                                        mspuniquelist.push(msplist[i]);
                                        mspversionlist.push(1);
                                    } else {
                                        mspversionlist[mspversionlist.length-1]++;
                                    }
                                    prev1 = msplist[i];
                                }
                                return [mspuniquelist,mspversionlist];


                            };
                            var hybridlist_withcounts=hybridlist_withcount(hybridlist);
                            function hybridlist_withcount(hybridlist) {

                                console.log("Getting into hybrid list");
                                hybridlist.sort();
                                for ( var i = 0; i < hybridlist.length; i++ ) {
                                    if ( hybridlist[i] !== prev2 ) {
                                        hybriduniquelist.push(hybridlist[i]);
                                        hybridversionlist.push(1);
                                    } else {
                                        hybridversionlist[hybridversionlist.length-1]++;
                                    }
                                    prev2 = hybridlist[i];
                                }

                                return [hybriduniquelist,hybridversionlist];

                            }


                            soln_list={ "msp": msplist_withcounts, "hybrid":hybridlist_withcounts };
                            console.log(soln_list);
                            response.write(JSON.stringify(soln_list));
                            response.end();



                            // soln_list={ "msp": msplist.sort(), "hybrid":hybridlist.sort() };
                            // console.log(soln_list);
                            // response.write(JSON.stringify(soln_list));
                            // response.end();
                        }

                        else {
                            console.log("There is no docs in result");
                            failure_response.description="There is no docs in result"
                            response.write(JSON.stringify(failure_response));
                            response.end();
                        }

                    }
                    else {
                        console.log("There is no property docs in result");
                        failure_response.description="There is no docs in result"
                        response.write(JSON.stringify(failure_response));
                        response.end();
                    }
                }
                else {
                    console.log("There is value in result");
                    failure_response.description="There is no docs in result"
                    response.write(JSON.stringify(failure_response));
                    response.end();
                }
            }
            else {
                console.log("There is some error in finding data");
                failure_response.description="no data found"
                response.write(JSON.stringify(failure_response));
                response.end();
            }
        });
    }
}

exports.v2_viewMyDeployArchVersions = function(request, response) {
    var username = request.query.uname;
    var solname = request.query.solname;

    if(username==null){
        console.log("There is some error:");
        console.log("*** Request Responded ***");
        var resjson = {
            "status" : "failed",
            "description": "Please check username"
        };
        response.write(JSON.stringify(resjson));
        response.end();
    }
    else {

        console.log(requestMessage);
        console
            .log("*************************************************************************");
        var dbSoln = cloudant.use(dbCredentials.dbSolution);
        var solnames = [];
        var versioncnt=[];
        var docList = [];
        var length=[];
        var doc_len;
        var soln_list={};
        var failure_response = {
            "status": "failed",
            "description": ""
        };
        var msplist=[];
        var hybridlist=[];
        var provisioning_status=[{
            "msp_status": "Not submitted",
            "bluemix_status": "Not Submitted"
        }];

        var mspuniquelist = [], mspversionlist = [], prev1;
        var hybriduniquelist = [], hybridversionlist = [], prev2;

        dbSoln.find({selector : {user : username, solution_name: solname} },function(err, result) {
            if (!err) {
                length=result.length;
                console.log("Length of result:"+length);

                if (result != null) {
                    if (result.hasOwnProperty("docs")) {
                        console.log(result.docs);
                        if (result.docs != null) {
                            doc_len=result.docs.length;
                            console.log("Length of docs:"+doc_len);
                            for(i=0;i<doc_len;i++){
                                if(result.docs[i]!=null){
                                    if(result.docs[i].hasOwnProperty("solution_name")!==null || result.docs[i].hasOwnProperty("solution_name")!== undefined){


                                        solnames[i]=result.docs[i].solution_name;
                                        versioncnt[i]=result.docs[i].version;


                                        if(result.docs[i].type === "msp"){
                                            msplist.push({"version":versioncnt[i],"Status":result.docs[i].order_status});
                                        }
                                        else{
                                            hybridlist.push({"version":versioncnt[i],"Status":result.docs[i].order_status});
                                        }
                                        if(result.docs[i].order_status==="submitted"){
                                            provisioning_status=result.docs[i].provisioning_status;
                                        }

                                    }
                                }
                            }
                            //soln_list={ "solution_names": solnames.sort(), "msp": msplist.sort(), "hybrid":hybridlist.sort() };


                            // console.log("Near count function");
                            // var msplist_withcounts=msplist_withcount(msplist);
                            //
                            // function msplist_withcount(msplist){
                            //
                            //     console.log("Getting into msp list");
                            //
                            //     msplist.sort();
                            //     for ( var i = 0; i < msplist.length; i++ ) {
                            //         if ( msplist[i] !== prev1 ) {
                            //             mspuniquelist.push(msplist[i]);
                            //             mspversionlist.push(1);
                            //         } else {
                            //             mspversionlist[mspversionlist.length-1]++;
                            //         }
                            //         prev1 = msplist[i];
                            //     }
                            //     return [mspuniquelist,mspversionlist];
                            //
                            //
                            // };
                            // var hybridlist_withcounts=hybridlist_withcount(hybridlist);
                            // function hybridlist_withcount(hybridlist) {
                            //
                            //     console.log("Getting into hybrid list");
                            //     hybridlist.sort();
                            //     for ( var i = 0; i < hybridlist.length; i++ ) {
                            //         if ( hybridlist[i] !== prev2 ) {
                            //             hybriduniquelist.push(hybridlist[i]);
                            //             hybridversionlist.push(1);
                            //         } else {
                            //             hybridversionlist[hybridversionlist.length-1]++;
                            //         }
                            //         prev2 = hybridlist[i];
                            //     }
                            //
                            //     return [hybriduniquelist,hybridversionlist];
                            //
                            // }


                            soln_list={ "msp": msplist, "hybrid":hybridlist, "provisioning_status":provisioning_status };
                            console.log(soln_list);
                            response.write(JSON.stringify(soln_list));
                            response.end();



                            // soln_list={ "msp": msplist.sort(), "hybrid":hybridlist.sort() };
                            // console.log(soln_list);
                            // response.write(JSON.stringify(soln_list));
                            // response.end();
                        }

                        else {
                            console.log("There is no docs in result");
                            failure_response.description="There is no docs in result"
                            response.write(JSON.stringify(failure_response));
                            response.end();
                        }

                    }
                    else {
                        console.log("There is no property docs in result");
                        failure_response.description="There is no docs in result"
                        response.write(JSON.stringify(failure_response));
                        response.end();
                    }
                }
                else {
                    console.log("There is value in result");
                    failure_response.description="There is no docs in result"
                    response.write(JSON.stringify(failure_response));
                    response.end();
                }
            }
            else {
                console.log("There is some error in finding data");
                failure_response.description="no data found"
                response.write(JSON.stringify(failure_response));
                response.end();
            }
        });
    }
}



exports.v2_deleteSolutionVersion=function(request, response) {
    console.log(requestMessage);
    console.log("*************************************************************************")
    var dbSoln = cloudant.use(dbCredentials.dbSolution);
    var username = request.body.uname;
    var SolName = request.body.solnName;
    var versiontodelete=parseInt(request.body.version);
    console.log(request.body);
    if (username === null || SolName === null || versiontodelete===null || !request.body.hasOwnProperty("uname") || !request.body.hasOwnProperty("solnName") || !request.body.hasOwnProperty("version")  ) {
        console.log("no username,solution name,version details.");
        failure_response.description = "no username,solution name,version details."
        response.write(JSON.stringify(failure_response));
        response.end();
    }
    else{
        dbSoln.find({selector: {solution_name: SolName, user: username, version:versiontodelete }}, function (err, result) {
            if (!err) {
                if(result.docs !== null && result.docs !== undefined){
                    if(result.docs[0] !== null && result.docs[0] !== undefined) {
                        var sol_id = result.docs[0]._id
                        console.log(result.docs[0]._id);
                        var sol_rev = result.docs[0]._rev;
                        console.log(result.docs[0]._rev);
                        dbSoln.destroy(sol_id, sol_rev, function (err2, body, header) {
                            if (!err) {
                                console.log("Record Deleted ..");
                                console.log("*** Request Responded ***");
                                response.write(JSON.stringify(success_response));
                                response.end();
                            }
                            else {
                                console.log("Error while deleting solution");
                                failure_response.description = "Error while deleting solution";
                                response.write(JSON.stringify(failure_response));
                                response.end();
                            }
                        });
                    }
                    else {
                        console.log("There is no such record");
                        failure_response.description = "There is no such record";
                        response.write(JSON.stringify(failure_response));
                        response.end();
                    }
                }
                else {
                    console.log("There is no such record");
                    failure_response.description = "There is no such record";
                    response.write(JSON.stringify(failure_response));
                    response.end();
                }
            }
            else{
                console.log("Error while fetching solution");
                failure_response.description = "Error while fetching solution";
                response.write(JSON.stringify(failure_response));
                response.end();
            }
        });
    }
}


exports.v2_deleteSolution=function(request, response) {
    console.log(requestMessage);
    console.log("*************************************************************************")
    var dbSoln = cloudant.use(dbCredentials.dbSolution);
    var username = request.body.uname;
    var SolName = request.body.solnName;
    var rec_deleted=0;
    if (request.body == null ) {

        console.log("There is no data in body");
        failure_response.description = "There is no data in body";
        response.write(JSON.stringify(failure_response));
        response.end();
    }
    else if (request.body.hasOwnProperty("uname") && request.body.hasOwnProperty("solnName")) {

        dbSoln.find({selector: {solution_name: SolName}}, function (err, result) {
            if (!err) {
                var length=result.docs.length;
                if (result != null) {
                    if (result.hasOwnProperty("docs")) {
                        if (result.docs != null) {

                            for(i=0;i<length;i++){
                                console.log("ID:"+result.docs[i]._id);
                                console.log("REV ID:"+result.docs[i]._rev);
                                if (result.docs[i].hasOwnProperty("_id") != null) {
                                    if (result.docs[i].hasOwnProperty("_rev") != null) {
                                        setTimeout(function () {
                                        dbSoln.destroy(result.docs[i]._id, result.docs[i]._rev, function (err2, body, header) {
                                            if(err2){
                                                console.log(err2);
                                                failure_response.description = "error while deleting data"
                                                response.write(JSON.stringify(failure_response));
                                                response.end();
                                            }
                                            else{
                                                rec_deleted++;
                                            }
                                        });
                                        },1000);
                                    }
                                }
                            }
                            if(rec_deleted==length) {
                                console.log("Rec deleted..");
                                console.log("*** Request Responded ***");
                                response.write(JSON.stringify(success_response));
                                response.end();
                            }
                            else{
                                // console.log(err2);
                                failure_response.description = "error while deleting data"
                                response.write(JSON.stringify(failure_response));
                                response.end();
                            }
                        }
                    }
                }

            }
            else {
                console.log(err);
                failure_response.description = "error while fetching. please try again"
                response.write(JSON.stringify(failure_response));
                response.end();
            }
        });


    }
    else {

        console.log("Error in your request. Please check it.");
        failure_response.description = "Error in your request. Please check it.";
        response.write(JSON.stringify(failure_response));
        response.end();
    }
}


exports.updatestatus =  function(request, response) {
    //var status
    response.write("success");
    response.end();
}