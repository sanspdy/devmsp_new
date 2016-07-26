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

var success_response = {
    "status" : "success"
};

var failure_response = {
    "status" : "failed",
    "description" : ""
};

// Initiating Database connection function
initDBConnection();


//We are not using
exports.createSolution=function(request, response) {

    console.log(requestMessage);
    db = cloudant.use(dbCredentials.dbComponents);
    var dbSoln = cloudant.use(dbCredentials.dbSolution);
    // var solnId=request.query.solnId;
    var username = request.body.uname;
    var SolName = request.body.solnName;
    var date = new Date();
    var SolDesc = request.body.solnDesc;
    var solutionJson = {
        "user" : username,
        "solution_name" : SolName,
        "date_created" : date,
        "solution_desc" : SolDesc,
        "service_details" : {
            "msp" : [

            ],
            "bluemix" : [ {
                "services" : [

                ],
                "runtime" : [

                ]
            } ]
        },
        "canvas_details" : [

        ],
        "connection_info" : {
            "msp" : {
                "infra_det" : {
                    "resources" : {
                        "router_small_dev_customer" : {
                            "type" : "OS::Neutron::Router",
                            "properties" : {
                                "external_gateway_info" : {
                                    "network" : {
                                        "get_param" : "param_ext_gateway_small_dev_network"
                                    }
                                }
                            }
                        },
                        "network_small_dev_dmz" : {
                            "type" : "OS::Neutron::Net",
                            "properties" : {
                                "name" : {
                                    "get_param" : "param_dmz_network_small_dev_name"
                                }
                            }
                        },
                        "network_small_dev_core" : {
                            "type" : "OS::Neutron::Net",
                            "properties" : {
                                "name" : {
                                    "get_param" : "param_core_network_small_dev_name"
                                }
                            }
                        },
                        "subnet_small_dev_dmz" : {
                            "type" : "OS::Neutron::Subnet",
                            "properties" : {
                                "network_id" : {
                                    "get_resource" : "network_small_dev_dmz"
                                },
                                "cidr" : {
                                    "get_param" : "param_subnet_small_dev_dmz_cidr"
                                },
                                "gateway_ip" : {
                                    "get_param" : "param_subnet_small_dev_dmz_gateway_ip"
                                },
                                "allocation_pools" : [ {
                                    "start" : {
                                        "get_param" : "param_subnet_small_dev_dmz_start"
                                    },
                                    "end" : {
                                        "get_param" : "param_subnet_small_dev_dmz_end"
                                    }
                                } ]
                            }
                        },
                        "subnet_small_dev_core" : {
                            "type" : "OS::Neutron::Subnet",
                            "properties" : {
                                "network_id" : {
                                    "get_resource" : "network_small_dev_core"
                                },
                                "cidr" : {
                                    "get_param" : "param_subnet_small_dev_core_cidr"
                                },
                                "gateway_ip" : {
                                    "get_param" : "param_subnet_small_dev_core_gateway_ip"
                                },
                                "allocation_pools" : [ {
                                    "start" : {
                                        "get_param" : "param_subnet_small_dev_core_start"
                                    },
                                    "end" : {
                                        "get_param" : "param_subnet_small_dev_core_end"
                                    }
                                } ]
                            }
                        },
                        "ri_small_dev_dmz" : {
                            "type" : "OS::Neutron::RouterInterface",
                            "properties" : {
                                "router_id" : {
                                    "get_resource" : "router_small_dev_customer"
                                },
                                "subnet_id" : {
                                    "get_resource" : "subnet_small_dev_dmz"
                                }
                            }
                        },
                        "ri_small_dev_core" : {
                            "type" : "OS::Neutron::RouterInterface",
                            "properties" : {
                                "router_id" : {
                                    "get_resource" : "router_small_dev_customer"
                                },
                                "subnet_id" : {
                                    "get_resource" : "subnet_small_dev_core"
                                }
                            }
                        },
                        "fp_small_dev_iis" : {
                            "type" : "OS::Neutron::FloatingIP",
                            "properties" : {
                                "floating_network" : "msp11ext-net",
                                "port_id" : {
                                    "get_resource" : "port_small_dev_iis1_data"
                                }
                            }
                        },
                        "fp_small_dev_http" : {
                            "type" : "OS::Neutron::FloatingIP",
                            "properties" : {
                                "floating_network" : "msp11ext-net",
                                "port_id" : {
                                    "get_resource" : "port_small_dev_http1_data"
                                }
                            }
                        },
                        "fp_small_dev_workbench" : {
                            "type" : "OS::Neutron::FloatingIP",
                            "properties" : {
                                "floating_network" : "msp11ext-net",
                                "port_id" : {
                                    "get_resource" : "port_small_dev_workbench_data"
                                }
                            }
                        }
                    }
                },
                "middleware_comp" : [

                ]
            },
            "bluemix" : {

            }
        }
    };

    if (username == null) {
        console.log("no sufficient details. returning false info");
        var resjson = {
            "status" : "failed"
        };
        response.write(JSON.stringify(resjson));
        response.end();
    } else if (SolName == null) {
        console.log("no sufficient details. returning false info");
        var resjson = {
            "status" : "failed"
        };
        response.write(JSON.stringify(resjson));

        response.end();
    } else {
        try {
            dbSoln.insert(solutionJson, '', function(err, result2) {
                console.log("response from insert");
                console.log("response from insert "
                    + JSON.stringify(solutionJson));
                if (err) {
                    console.log(err);

                    var resjson = {
                        "status" : "failed"
                    };
                    response.write(JSON.stringify(resjson));

                    response.end();
                } else {
                    console.log("New doc created ..");

                    var resjson = {
                        "status" : "Success",
                    };
                    console.log()
                    response.write(JSON.stringify(resjson));
                    console.log(responseMessage);
                    response.end();
                }
                // response.end();
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

exports.modifySolution=function(request,response){
    console.log(requestMessage);

    var dbSoln = cloudant.use(dbCredentials.dbSolution);
    if(request.body == null) {
        console.log("There is no data in body");
        failure_response.description = "There is no data in body"
        response.write(JSON.stringify(failure_response));
        response.end();
    }
    else if(request.body.hasOwnProperty("uname") && request.body.hasOwnProperty("solnName") && request.body.hasOwnProperty("version")  ) {

        var username = request.body.uname;
        var solnName = request.body.solnName;
        var version=request.body.version;

        try {
            dbSoln.find({selector: {solution_name: solnName, user: username, version: version}}, function (err, result) {
                if (!err) {
                    if (result.docs[0] !== null && result.docs[0] !== undefined) {
                        if(result.docs[0].solution_name === solnName && result.docs[0].version === version ){
                            console.log("Response Sent");
                            response.write(JSON.stringify(result.docs));
                            response.end();
                        }
                        else{
                            console.log(err);
                            console.log(result.docs);
                            failure_response.description = "there is no such solution"
                            response.write(JSON.stringify(failure_response));
                            response.end();
                        }
                    }
                    else{
                        console.log(err);
                        failure_response.description = "there is no value in docs"
                        response.write(JSON.stringify(failure_response));
                        response.end();
                    }
                }
                else{
                    console.log(err);
                    failure_response.description = "error while inserting. please try again"
                    response.write(JSON.stringify(failure_response));
                    response.end();
                }
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
    else{
        console.log("There is no username, solution name, version defined in body");
        failure_response.description="There is no username, solution name, version defined in body. Please provide keys in following format: uname, solnName, solnDesc ";
        response.write(JSON.stringify(failure_response));
        response.end();
    }
}





exports.creatHybridSolution=function (request, response) {

    console.log(requestMessage);
    var dbSoln = cloudant.use(dbCredentials.dbSolution);

    //checking request body whether it is null
    if(request.body == null) {
        console.log("There is no data in body");
        failure_response.description = "There is no data in body"
        response.write(JSON.stringify(failure_response));
        response.end();
    }
    else if(request.body.hasOwnProperty("uname") && request.body.hasOwnProperty("solnName") && request.body.hasOwnProperty("solnDesc")) {
        // var solnId=request.query.solnId;
        var username = request.body.uname;
        var SolName = request.body.solnName;
        var date = new Date();
        var SolDesc = request.body.solnDesc;
        var solutionJson = {
            "user": username,
            "solution_name": SolName,
            "type": "hybrid",
            "date_created": date,
            "solution_desc": SolDesc,
            "version":1,
            "provisioning_status": [{
                "msp_status": "Not submitted",
                "bluemix_status": "Not Submitted"
            }],
            "order_status":"drafted",
            "service_details": {
                "msp": [],
                "bluemix": [{
                    "services": [],
                    "runtime": []
                }]
            },
            "canvas_details": [],
            "connection_info": {
                "msp": {},
                "bluemix": {}
            }
        };

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
        else {
            try {
                dbSoln.find({selector: {solution_name: SolName, user: username}}, function (err, result) {
                    if (!err) {
                        console.log(result.docs[0]);
                        if (result.docs[0] !== null && result.docs[0] !== undefined) {
                            if (result.docs[0].hasOwnProperty("solution_name") !== undefined || result.docs[0].hasOwnProperty("solution_name") !== null) {
                                if (result.docs[0].solution_name == SolName) {
                                    console.log("already exist solution name");
                                    failure_response.description = "Already exist solution name. Please modify"
                                    response.write(JSON.stringify(failure_response));
                                    response.end();
                                }
                            }
                        }
                        else {

                            dbSoln.insert(solutionJson, '', function (err, result2) {
                                console.log("response from insert");
                                //console.log("response from insert "+ JSON.stringify(solutionJson));
                                if (err) {
                                    console.log(err);

                                    failure_response.description = "error while inserting. please try again"
                                    response.write(JSON.stringify(failure_response));

                                    response.end();
                                } else {
                                    console.log(result2);
                                    console.log("New doc created ..");
                                    response.write(JSON.stringify(success_response));
                                    console.log(responseMessage);
                                    response.end();
                                }
                                // response.end();
                            });

                        }
                    }
                    else{
                        console.log(err);
                        failure_response.description = "error while inserting. please try again"
                        response.write(JSON.stringify(failure_response));

                        response.end();
                    }

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


exports.creatMpsSolution=function (request, response) {

    console.log(requestMessage);
    db = cloudant.use(dbCredentials.dbComponents);
    var dbSoln = cloudant.use(dbCredentials.dbSolution);

    //checking request body whether it is null
    if(request.body == null) {
        console.log("There is no data in body");
        failure_response.description = "There is no data in body"
        response.write(JSON.stringify(failure_response));
        response.end();
    }
    else if(request.body.hasOwnProperty("uname") && request.body.hasOwnProperty("solnName") && request.body.hasOwnProperty("solnDesc")){
        // var solnId=request.query.solnId;
        var username = request.body.uname;
        var SolName = request.body.solnName;
        var date = new Date();
        var SolDesc = request.body.solnDesc;
        var solutionJson = {
            "user": username,
            "solution_name": SolName,
            "type":"msp",
            "date_created": date,
            "solution_desc": SolDesc,
            "version":1,
            "provisioning_status": [{
                "msp_status": "Not submitted",
                "bluemix_status": "Not Submitted"
            }],
            "order_status":"drafted",
            "service_details": {
                "msp": []
            },
            "canvas_details": [],
            "connection_info": {
                "msp": {}
            }
        };

        if (username === null || username === '') {
            console.log("no username details. returning false info");
            failure_response.description="no username details."
            response.write(JSON.stringify(failure_response));
            response.end();
        } else if (SolName === null || SolName === '') {
            console.log("no solution name details. returning false info");
            failure_response.description="no solution name details. "
            response.write(JSON.stringify(failure_response));
            response.end();
        }
        else if (SolDesc === null || SolDesc === '') {
            console.log("no solution description details. ");
            failure_response.description="no solution description details. "
            response.write(JSON.stringify(failure_response));
            response.end();
        }
        else {
            try {
                dbSoln.find({selector: {solution_name: SolName, user: username}}, function (err, result) {
                    if (!err) {
                        console.log(result.docs[0]);
                        if (result.docs[0] !== null && result.docs[0] !== undefined) {
                            if (result.docs[0].hasOwnProperty("solution_name") !== undefined || result.docs[0].hasOwnProperty("solution_name") !== null) {
                                if (result.docs[0].solution_name == SolName) {
                                    console.log("already exist solution name");
                                    failure_response.description = "Solution Name already exist. Please change the solution name"
                                    response.write(JSON.stringify(failure_response));
                                    response.end();
                                }
                            }
                        }
                        else {
                            dbSoln.insert(solutionJson, '', function (err, result2) {
                                console.log("response from insert");
                                //console.log("response from insert "+ JSON.stringify(solutionJson));
                                if (err) {
                                    console.log(err);

                                    failure_response.description = "Error occured while creating a solution. Error while insertion"
                                    response.write(JSON.stringify(failure_response));

                                    response.end();
                                } else {
                                    console.log("New doc created ..");
                                    response.write(JSON.stringify(success_response));
                                    console.log(responseMessage);
                                    response.end();
                                }
                            });
                        }
                    }
                    else {
                        console.log(err);
                        failure_response.description = "error while inserting. please try again"
                        response.write(JSON.stringify(failure_response));
                        response.end();
                    }
                });
            } catch (err) {
                console.log("There is some error:")
                console.log(err.stack);
                console.log("*** Request Responded ***");
                failure_response.description="error while inserting. please try again"
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

exports.updateCanvasConnectionInfo=function(request, response) {
    console.log(requestMessage);
    console
        .log("*************************************************************************")
    var dbSoln = cloudant.use(dbCredentials.dbSolution);

    var username = request.body.uname;
    var SolName = request.body.solnName;
    // console.log(request.body);
    // var service_det=request.body.service_details;
    // var service_name=request.body.service_name;
    var canvas_info = request.body.canvasinfo;
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

                        result.docs[0].canvas_details[0] = canvas_info;
                        result.docs[0].connection_info.msp.middleware_comp[0] = connection_info;
                        console
                            .log(result.docs[0].canvas_details[0]);
                        console
                            .log(result.docs[0].connection_info.msp.middleware_comp[0]);
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

exports.updateCanvasInfo=function(request, response) {
    console.log(requestMessage);
    console
        .log("*************************************************************************")
    var dbSoln = cloudant.use(dbCredentials.dbSolution);

    var username = request.body.uname;
    var SolName = request.body.solnName;
    // console.log(request.body);
    // var service_det=request.body.service_details;
    // var service_name=request.body.service_name;
    var canvas_info = request.body.canvasinfo;
    // var connection_info = request.body.connectioninfo;
    // var solution_json=request.body.solnjson;
    //console.log("Response from body: "+ JSON.stringify(canvas_info));
    console.log(request.body);
    // console.log(JSON.stringify(solutionJson));
    // response.write(JSON.stringify(solutionJson));


    if (username == null) {
        console
            .log("no username details. returning false info");
        var resjson = {
            "status" : "failed",
        };
        response.write(JSON.stringify(resjson));
        response.end();
    } else if (SolName == null) {
        console
            .log("no solname details. returning false info");
        var resjson = {
            "status" : "failed",
        };
        response.write(JSON.stringify(resjson));
        response.end();
    } else if (canvas_info == null) {
        console
            .log("no canvasinfo details. returning false info");
        var resjson = {
            "status" : "failed",
        };
        response.write(JSON.stringify(resjson));
        response.end();
    }
    else{


        try {
            dbSoln.find({selector : {solution_name : SolName}
                },
                function(err, result) {
                    if (!err) {
                        if(result.docs[0]!=null) {
                            if (result.docs[0].hasOwnProperty("canvas_details")) {

                                result.docs[0].canvas_details[0] = canvas_info;

                                console.log(result.docs[0].canvas_details[0]);

                                dbSoln.insert(result.docs[0],function (err2,result2) {
                                    console.log("response from insert");
                                    console.log("response from insert "+ JSON.stringify(result));
                                    if (err) {
                                        console.log(err2);
                                    } else {
                                        console.log("New doc created ..");
                                        setTimeout(function () {
                                                console.log("*** Request Responded ***");
                                                console.log("Status Success");
                                                var resjson = {
                                                    "status": "success"
                                                };
                                                response.write(JSON.stringify(resjson));
                                                response.end();
                                            },
                                            500);
                                    }
                                });
                            }
                            else {
                                var errMessage = "Error occurred while accessing components : \n";
                                console.log(errMessage);
                                console.log("*** Request Responded ***");
                                var resjson = {
                                    "status": "failed"
                                };
                                response.write(JSON.stringify(resjson));
                                response.end();
                            }
                        }
                        else {
                            var errMessage = "Error occurred while accessing components : \n";
                            console.log(errMessage);
                            console.log("*** Request Responded ***");
                            var resjson = {
                                "status": "failed"
                            };
                            response.write(JSON.stringify(resjson));
                            response.end();
                        }

                    } else {
                        var errMessage = "Error occurred while accessing components : \n"
                            + JSON.stringify(err);

                        console.log(errMessage);

                        console.log(responseMessage);
                        setTimeout(
                            function() {
                                console
                                    .log("*** Request Responded ***");
                                var resjson = {
                                    "status" : "failed"
                                };
                                response.write(JSON.stringify(resjson));
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


exports.v2_updateCanvasInfo=function(request, response) {
    console.log(requestMessage);
    console
        .log("*************************************************************************")
    var dbSoln = cloudant.use(dbCredentials.dbSolution);

    var username = request.body.uname;
    var SolName = request.body.solnName;
    var version = parseInt(request.body.version);
    // console.log(request.body);
    // var service_det=request.body.service_details;
    // var service_name=request.body.service_name;
    var canvas_info = request.body.canvasinfo;
    // var connection_info = request.body.connectioninfo;
    // var solution_json=request.body.solnjson;
    //console.log("Response from body: "+ JSON.stringify(canvas_info));
    console.log(request.body);
    // console.log(JSON.stringify(solutionJson));
    // response.write(JSON.stringify(solutionJson));


    if (username == null) {
        console
            .log("no username details. returning false info");
        var resjson = {
            "status" : "failed",
        };
        response.write(JSON.stringify(resjson));
        response.end();
    } else if (SolName == null) {
        console
            .log("no solname details. returning false info");
        var resjson = {
            "status" : "failed",
        };
        response.write(JSON.stringify(resjson));
        response.end();
    } else if (canvas_info == null) {
        console
            .log("no canvasinfo details. returning false info");
        var resjson = {
            "status" : "failed",
        };
        response.write(JSON.stringify(resjson));
        response.end();
    }
    else{


        try {
            dbSoln.find({selector : {solution_name: SolName, user: username, version:version}
                },
                function(err, result) {
                    if (!err) {
                        if(result.docs[0]!=null) {
                            if (result.docs[0].hasOwnProperty("canvas_details")) {

                                result.docs[0].canvas_details[0] = canvas_info;

                                result.docs[0].order_status = "saved"

                                console.log(result.docs[0].canvas_details[0]);

                                dbSoln.insert(result.docs[0],function (err2,result2) {
                                    console.log("response from insert");
                                    console.log("response from insert "+ JSON.stringify(result));
                                    if (err) {
                                        console.log(err2);
                                    } else {
                                        console.log("New doc created ..");
                                        setTimeout(function () {
                                                console.log("*** Request Responded ***");
                                                console.log("Status Success");
                                                var resjson = {
                                                    "status": "success"
                                                };
                                                response.write(JSON.stringify(resjson));
                                                response.end();
                                            },
                                            500);
                                    }
                                });
                            }
                            else {
                                var errMessage = "Error occurred while accessing components : \n";
                                console.log(errMessage);
                                console.log("*** Request Responded ***");
                                var resjson = {
                                    "status": "failed"
                                };
                                response.write(JSON.stringify(resjson));
                                response.end();
                            }
                        }
                        else {
                            var errMessage = "Error occurred while accessing components : \n";
                            console.log(errMessage);
                            console.log("*** Request Responded ***");
                            var resjson = {
                                "status": "failed"
                            };
                            response.write(JSON.stringify(resjson));
                            response.end();
                        }

                    } else {
                        var errMessage = "Error occurred while accessing components : \n"
                            + JSON.stringify(err);

                        console.log(errMessage);

                        console.log(responseMessage);
                        setTimeout(
                            function() {
                                console
                                    .log("*** Request Responded ***");
                                var resjson = {
                                    "status" : "failed"
                                };
                                response.write(JSON.stringify(resjson));
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




exports.viewBillofMaterial=function(request, response) {
    console.log(requestMessage);
    console
        .log("*************************************************************************")
    var dbSoln = cloudant.use(dbCredentials.dbSolution);

    // var username=request.body.uname;
    var SolName = request.query.solnName;
    // console.log(request.body);
    // var service_det=request.body.service_details;
    // var service_name=request.body.service_name;
    // var canvas_info=request.body.canvasinfo;
    // var connection_info=request.body.connectioninfo;
    // var solution_json=request.body.solnjson;
    console.log("Solution Name: " + JSON.stringify(SolName));
    // console.log(request.body);
    // console.log(JSON.stringify(solutionJson));
    // response.write(JSON.stringify(solutionJson));

    if (SolName == null) {
        console
            .log("no sufficient details. returning false info");
        var resjson = {
            "status" : "No Solution present",
        };
        response.write(JSON.stringify(resjson));
        response.end();
    }

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
                        console.log("MSP Service:"
                            + msp_services);

                        blumix_services = result.docs[0].service_details.bluemix;
                        console.log("Bluemix Service:"
                            + msp_services);

                        blumix_runtime = result.docs[0].service_details.bluemix[0].runtime;
                        console.log("Bluemix Runtime:"
                            + blumix_runtime);

                        var msp_len = msp_services.length;
                        console.log("MSP Length:"
                            + msp_len);

                        var blumix_len = blumix_runtime.length;
                        console
                            .log("Bluemix Runtime Length:"
                                + blumix_len);

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
                            /*
                             * if(!msp_services[i].priceDetails){
                             * console.log("Requested
                             * service is returning
                             * null"); var
                             * resjson={"status":
                             * "failed",};
                             * response.write(JSON.stringify(resjson));
                             * response.end(); }
                             */
                            if (msp_services[i].priceDetails == null) {
                                console
                                    .log("Requested service is returning null");
                                var resjson = {
                                    "status" : "failed",
                                };
                                response
                                    .write(JSON
                                        .stringify(resjson));
                                response.end();
                            } else {
                                tot_price = parseInt(msp_services[i].priceDetails.TotalPrice);
                                lic_price_var = msp_services[i].priceDetails["Total License Cost"];
                                tot_lic_price = parseInt(lic_price_var);
                                console
                                    .log("Total Price "
                                        + i
                                        + ":"
                                        + tot_price);
                                final_msp_totalprice = (tot_price)
                                    + (final_msp_totalprice);

                                console
                                    .log("Total License Cost"
                                        + i
                                        + ":"
                                        + tot_lic_price);
                                final_msp_licenseprice = (tot_lic_price)
                                    + (final_msp_licenseprice);
                            }
                        }

                        for (i = 0; i < blumix_len; i++) {
                            /*
                             * if(!blumix_runtime[i].properties.price){
                             * console.log("Requested
                             * service is returning
                             * null"); var
                             * resjson={"status":
                             * "failed",};
                             * response.write(JSON.stringify(resjson));
                             * response.end(); }
                             */

                            if (blumix_runtime[i].properties.price == null) {
                                console
                                    .log("Requested service is returning null");
                                var resjson = {
                                    "status" : "failed",
                                };
                                response
                                    .write(JSON
                                        .stringify(resjson));
                                response.end();
                            } else {
                                runtime_price = parseInt(blumix_runtime[i].properties.price);
                                console
                                    .log("Runtime price:"
                                        + runtime_price);
                                final_runtime_price = (runtime_price)
                                    + (final_runtime_price);
                            }
                        }

                        final_price = (final_runtime_price)
                            + (final_msp_licenseprice)
                            + (final_msp_totalprice);

                        console
                            .log("Final Total Price:");
                        console
                            .log(final_msp_totalprice);
                        console
                            .log(final_msp_licenseprice);
                        priceJson = JSON
                            .stringify({
                                "msp" : msp_services,
                                "bluemix" : blumix_services,
                                "Final_MSP_Price" : final_msp_totalprice,
                                "Final_MSP_License_Price" : final_msp_licenseprice,
                                "Final_Runtime_Price" : final_runtime_price,
                                "Final_Price" : final_price
                            });
                        // priceJson=JSON.stringify([
                        // msp_services ,
                        // blumix_services, {
                        // "Final_Price" :
                        // final_msp_totalprice,
                        // "Final_License_Price" :
                        // final_msp_licenseprice } ]);
                        console.log(priceJson);
                        response.write(priceJson);
                        response.end();
                    } else {
                        var errMessage = "Error occurred while accessing components : \n"
                            + JSON.stringify(err);
                        response.write(errMessage);
                        console.log(errMessage);
                        // response.end();
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


exports.removeComponentFromSolutiondb=function(request, response) {
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






exports.deleteSolution=function(request, response) {
    console.log(requestMessage);
    console.log("*************************************************************************")
    var dbSoln = cloudant.use(dbCredentials.dbSolution);
    var username = request.body.user;
    var SolName = request.body.soln_name;
    console.log(request.body);
    if(request.body == null){
        console.log("There is no data in body");
        var resjson = {
            "status": "failed",
            "description":"There is no data in body"
        };
        response.write(JSON.stringify(resjson));
        response.end();
    }
    else if(request.body.hasOwnProperty("user") && request.body.hasOwnProperty("soln_name")){


        dbSoln.find({selector: {solution_name: SolName}},
            function (err, result) {

                if (!err) {
                    console.log(JSON.stringify(result));
                    if (result != null) {
                        if (result.hasOwnProperty("docs")) {
                            if (result.docs != null) {
                                if (result.docs[0].hasOwnProperty("_id")!=null) {
                                    if (result.docs[0].hasOwnProperty("_rev")!=null) {
                                        var sol_id = result.docs[0]._id
                                        console.log(result.docs[0]._id);
                                        var sol_rev = result.docs[0]._rev;
                                        console.log(result.docs[0]._rev);
                                        dbSoln.destroy(sol_id, sol_rev, function (err2, body, header) {
                                            console.log("response from delete");
                                            if (err) {
                                                console.log(err2);
                                                var resjson = {
                                                    "status": "failed"
                                                };
                                                response.write(JSON.stringify(resjson));
                                                response.end();
                                            } else {
                                                console.log("Record Deleted ..");
                                                console.log(body);
                                                console.log(header);
                                                var resjson = {
                                                    "status": "success"
                                                };
                                                response.write(JSON.stringify(resjson));
                                                response.end();

                                            }
                                        });
                                    }
                                    else {
                                        console.log("There is no property _rev in result");
                                        var resjson = {
                                            "status": "failed"
                                        };
                                        response.write(JSON.stringify(resjson));
                                        response.end();
                                    }
                                }
                                else {
                                    console.log("There is no property _id in result");
                                    var resjson = {
                                        "status": "failed"
                                    };
                                    response.write(JSON.stringify(resjson));
                                    response.end();
                                }
                            }
                            else {
                                console.log("There is no docs in result");
                                var resjson = {
                                    "status": "failed"
                                };
                                response.write(JSON.stringify(resjson));
                                response.end();
                            }
                        }
                        else {
                            console.log("There is no property docs in result");
                            var resjson = {
                                "status": "failed"
                            };
                            response.write(JSON.stringify(resjson));
                            response.end();
                        }
                    }
                    else {
                        console.log("There is no result");
                        var resjson = {
                            "status": "failed"
                        };
                        response.write(JSON.stringify(resjson));
                        response.end();
                    }
                } else {
                    var errMessage = "Error occurred while accessing components : \n"
                        + JSON.stringify(err);
                    var resjson = {
                        "status": "failed"
                    };
                    response.write(resjson);
                    response.end();
                    console.log(errMessage);
                    console.log(responseMessage);
                }

            });
    }
    else{
        console.log("There is no username and solution name defined in body");
        var resjson = {
            "status": "failed",
            "description":"There is no username and solution name defined in body. Please check your JSON."
        };
        response.write(JSON.stringify(resjson));
        response.end();
    }

}

exports.login=function(request, response) {

    console.log(requestMessage);
    // db = cloudant.use(dbCredentials.dbComponents);
    // var dbSoln = cloudant.use(dbCredentials.dbSolution);

    db = cloudant.use(dbCredentials.dbuser);

    var userid = request.body.uid;
    var passwd = request.body.pwd;
    console.log(userid);
    console.log(passwd);

    db.find({
        selector : {
            uid : userid
        }
    }, function(err, result) {
        if (!err) {
            var successMessage = "login details";
            // response.write(JSON.stringify(result));
            console.log(successMessage + JSON.stringify(result));
            console.log("*** Response Sent ***");
            console.log(result);
            // console.log(result.docs[0].pwd);

            if (result.docs == 0) {
                console.log("no value");
                response.json({
                    "mystatus" : false
                });
            } else {
                if (result.docs[0].uid == userid
                    && result.docs[0].pwd == passwd) {
                    console.log("Login Success");
                    response.json({
                        "mystatus" : true
                    });
                } else {
                    console.log("Login failed");
                    response.json({
                        "mystatus" : false
                    });
                }
            }

        } else {
            var errMessage = "Error occurred while accessing details : "
                + JSON.stringify(err);
            console.log("Error occurred while accessing details");
            failure_response.description = "Error while fetching data from database"
            response.write(JSON.stringify(failure_response));
            response.end();
            console.log("*** Response Sent ***");
        }
        // var dataa=JSON.parse(result);

        if (err) {
            response.json({
                "mystatus" : false
            });
        }

        // response.write(JSON.stringify(result));
        response.end();
        console.log(successMessage + JSON.stringify(result));
        // console.log("Person name : " + personName);
        // console.log('Found %d documents with name Alice',
        // result.docs.length);
        console.log('ending response...');
        console.log("*** Response Sent ***");
    });

}

var fs=require('fs');

exports.placeOrder=function(reqst, resp) {
    console.log("*** Request Received ***");
    var soln = reqst.body.soln_name;
    var resultjson;
    var orderjson;
    var randomno = "";
    /*
     *
     */
    console.log("Placeorder for" + soln);
    var dbSoln = cloudant.use(dbCredentials.dbSolution);

    dbSoln.find({
        selector : {
            solution_name : soln
        }
    }, function(err, result) {
        if (!err) {
            console.log(result);

            if (result.docs[0] == null) {
                console.log("null value in result");
                var resjson = {
                    "status": "failed",
                };
                resp.write(JSON.stringify(resjson));
                resp.end();
            }

            else if (result.docs[0].hasOwnProperty("service_details")==null){

                console.log("there is no property called service details");
                var resjson = {
                    "status" : "failed",
                };
                resp.write(JSON.stringify(resjson));
                resp.end();

            }
            else if(result.docs[0].service_details == null) {
                console.log("null value in service details");
                failure_response.description = "null value in service details"
                resp.write(JSON.stringify(failure_response));
                resp.end();
            }
            else if (result.docs[0].service_details.hasOwnProperty("msp") == null) {
                console.log("there is no property called msp");
                failure_response.description = "there is no property called msp"
                resp.write(JSON.stringify(failure_response));
                resp.end();
            }
            else if(result.docs[0].service_details.msp == null) {
                console.log("null value in msp services");
                failure_response.description = "null value in msp services"
                resp.write(JSON.stringify(failure_response));
                resp.end();
            }


            else {
                resultjson = result.docs[0];
                randomno = "mpaase210d12f817c41f682217fds46e19478";
                console.log(randomno);

                var msp_services = [];
                msp_services = result.docs[0].service_details.msp;
                msp_len = msp_services.length;
                var msp_service_names = [];
                for (i = 0; i < msp_len; i++)

                {
                    if(msp_services[i] != null)
                    {
                        if(msp_services[i].hasOwnProperty("catalog_name")!=null){
                            msp_service_names[i] = msp_services[i].catalog_name;
                        }
                        else{
                            console.log("there is no value in msp array position"+i);
                            var resjson = {
                                "status": "failed",
                            };
                            resp.write(JSON.stringify(resjson));
                            resp.end();
                        }
                    }
                    else{
                        console.log("there is no value in msp array position"+i);
                        failure_response.description = "there is no value in msp array position"+i
                        resp.write(JSON.stringify(failure_response));
                        resp.end();
                    }

                }

                orderjson = {
                    "Order_ID" : randomno,
                    "Ordered_Items" : msp_service_names,
                    "Data_Center" : "Amsterdam 1",
                    "Originating_From" : "mpaas",
                    "User_ID" : "superadmin@in.ibm.com",
                    "Comments" : "some-comments",
                    "Ordered_ItemDetails" : {
                        msp_service_names : {
                            "orderedItemFormData" : {
                                "Group1" : {
                                    "count" : "1",
                                    "size" : "small",
                                    "flavor" : "RedHat",
                                    "role" : "MYSQL"
                                }
                            }
                        }
                    }
                };

                console.log(orderjson);

                fs.writeFile("final_json.json", JSON.stringify(orderjson),
                    function(err) {

                        if (err)
                            throw err;

                        console.log("It's saved! in same location.");

                    });

                resp.write(JSON.stringify(orderjson));
                resp.end();

            }
        } else {
            var errMessage = "Error occurred while accessing components : \n"
                + JSON.stringify(err);
            // response.write(errMessage);
            // console.log(errMessage);
            // resp.end();
            console.log(responseMessage);
            console.log("*** Request Responded ***");
            failure_response.description = "Error occurred while accessing components";
            resp.write(JSON.stringify(failure_response));
            resp.end();
        }
    });
}

exports.getCanvasInfo=function(reqst, resp) {
    console.log("*** Request Received ***");
    var soln = reqst.body.soln_name;

    console.log("Get canvas info for" + soln);
    var dbSoln = cloudant.use(dbCredentials.dbSolution);

    if (soln == null) {
        console.log("no sufficient details. returning false info");
        failure_response.description = "no sufficient details. returning false info";
        resp.write(JSON.stringify(failure_response));
        resp.end();
    } else{

        dbSoln.find({selector : {solution_name : soln}}, function(err, result) {
            if (!err) {
                if(result.docs[0]!=null)
                {
                    if(result.docs[0].hasOwnProperty("canvas_details")){
                        var canvas=result.docs[0].canvas_details
                        console.log("Canvas Details \n"+canvas);
                        resp.write(JSON.stringify(canvas));
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

exports.v1_placeOrder=function(reqst, resp) {
    console.log("*** Request Received ***");
    var soln = reqst.body.soln_name;
    var resultjson;
    var orderjson;
    var randomno = "";

    console.log("Placeorder for" + soln);
    var dbSoln = cloudant.use(dbCredentials.dbSolution);
    var dbfinaljson=cloudant.use(dbCredentials.dbFinalJson);

    if (soln == null) {
        console.log("no sufficient details. returning false info");
        failure_response.description = "no sufficient details. returning false info";
        resp.write(JSON.stringify(failure_response));
        resp.end();
    } else{

        dbSoln.find({selector : {solution_name : soln}}, function(err, result) {
            if (!err) {
                console.log(result);
                if (result.docs[0] == null) {
                    console.log("null value in result");
                    failure_response.description = "null value in result";
                    resp.write(JSON.stringify(failure_response));
                    resp.end();
                } else {
                    resultjson = result.docs[0];
                    randomno = "mpaas"+result.docs[0]._id;
                    console.log(randomno);

                    var msp_services = [];
                    msp_services = result.docs[0].service_details.msp;
                    msp_len = msp_services.length;
                    var msp_service_names = [];

                    var service_properties=[];

                    for (i = 0; i < msp_len; i++)
                    {
                        msp_service_names[i] = msp_services[i].catalog_name;
                        service_properties[i]=msp_services[i].Pattern;
                        console.log("Properties______________________________");
                        console.log(JSON.stringify(service_properties[i]));
                    }

                    orderjson = {
                        "Order_ID" : randomno,
                        "Ordered_Items" : msp_service_names,
                        "Data_Center" : "Amsterdam 1",
                        "Originating_From" : "mpaas",
                        "User_ID" : "superadmin@in.ibm.com",
                        "Comments" : "some-comments",
                        "Ordered_ItemDetails" : {

                        }
                    };

                    var offering={};
                    offering[soln]={ "orderedItemFormData" : {}};
                    console.log('offering === '+JSON.stringify(offering[soln]));

                    for (i = 0; i < msp_len; i++)
                    {
                        var group="Group"+(i+1);
                        offering[soln]['orderedItemFormData'][group]=service_properties[i];
                    }

                    orderjson.Ordered_ItemDetails=offering;

                    final_json_formatted=orderjson;


                    console.log("Final JSON:");
                    console.log(final_json_formatted);
                    console.log(JSON.stringify(final_json_formatted));

                    fs.writeFile("final_json.json", JSON.stringify(orderjson),
                        function(err) {
                            if (err)
                                throw err;
                            console.log("It's saved! in same location.");

                        });

                    dbfinaljson.insert(final_json_formatted,'',function(errors, result2) {
                        if(!errors){
                            console.log("Data inserted in Final JSON DB");
                            var resjson = {
                                "status" : "success"
                            };
                            resp.write(JSON.stringify(success_response));
                            resp.end();
                        }
                        else{
                            failure_response.description = "Data insertion in Final JSON DB failed";
                            resp.write(JSON.stringify(failure_response));
                            resp.end();
                        }
                    });
                }
            } else {
                var errMessage = "Error occurred while accessing components : \n" + JSON.stringify(err);
                console.log(responseMessage);
                console.log("*** Request Responded ***");
                failure_response.description = "Error occurred while accessing components";
                resp.write(JSON.stringify(failure_response));
                resp.end();
            }
        });
    }
}

//exports.acceptdummy=function (request,response) {
//    console.log("*** Request Received ***");
//    var requestparameter=request.body;
//    console.log(requestparameter);
//    response.send(requestparameter);
//    response.end();
//}

exports.v2_placeOrder=function(reqst, resp) {

    console.log("*** Request Received ***");
    var soln = reqst.body.soln_name;
    var uname=reqst.body.uname;
    var version=parseInt(reqst.body.version);
    var resultjson;
    var orderjson;
    var randomno = "";
    var orderstatus=false;

    //These data we require for bluemix provisioning

    //var solnName = request.body.soln_name;
    //var uname = request.body.uname;
    //var version = parseInt(request.body.version);
    //var space_guid = request.body.space_guid;
    //var service_plan_guid = request.body.service_plan_guid;
    //var bmusername = request.body.bmusername;
    //var bmpassword = request.body.bmpassword;


    var contactname=reqst.body.contactname;
    var contactmail=reqst.body.contactmail;

    var space_guid = reqst.body.space_guid;
    ////var service_name = reqst.body.service_name;
    var service_plan_guid = JSON.parse(reqst.body.service_plan_guid);
    //console.log(service_plan_guid);
    var bmusername = reqst.body.bmusername;
    var bmpassword = reqst.body.bmpassword;



   // var space_guid = "cb9e64ba-99a4-43a1-93fd-7bcd903d1865";
    //var service_plan_guid = ["0e4ddce5-c5e0-48e7-825e-359c206aa9aa","151f88eb-aa39-46b6-b3dc-8c0662a66cb1"];
   // var bmusername = "kvilliva@in.ibm.com";
   // var bmpassword = "Hope@1993";

    console.log("space guid:"+ space_guid);
   // console.log("service_plan_guid:"+service_plan_guid11);


    console.log("Placeorder for" + soln);
    var dbSoln = cloudant.use(dbCredentials.dbSolution);
    var dbfinaljson=cloudant.use(dbCredentials.dbFinalJson);

    if (soln === null || uname === null || version===null || soln === undefined || uname === undefined || version===undefined) {
        console.log("Please provide Solution name, username, version in body as JSON");
        failure_response.description = "Please provide Solution name, username, version in body as JSON";
        resp.write(JSON.stringify(failure_response));
        resp.end();
    } else{

        dbSoln.find({selector : {user:uname, solution_name : soln}}, function(er, allresult) {
            if (er) {
                console.log("There is no such solution in database. Please check username and solution name");
                failure_response.description = "There is no such solution in database.";
                resp.write(JSON.stringify(failure_response));
                resp.end();
            }
            else{
                solutioncnt=allresult.docs.length;
                for(i=0;i<solutioncnt;i++){
                    if(allresult.docs[i].order_status==="submitted"){
                        orderstatus=true;
                    }
                }
                if(orderstatus === true){
                    console.log("Solution is already provisioned.");
                    failure_response.description = "Solution is already provisioned.";
                    resp.write(JSON.stringify(failure_response));
                    resp.end();
                }
                else {
                    dbSoln.find({
                        selector: {
                            user: uname,
                            solution_name: soln,
                            version: version
                        }
                    }, function (err, result) {
                        if (!err) {
                            console.log("received result");
                            if (result.docs[0] == null) {
                                console.log("null value in result");
                                failure_response.description = "There is no such solution and version exist. please check.";
                                resp.write(JSON.stringify(failure_response));
                                resp.end();
                            } else {
                                resultjson = result.docs[0];
                                resultjson.order_status = "submitted";
                                resultjson.provisioning_status[0].msp_status = "Submitted for Provisioning";
                                resultjson.provisioning_status[0].bluemix_status = "Submitted for Provisioning";

                                dbSoln.insert(resultjson, '', function (err, res) {

                                delete resultjson._id;
                                delete resultjson._rev;

                                dbfinaljson.insert(resultjson, '', function (err1, res1) {
                                    if (err1) {
                                        console.log(err1);

                                        console.log("Error while updating status into DB. Please try again");
                                    //    failure_response.description = "Error while updating status into DB. Please try again" + err1;
                                    //    resp.write(JSON.stringify(failure_response));
                                    //    resp.end();
                                    }
                                    else {
                                        //insert decomposition code.

                                        var msp_properties = resultjson.service_details.msp;
                                        var bluemix_properties = resultjson.service_details.bluemix;

                                        //calling function which sends request to provision bluemix services and runtimes
                                        if (bmusername !== null && bmusername !== undefined && bmusername !== '' && bmpassword !== null && bmpassword !== undefined && bmpassword !== '') {
                                            bluemixprovisioning();

                                        }

                                        //calling imi api for msp component provisioning.

                                        function bluemixprovisioning() {
/*                                            var data = {
                                                "soln_name": soln,
                                                "uname": uname,
                                                "version": version,
                                                "space_guid": space_guid,
                                                "service_plan_guid": service_plan_guid,
                                                "bmusername": bmusername,
                                                "bmpassword": bmpassword
                                            };

                                            var options = {
                                                //host: 'cbicportal.mybluemix.net',
                                                //port:80,
                                                path: '/api/acceptdummy',
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Content-Length': JSON.stringify(data).length
                                                }
                                            };

                                            var req = http.request(options, function (res) {
                                                // res.setEncoding('utf8');
                                                console.log("Request sent to Bluemix");
                                            });
                                            req.on('error', function (err, result) {
                                                console.log(err);
                                                //console.log("Error while fetching data from IMI Server. Please try later");
                                                //failure_response.description = "Error while fetching data from IMI Server. Please try later"
                                                //resp.write(JSON.stringify(failure_response));
                                                // response.end();
                                            });
                                            req.write(JSON.stringify(data));
                                            req.end();*/
                                            var solnName = soln;
                                           // var uname = uname;
                                           // var version = parseInt(request.body.version);
                                           // var space_guid = request.body.space_guid;
                                           // var service_plan_guid = service_plan_guid;
                                           // var bmusername = request.body.bmusername;
                                           // var bmpassword = request.body.bmpassword;
                                            var dbsol = cloudant.use(dbCredentials.dbSolution);

                                            try{
                                                console.log("creds,",solnName,uname,version);

                                                dbsol.find({"selector":{solution_name: solnName, user: uname, version:version}},function(err,result){
                                                    if(!err) {
                                                        console.log(result);
                                                        if (result.docs[0].hasOwnProperty("service_details") || result.docs[0].service_details[0] !== undefined) {
                                                            console.log("here1");

                                                            if (result.docs[0].service_details.bluemix[0].services !== undefined || result.docs[0].service_details.bluemix[0].services !== null) {
                                                                console.log("here2");
                                                                bluemixprovisioning1();

                                                            }
                                                            else {
                                                                console.log("No bluemix servvices to be provisioned");
                                                            }

                                                            if (result.docs[0].service_details.bluemix[0].runtime !== null || result.docs[0].service_details.bluemix[0].runtime !== undefined) {

                                                                console.log("I am here3");

                                                                    setTimeout(function(){
                                                                        bluemixappprovisioning();
                                                                        setTimeout(function(){
                                                                            status_update(uname,solnName,version);
                                                                        },20000)
                                                                    },20000);
                                                                    //bluemixappprovisioning();
                                                                

                                                            }
                                                            else {
                                                                console.log("No runtimes to be provisioned");
                                                            }
                                                        }
                                                    }



                                                })
                                            }
                                            catch(err){
                                                console.log(err);
                                            }

                                            function bluemixprovisioning1(){
                                                var service_name =[];
                                                var full_token_new="";
                                                var data={};
                                                var options={};
                                                var data1='';
                                                var index="";
                                                var original_url='api.ng.bluemix.net';
                                                if(bmusername === null){
                                                    response.write("No username provided");
                                                    response.end();
                                                }
                                                else if(bmpassword === null){
                                                    response.write("No username provided");
                                                    response.end();

                                                }
                                                else if(solnName === null){
                                                    response.write("No soln name provided");
                                                    response.end();
                                                }
                                                else if(service_plan_guid === null){
                                                    response.write("No soln name provided");
                                                    response.end();
                                                }
                                                else if(space_guid === null){
                                                    response.write("No space guid provided");
                                                    response.end();
                                                }
                                                else {
                                                    console.log(service_plan_guid[0]);

                                                    try {
                                                        console.log("service_plan_guid ==============="+service_plan_guid);

                                                        console.log("inside service guid loop");
                                                        // console.log(service_plan_guid[k]);
                                                        var dbsoln = cloudant.use("solutions");
                                                        dbsoln.find({selector: {user: uname, solution_name: solnName, version: version}}, function (err, result) {
                                                            if (!err) {
                                                                //console.log(k);
                                                                if (result.docs !== null || result.docs !== undefined) {
                                                                    var ser_details = result.docs[0].service_details.bluemix[0].services;
                                                                    console.log("Ser details =============",ser_details);
                                                                    for (var k = 0; k < service_plan_guid.length; k++) {
                                                                        l1: for (var i = 0; i < ser_details.length; i++) {
                                                                            var properties = ser_details[i].properties[0];
                                                                            for (var j = 0; j < properties.length; j++) {
                                                                                console.log(service_plan_guid[k]);
                                                                                if (properties[j].metadata.guid === service_plan_guid[k]) {
                                                                                    service_name[k] = ser_details[i].service_name;
                                                                                    index = i;
                                                                                    //console.log(service_name[k]);
                                                                                    break l1;

                                                                                }
                                                                                else {
                                                                                    console.log("No matching service plans found");
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                    console.log("service namemeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",service_name);

                                                                }
                                                                else {
                                                                    console.log("No data available");
                                                                }
                                                            }
                                                            else {
                                                                console.log("Some error in finding data");
                                                            }
                                                        });
                                                    }
                                                    catch (err) {
                                                        console.log(err);
                                                    }
                                                    var data = JSON.stringify({
                                                        'grant_type' : 'password'
                                                    });

                                                    var dataString = JSON.stringify(data);

                                                    // console.log("data string : " + dataString);

                                                    var options = {
                                                        host : 'login.ng.bluemix.net',
                                                        port : 80,
                                                        path : '/UAALoginServerWAR/oauth/token'
                                                        + '?grant_type=password&username='+bmusername+'&password='+bmpassword,
                                                        method : 'POST',
                                                        headers : {
                                                            'Content-Type' : 'application/x-www-form-urlencoded;charset=utf-8',
                                                            'Content-Length' : data.length,
                                                            'Accept' : 'application/json;charset=utf-8',
                                                            'Authorization' : 'Basic Y2Y6'
                                                        }

                                                    };
                                                    var token = '';
                                                    var msg = "";
                                                    var msg_json = {};
                                                    var req = http.request(options, function(res) {

                                                        // console.log("response received : " + res);
                                                        res.setEncoding('utf8');
                                                        res.on('data', function(chunk) {
                                                            msg += chunk;
                                                        });
                                                        res.on('end', function() {
                                                            var msg_json = JSON.parse(msg);
                                                            token_type = msg_json.token_type;
                                                            token_data = msg_json.access_token;
                                                            console.log("------",msg_json);
                                                            full_token = token_type +' '+ token_data;
                                                            full_token_new = full_token;
                                                            //console.log(full_token);
                                                            /*response.write(full_token);
                                                             response.end();*/
                                                            console.log("full tokrn print ====",full_token_new);
                                                        });
                                                        console.log("message : " + msg);
                                                        console.log(";;;;;;;;", msg_json);

                                                    });
                                                    req.on('error', function() {
                                                        failure_response.description = "Error while fetching bluemix token"
                                                        response.write(JSON.stringify(failure_response));
                                                        response.end();
                                                    });

                                                    req.write(data);
                                                    req.end();

                                                    try {
                                                        var msg = "";
                                                        console.log("Inside Tryyyy");
                                                        setTimeout(function(){
                                                            for(var i=0;i < service_name.length;i++) {
                                                                (function(j){
                                                                    setTimeout(function(){
                                                                        console.log(j);

                                                                        console.log(service_name.length);
                                                                        console.log("service nameeeeeeeeeeeeeee", service_name[j]);
                                                                        console.log("service guiddddddddddddddd", service_plan_guid[j]);


                                                                        data = JSON.stringify({
                                                                            "space_guid": space_guid,
                                                                            "name": service_name[j],
                                                                            "service_plan_guid": service_plan_guid[j]
                                                                        });
                                                                        console.log("Printing dataaaaaaaaaaaaaaaaaaaaaa", data);
                                                                        var options = {
                                                                            host: 'api.ng.bluemix.net',
                                                                            path: '/v2/service_instances'
                                                                            + '?accepts_incomplete=true',
                                                                            method: 'POST',
                                                                            headers: {
                                                                                'Authorization': full_token_new
                                                                            }

                                                                        };
                                                                        console.log("optionsssssssssssssssssssssssssssssssssssssssssss", options);
                                                                        // var StringDecoder = require('string_decoder').StringDecoder;


                                                                        var reqst = http.request(options, function (res) {
                                                                            // var decoder = new StringDecoder('utf8');
                                                                            console.log("Sent for request");
                                                                            res.setEncoding('utf8');
                                                                            res.on('data', function (chunk) {
                                                                                //console.log(chunk);
                                                                                //  var text = decoder.write(chunk);
                                                                                // console.log(text);
                                                                                msg += chunk;
                                                                                //console.log(msg);

                                                                            });
                                                                            res.on('end', function () {
                                                                                try {
                                                                                    //response.write(msg);

                                                                                    console.log("mdgggggggggggg",msg);
                                                                                    console.log("-----------------------------------------");
                                                                                    msg = JSON.stringify(msg);
                                                                                    var msg1 = JSON.parse(msg);
                                                                                    msg1 = JSON.parse(msg1);
                                                                                    console.log("messageeeeeeeeeeeeeeeeeeeeeeeeeeee",msg1);
                                                                                    console.log("-----------------------------------------");
                                                                                    console.log("here i am",i);
                                                                                    console.log(service_name.length - 1);


                                                                                }
                                                                                catch (err) {
                                                                                    console.log(err);
                                                                                }

                                                                            });
                                                                        });
                                                                        reqst.on('error', function (e) {
                                                                            console.log(e);
                                                                        });
                                                                        reqst.write(data);
                                                                        reqst.end();

                                                                    },1000);
                                                                }(i));


                                                            }


                                                        },3000);





                                                    }
                                                    catch (err) {
                                                        console.log(err);
                                                    }
                                                    try {
                                                        setTimeout(function () {
                                                            db_insert(service_name, solnName, full_token_new,uname,version)

                                                        }, 20000);

                                                    }
                                                    catch(err){
                                                        console.log(err);
                                                    }

                                                }

                                            }
                                            function bluemixappprovisioning(){
                                                var full_token_new = "";
                                                var msg = "";
                                                var app_details=[];
                                                var appname="";
                                                var appnames=[];
                                                var dbsoln = cloudant.use("solutions");
                                                var dbbuildpack = cloudant.use("bluemix_buildpack");

                                                try{
                                                    dbsoln.find({selector:{user: uname, solution_name: solnName, version: version}},function(err,result){
                                                        if(!err){
                                                            if (result.docs !== null || result.docs !== undefined){
                                                                app_name=result.docs[0].service_details.bluemix[0].runtime;
                                                                for(var i=0;i<app_name.length;i++){
                                                                    item1={};
                                                                    item1["name"]=app_name[i].appname;
                                                                    item={};
                                                                    item["space_guid"]=space_guid;
                                                                    item["name"]=app_name[i].appname;
                                                                    item["buildpack"]=app_name[i].label;
                                                                    item["memory"]=parseInt(app_name[i].properties.memory);
                                                                    item["instances"]=parseInt(app_name[i].properties.instance);
                                                                    app_details.push(item);
                                                                    appnames.push(item1);
                                                                }
                                                                console.log("appname is:",app_details);
                                                                console.log("app name array:",appnames);

                                                            }
                                                            else{
                                                                console.log("No data returned");
                                                            }
                                                        }
                                                        else{
                                                            console.log("error",err);
                                                        }

                                                    })


                                                }
                                                catch(err){
                                                    console.log(err);
                                                }

                                                var data = JSON.stringify({
                                                    'grant_type' : 'password'
                                                });

                                                var dataString = JSON.stringify(data);

                                                // console.log("data string : " + dataString);

                                                var options = {
                                                    host : 'login.ng.bluemix.net',
                                                    port : 80,
                                                    path : '/UAALoginServerWAR/oauth/token'
                                                    + '?grant_type=password&username='+bmusername+'&password='+bmpassword,
                                                    method : 'POST',
                                                    headers : {
                                                        'Content-Type' : 'application/x-www-form-urlencoded;charset=utf-8',
                                                        'Content-Length' : data.length,
                                                        'Accept' : 'application/json;charset=utf-8',
                                                        'Authorization' : 'Basic Y2Y6'
                                                    }

                                                };
                                                var token = '';
                                                var msg = "";
                                                var msg_json = {};
                                                var req = http.request(options, function(res) {

                                                    // console.log("response received : " + res);
                                                    res.setEncoding('utf8');
                                                    res.on('data', function(chunk) {
                                                        msg += chunk;
                                                    });
                                                    res.on('end', function() {
                                                        var msg_json = JSON.parse(msg);
                                                        token_type = msg_json.token_type;
                                                        token_data = msg_json.access_token;
                                                        console.log("------",msg_json);
                                                        full_token = token_type +' '+ token_data;
                                                        full_token_new = full_token;
                                                        //console.log(full_token);
                                                        /*response.write(full_token);
                                                         response.end();*/
                                                        console.log("full tokrn print ====",full_token_new);
                                                    });
                                                    console.log("message : " + msg);
                                                    console.log(";;;;;;;;", msg_json);

                                                });
                                                req.on('error', function() {
                                                    failure_response.description = "Error while fetching bluemix token"
                                                    response.write(JSON.stringify(failure_response));
                                                    response.end();
                                                });

                                                req.write(data);
                                                req.end();


                                                try{

                                                    setTimeout(function(){
                                                        for(var i=0;i<app_details.length;i++){
                                                            (function(j){
                                                                setTimeout(function(){
                                                                    data = JSON.stringify(app_details[j]);
                                                                    console.log(data);
                                                                    var options = {
                                                                        host : 'api.ng.bluemix.net',
                                                                        path : '/v2/apps',
                                                                        method : 'POST',
                                                                        headers : {
                                                                            'Authorization' : full_token_new
                                                                        }

                                                                    };
                                                                    console.log("optionsssssssssssssssssssssssssssssssssssssssssss",options);
                                                                    // var StringDecoder = require('string_decoder').StringDecoder;

                                                                    var reqst = http.request(options,function(res){
                                                                        // var decoder = new StringDecoder('utf8');
                                                                        res.setEncoding('utf8');
                                                                        res.on('data',function(chunk){
                                                                            console.log(chunk);
                                                                            //  var text = decoder.write(chunk);
                                                                            // console.log(text);
                                                                            msg += chunk;
                                                                            console.log(msg);

                                                                        });
                                                                        res.on('end',function(){
                                                                            console.log("ended");
                                                                            // response.write(msg);
                                                                            // response.end();
                                                                        });
                                                                    });
                                                                    reqst.on('error',function (e) {
                                                                        console.log(e);
                                                                    });
                                                                    reqst.write(data);
                                                                    reqst.end();
                                                                },3000);
                                                            }(i));
                                                        }

                                                    },3000);
                                                }
                                                catch(err){
                                                    console.log(err);
                                                }
                                                try {
                                                    setTimeout(function () {
                                                        db_insert_app(appnames, solnName, full_token_new,uname,version)

                                                    }, 10000);

                                                }
                                                catch(err){
                                                    console.log(err);
                                                }



                                            }
                                        }

                                        if (contactname !== null && contactname !== undefined && contactmail !== '' && contactmail !== undefined) {
                                            //mspprovisioning();
                                        }

                                        function mspprovisioning() {
                                            randomno = resultjson._id;
                                            console.log(randomno);

                                            var msp_services = [];
                                            msp_services = resultjson.service_details.msp;
                                            msp_len = msp_services.length;
                                            var msp_service_names = [];

                                            var service_properties = [];

                                            for (i = 0; i < msp_len; i++) {
                                                msp_service_names[i] = msp_services[i].catalog_name;
                                                service_properties[i] = msp_services[i].Pattern;
                                                console.log("Properties______________________________");
                                                console.log(JSON.stringify(service_properties[i]));
                                            }

                                            orderjson = {
                                                "Order_ID": "mpaase210d12f817c41f682217acb22219478",
                                                "Ordered_Items": "mysql",
                                                "Data_Center": "Amsterdam 1",
                                                "Originating_From": "mpaas",
                                                "User_ID": "superadmin@in.ibm.com",
                                                "Comments": "some-comments",
                                                "Ordered_ItemDetails": {
                                                    "mysql": {
                                                        "orderedItemFormData": {
                                                            "Group1": {
                                                                "count": "1",
                                                                "size": "small",
                                                                "flavor": "RedHat",
                                                                "role": "MYSQL"
                                                            }
                                                        }
                                                    }
                                                }
                                            };

                                            var offering = {};
                                            offering[soln] = {"orderedItemFormData": {}};
                                            console.log('offering === ' + JSON.stringify(offering[soln]));

                                            for (i = 0; i < msp_len; i++) {
                                                var group = "Group" + (i + 1);
                                                offering[soln]['orderedItemFormData'][group] = service_properties[i];
                                            }

                                            //orderjson.Ordered_ItemDetails=offering;

                                            final_json_formatted = orderjson;


                                            console.log("Final JSON:");
                                            console.log(final_json_formatted);
                                            //console.log(JSON.stringify(final_json_formatted));

                                            dbfinaljson.insert(final_json_formatted, '', function (errors, result2) {
                                                if (!errors) {
                                                    console.log("Data inserted in Final JSON DB");
                                                    // var resjson = {
                                                    //     "status" : "success"
                                                    // };
                                                    // resp.write(JSON.stringify(success_response));
                                                    // resp.end();
                                                }
                                                else {
                                                    failure_response.description = "Data insertion in Final JSON DB failed";
                                                     resp.write(JSON.stringify(failure_response));
                                                    resp.end();
                                                }
                                            });
                                            // insert msp provisioning code here...
                                            var mpaasusername = "mpaasuser";
                                            var mpaaspassword = "Test@123";
                                            var auth = "Basic " + new Buffer(mpaasusername + ":" + mpaaspassword).toString("base64");
                                            var https = require('https');

                                            var options = {
                                                host: '5.10.122.189',
                                                path: '/fulfillment_engine/mpaas/order/create',
                                                port: 8443,
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Content-Length': JSON.stringify(orderjson).length,
                                                    "Authorization": auth
                                                },
                                                rejectUnauthorized: true,
                                                requestCert: true,
                                                agent: false,
                                                //secureProtocol:
                                            };

                                            var req = https.request(options, function (err, res) {
                                                // res.setEncoding('utf8');
                                                if (!err) {
                                                    console.log("Request sent to MSP===============>Response here...");
                                                    console.log(res);
                                                }
                                                else {
                                                    console.log(err);
                                                }

                                            });
                                            req.on('error', function (err, result) {
                                                console.log(err);
                                                console.log("Error while fetching data from IMI Server. Please try later");
                                                failure_response.description = "Error while fetching data from IMI Server. Please try later"
                                                resp.write(JSON.stringify(failure_response));
                                                // response.end();
                                            });
                                            req.write(JSON.stringify(orderjson));

                                            req.end();
                                        }

                                        //need to remove once the provisioning incorporated
                                        console.log("*** Request Responded ***");
                                        resp.write(JSON.stringify(success_response));
                                        resp.end();
                                    }
                                });
                            });

                            }
                        } else {
                            var errMessage = "Error occurred while accessing components : \n" + JSON.stringify(err);
                            console.log(responseMessage);
                            console.log("*** Request Responded ***");
                            failure_response.description = "Error occurred while accessing components";
                            resp.write(JSON.stringify(failure_response));
                            resp.end();
                        }
                    });
                }
            }
        });
    }

}



exports.v1_viewBillOfMaterial = function(request, response) {

    console.log(requestMessage);
    console
        .log("*************************************************************************")

    var dbSoln = cloudant.use(dbCredentials.dbSolution);

    // var username=request.body.uname;
    var SolName = request.query.solnName;
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
            dbSoln.find({selector: {solution_name: SolName}},
                function (err, result) {
                    if (!err) {
                        if (result.docs[0]) {
                            if (result.docs[0].hasOwnProperty("service_details") !== undefined) {
                                if (result.docs[0].service_details
                                        .hasOwnProperty("msp") !== undefined) {
                                    if (result.docs[0].service_details
                                            .hasOwnProperty("bluemix") !== undefined) {
                                        if (result.docs[0].service_details.bluemix[0] !== undefined){
                                            if (result.docs[0].service_details.bluemix[0]
                                                    .hasOwnProperty("runtime") !== undefined) {
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
                                                            if (blumix_runtime[i].properties.price === undefined) {
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

exports.viewMspBillofMaterial = function(request, response) {
    console.log(requestMessage);
    console
        .log("*************************************************************************")
    initDBConnection();
    var dbSoln = cloudant.use(dbCredentials.dbSolution);

    // var username=request.body.uname;
    var SolName = request.query.solnName;
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
            dbSoln.find({selector: {solution_name: SolName}},
                function (err, result) {
                    if (!err) {
                        if (result.docs[0]) {
                            if (result.docs[0]
                                    .hasOwnProperty("service_details") !== undefined) {
                                if (result.docs[0].service_details
                                        .hasOwnProperty("msp") !== undefined) {
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

exports.viewMyDeployArch = function(request, response) {
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
        initDBConnection();
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
                            soln_list={ "msp": msplist.sort(), "hybrid":hybridlist.sort() };
                            console.log(soln_list);
                            response.write(JSON.stringify(soln_list));
                            response.end();
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




exports.viewMyDeployArchNames = function(request, response) {
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
        console.log("*************************************************************************");
        //initDBConnection();
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

        dbSoln.find({selector : {user : username, version: 1} },function(err, result) {
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



                                        if(result.docs[i].order_status !== "drafted") {

                                            solnames[i] = result.docs[i].solution_name;

                                            if (result.docs[i].type === "msp") {
                                                msplist.push(solnames[i]);
                                            }
                                            else {
                                                hybridlist.push(solnames[i]);
                                            }
                                        }

                                    }
                                }
                            }
                            //soln_list={ "solution_names": solnames.sort(), "msp": msplist.sort(), "hybrid":hybridlist.sort() };
                            soln_list={ "msp": msplist.sort(), "hybrid":hybridlist.sort() };
                            console.log(soln_list);
                            response.write(JSON.stringify(soln_list));
                            response.end();
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




exports.AddComponentToCanvas = function(request, response) {
    console.log(requestMessage);
    console
        .log("*************************************************************************")
    initDBConnection();
    var dbSoln = cloudant.use(dbCredentials.dbSolution);

    var username = request.body.uname;
    var SolName = request.body.solnName;
    console.log(request.body);
    var service_det = request.body.service_details;
    var service_name = request.body.service_name;
    var compcnt = request.body.component_cnt;
    // console.log("Response from body: "+solutionJson);
    // console.log(JSON.stringify(solutionJson));
    // response.write(JSON.stringify(solutionJson));

    if (username == null) {
        console.log("no sufficient details. returning false info");
        var resjson = {
            "status" : "failed"
        };
        response.write(JSON.stringify(resjson));
        response.end();
    } else if (SolName == null) {
        console.log("no sufficient details. returning false info");
        var resjson = {
            "status" : "failed"
        };
        response.write(JSON.stringify(resjson));
        response.end();
    } else if (service_name == null) {
        console.log("no sufficient details. returning false info");
        var resjson = {
            "status" : "failed"
        };
        response.write(JSON.stringify(resjson));
        response.end();
    } else if (compcnt == null) {
        console.log("no sufficient details. returning false info");
        var resjson = {
            "status" : "failed"
        };
        response.write(JSON.stringify(resjson));
        response.end();
    }

    else {

        /*
         * This has to be enabled when IMI team create services
         * with all parameters.
         */
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
        });

        req.on('error',function(err,result) {
            console.log("Error while fetching data from IMI Server. Please try later");
            failure_response.description = "Error while fetching data from IMI Server. Please try later"
            response.write(JSON.stringify(failure_response));
            response.end();
        });

        req.write(data);

        req.end();

        setTimeout(function() {
            console.log("*** Request Responded ***");
            console.log(properties);
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
            //

            // properties.NewField='catalog_name';
            // console.log(properties);
            // properties.body["catalog_name"]=service_name;
            // console.log("******************** after
            // catalog name
            // ******************");
            // console.log(properties);
            try {

                dbSoln.find({selector : {solution_name : SolName}},function(err, result) {
                    if (!err) {
                        if (service_det == "msp") {

                            console.log("---------------------------------------------------------");
                            console.log("Entering to insert into database");
                            console.log("These are the data to insert");
                            console.log(properties);
                            console.log("-------------------------------------------------");
                            console.log(result.docs[0]);
                            console.log("-------------------------------------------------");

                            result.docs[0].service_details.msp[compcnt] = JSON
                                .parse(properties);
                            dbSoln.insert(result.docs[0],function(err2,result2) {
                                console.log("response from insert");
                                console.log("response from insert "+ JSON.stringify(result));
                                if (err) {
                                    console.log(err2);
                                } else {
                                    console.log("New doc created ..");
                                    setTimeout(function() {
                                            console.log("*** Request Responded ***");
                                            var resjson = {
                                                "status" : "success",
                                            };
                                            response.write(JSON.stringify(resjson));
                                            response.end();
                                        },
                                        1000);

                                }

                            });
                        } else {
                            result.docs[0].service_details.bluemix[0] = JSON
                                .stringify(properties);
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
                        }

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
        }, 1000);
    }

}

exports.v1_AddComponentToCanvas = function(request, response) {
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
                        dbSoln.find({selector : {solution_name : SolName}},
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

exports.getServiceInfo =  function(request, response) {
    console.log(requestMessage);
    console
        .log("*************************************************************************")
    initDBConnection();
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
            if (service_det == "msp") {

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
                                } else if (result.docs[0].service_details.msp.length <= compcnt) {
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
                                    var services = result.docs[0].service_details.msp[compcnt];
                                    var nameofservice = result.docs[0].service_details.msp[compcnt].catalog_name;
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
                                // response.write(errMessage);
                                console.log(errMessage);
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

            else {
                console.log("service details wrong");
                var resjson = {
                    "status" : "failed"
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

function db_insert_app(appnames, solnName, full_token_new,uname,version){

    console.log("Hey there inside db insert app");
    var original_url='api.ng.bluemix.net';
    var dbsoln = cloudant.use("solutions");
    dbsoln.find({"selector": {"solution_name": solnName,"user":uname,"version":version}}, function (err, result) {
        if (!err) {

            if (result.docs !== null || result.docs !== undefined) {

                var runtime_details = result.docs[0].service_details.bluemix[0].runtime;
                //var rev = result.docs[0]._rev;
                try{
                    var options = {
                        host : original_url,
                        path : '/v2/apps',
                        method : 'GET',
                        headers : {
                            'Accept': 'application/json',
                            'Authorization' : full_token_new
                        }

                    };
                    console.log("Optionssssssssss for app",options);
                    var data="";
                    var reqq = http.request(options, function(res) {
                        console.log("inside req");
                        res.on('data', function(chunk) {
                            data += chunk;


                        });
                        res.on('end', function() {
                            console.log("dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",data);
                            console.log("----------------------------------------------");
                            var resource = JSON.stringify(data);
                            resource1 = JSON.parse(resource);
                            resource1 = JSON.parse(resource1);
                            var resource_data = resource1.resources;
                            console.log("length",resource_data.length);
                            console.log("appnames length",appnames.length);
                            for(var j=0;j<appnames.length;j++){

                                for(var i=0;i<resource_data.length;i++){
                                    console.log("app name",appnames[j].name);
                                    console.log("resource_data",resource_data[i].entity.name);
                                    if(resource_data[i].entity.name === appnames[j].name){
                                        for(var k=0;k<runtime_details.length;k++){
                                            console.log("actual app name",appnames[j].name);
                                            console.log("check db",runtime_details[k].appname);
                                            if(runtime_details[k].appname === appnames[j].name){
                                                console.log("provisioned");
                                                runtime_details[k].status="provisioned";
                                                console.log("**********************************");
                                                console.log(JSON.stringify(runtime_details));
                                                console.log("**********************************");

                                            }
                                            else{
                                                console.log("Its not in database")
                                            }
                                        }

                                    }
                                    else{

                                        console.log("no change");


                                    }

                                }
                            }

                        });
                    });
                    reqq.on('error',function(e){
                        console.log("Error isss:",e);
                    });
                    reqq.write(data);
                    reqq.end();
                }
                catch(err){
                    console.log(err);
                }
                try{

                    setTimeout(function(){
                        for(var k=0;k<runtime_details.length;k++){
                            if( !(runtime_details[k].hasOwnProperty("status")) && runtime_details[k].status === undefined ){
                                runtime_details[k].status = "not provisioned";
                                console.log("runtime detail",runtime_details[k].status);
                            }
                        }
                        console.log("runtime details",JSON.stringify(runtime_details));
                        setTimeout(function(){
                            dbsoln.insert(result.docs[0],function(err,result){
                                if(!err){
                                    console.log("Succeed app");
                                }
                                else{
                                    console.log(err);
                                    console.log("Failure app");
                                }
                            });


                        },5000);

                    },10000);
                }
                catch(err){
                    console.log(err);
                }
                // }
            }
            else {
                console.log("No data available");
            }
        }
        else {
            console.log("Error retrieving data")
        }
    });
}

function db_insert(service_name,solnName,full_token_new,uname,version){

    console.log("Hey there");
    var original_url='api.ng.bluemix.net';
    var dbsoln = cloudant.use("solutions");
    dbsoln.find({"selector": {"solution_name": solnName,"user":uname,"version":version}}, function (err, result) {
        if (!err) {

            if (result.docs !== null || result.docs !== undefined) {

                var ser_details = result.docs[0].service_details.bluemix[0].services;
                // var runtime_details = result.docs[0].service_details.bluemix[0].runtime;
                var rev = result.docs[0]._rev;
                try{
                    var options = {
                        host : original_url,
                        path : '/v2/service_instances',
                        method : 'GET',
                        headers : {
                            'Accept': 'application/json',
                            'Authorization' : full_token_new
                        }

                    };
                    console.log("Optionssssssssss",options);
                    var data="";
                    var reqq = http.request(options, function(res) {
                        console.log("inside req");
                        res.on('data', function(chunk) {
                            data += chunk;


                        });
                        res.on('end', function() {
                            console.log("dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",data);
                            console.log("----------------------------------------------");
                            var resource = JSON.stringify(data);
                            resource1 = JSON.parse(resource);
                            resource1 = JSON.parse(resource1);
                            var resource_data = resource1.resources;
                            console.log("length",resource_data.length);
                            for(var j=0;j<service_name.length;j++){

                                for(var i=0;i<resource_data.length;i++){
                                    console.log("service_name",service_name[j]);
                                    console.log("resource_data",resource_data[i].entity.name);
                                    if(resource_data[i].entity.name === service_name[j]){
                                        for(var k=0;k<ser_details.length;k++){
                                            console.log("actual ser name",service_name[j]);
                                            console.log("check db",ser_details[k].service_name);
                                            if(ser_details[k].service_name === service_name[j]){
                                                console.log("provisioned");
                                                ser_details[k].status="provisioned";
                                                console.log("+++++++++++++++++++++++++++++++++++");
                                                console.log(JSON.stringify(ser_details));
                                                console.log("+++++++++++++++++++++++++++++++++++");
                                                /*       dbsoln.update = function(obj,key,callback1){
                                                 dbsoln.get(key,function(error,existing){
                                                 if(!error)
                                                 obj=existing;
                                                 console.log("existing",existing);
                                                 console.log("print obj",obj);
                                                 //obj=result.docs[0];
                                                 obj._rev = existing._rev;
                                                 //obj.service_details.bluemix[0].services[k]="provisioned";
                                                 //console.log("objjj",JSON.stringify(obj));

                                                 dbsoln.insert(obj,key,callback1);
                                                 });

                                                 }

                                                 dbsoln.update({"selector": {"solution_name": solnName}}, '1', function(err, res) {
                                                 if (err){
                                                 console.log(err);
                                                 console.log('No update!');
                                                 }

                                                 else{
                                                 console.log("******************************");
                                                 console.log(res);
                                                 console.log("******************************");
                                                 console.log('Updated!');
                                                 }

                                                 });*/
                                            }
                                            else{
                                                console.log("Its not in database")
                                            }
                                        }

                                    }
                                    else{

                                        console.log("no change");


                                    }

                                }
                            }

                        });
                    });
                    reqq.on('error',function(e){
                        console.log("Error isss:",e);
                    });
                    reqq.write(data);
                    reqq.end();
                }
                catch(err){
                    console.log(err);
                }
                try{

                    setTimeout(function(){
                        for(var k=0;k<ser_details.length;k++){
                            if( !(ser_details[k].hasOwnProperty("status")) && ser_details[k].status === undefined ){
                                ser_details[k].status = "not provisioned";
                                console.log("ser detail",ser_details[k].status);
                            }
                        }
                        console.log("service details",JSON.stringify(ser_details));
                        setTimeout(function(){
                            dbsoln.insert(result.docs[0],function(err,result){
                                if(!err){
                                    console.log("Succeed");
                                }
                                else{
                                    console.log("Failure");
                                }
                            });


                        },5000);

                    },10000);
                }
                catch(err){
                    console.log(err);
                }
                // }
            }
            else {
                console.log("No data available");
            }
        }
        else {
            console.log("Error retrieving data")
        }
    });
}


function status_update(uname,solnName,version){
    var count=0;
    var total_count=0;
    var dbsoln = cloudant.use("solutions");
    console.log("I am in status update")
    try{
        setTimeout(function(){
            dbsoln.find({selector:{user: uname, solution_name: solnName, version: version}},function(err,result){
                if(!err){

                    var service_status_details=result.docs[0].service_details.bluemix[0].services;
                    var runtime_status_details=result.docs[0].service_details.bluemix[0].runtime;
                    if(result.docs !== null || result.docs !== undefined){
                        if(result.docs[0].hasOwnProperty("provisioning_status") && result.docs[0].provisioning_status !== null && result.docs[0].provisioning_status !== undefined){
                            if(result.docs[0].provisioning_status[0].hasOwnProperty("bluemix_status") && result.docs[0].provisioning_status !== null && result.docs[0].provisioning_status !== undefined){
                                for(var i=0;i<service_status_details.length;i++){
                                    console.log("total count",total_count);
                                    total_count++;
                                    if(service_status_details[i].status === "provisioned"){
                                        count++;
                                    }

                                }
                                for(var j=0;j<runtime_status_details.length;j++){
                                    total_count++;
                                    if(runtime_status_details[j].status === "provisioned"){

                                        count++;
                                    }
                                }
                                console.log("total count" + total_count);
                                console.log("Count is"+count);
                                try{
                                    setTimeout(function(){
                                        if(count > 1 && count < total_count){
                                            console.log("Partialy provisioned");
                                            result.docs[0].provisioning_status[0].bluemix_status = "partially provisioned";
                                        }
                                        else if(count === total_count){
                                            console.log("provisioned");
                                            result.docs[0].provisioning_status[0].bluemix_status = "provisioned";
                                        }
                                        else{
                                            console.log("not provisioned");
                                            result.docs[0].provisioning_status[0].bluemix_status = "not provisioned";
                                        }
                                        dbsoln.insert(result.docs[0],function (err2,result2){
                                            if(!err2){
                                                console.log("Inserted into db");
                                            }
                                            else{
                                                console.log(err2);
                                            }
                                        });
                                    },20000);
                                }
                                catch(err){
                                    console.log(err);
                                }
                            }
                            else{
                                console.log("No property bluemix_status");
                            }
                        }
                        else{
                            console.log("No such property");
                        }
                    }
                    else{
                        console.log("No docs found");
                    }
                }
                else{
                    console.log(err);
                }
            })
        },10000);

    }
    catch(err){
        console.log(err);

    }

}