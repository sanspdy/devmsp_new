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
var http=require('http');
var https=require('https');
var failure_response = {
    "status" : "failed",
    "description" : ""
};




exports.v2_AddBMRuntimeToCanvas = function(request, response) {
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
        var version=parseInt(request.body.version);
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
            dbSoln.find({selector: {solution_name: SolName, user: username, version:version}},function (err, result) {
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



exports.v2_AddBMComponentToCanvas = function(request, response) {
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
        var version=parseInt(request.body.version);
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
                host: 'devmsp.mybluemix.net',
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

                            dbSoln.find({selector: {solution_name: SolName, user: username, version:version}},
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
                                                if(result.docs !== null || result.docs !==undefined){
                                                    if(result.docs[0].hasOwnProperty("service_details") !== undefined || result.docs[0].service_details !== null) {
                                                        if (result.docs[0].hasOwnProperty("bluemix") !== undefined || result.docs[0].hasOwnProperty("bluemix") !==null) {
                                                            if (result.docs[0].bluemix !== null || (result.docs[0].bluemix[0].hasOwnProperty("services") !== null || result.docs[0].bluemix[0].hasOwnProperty("services") !== undefined)) {
                                                                result.docs[0].service_details.bluemix[0].services[compcnt] = {
                                                                    "title": result3.docs[0].title,
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




exports.getToken = function(request,response){

    var uname=request.body.uname;
    var pass=request.body.pass;

    var original_url = "api.ng.bluemix.net";
    var full_token="";
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
        + '?grant_type=password&username='+uname+'&password='+pass,
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
            //console.log(full_token);
            response.write(full_token);
            response.end();
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



}


exports.getOrganizations = function(request,response){

    var username = request.body.username;
    var password = request.body.password;

    var original_url = "api.ng.bluemix.net";
    var orgs=[];
    var full_token_new="";
    var data={};
    var options={};

    //console.log("Inside Try1");
    console.log(username);
    console.log(password);
    if(username === null){
        response.write("No username provided");
        response.end();
    }
    else if(password === null){
        response.write("No password provided");
        response.end();
    }
    else {
        gettoken();
        function gettoken() {
            data = JSON.stringify({
                "uname": username,
                "pass": password
            });
            options = {
                host: 'devmsp.mybluemix.net',
                path: '/api/getToken',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': data.length
                }

            };
            var StringDecoder = require('string_decoder').StringDecoder;
            var reqq = https.request(options, function (res1) {
                var decoder = new StringDecoder('utf8');
                console.log(options);
                console.log("dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" + data);
                console.log("Hey thereeeeeeeeeeeeeeeeeeee");
                res1.on('data', function (chunk) {
                    var text = decoder.write(chunk);
                    console.log("vhunkkkkkkkkkkkkkkkkkkkkkkkkk", text);
                    full_token_new += chunk;
                    console.log("Tokennnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn", full_token_new);


                });
                res1.on('end', function (err, result) {
                    if (err) {

                        console.log(err);
                    }
                    if (!err) {
                        console.log("ch bc",full_token_new);
                        console.log("ended");
                    }

                });
            });
            reqq.on('error', function (e) {
                //console.log(error);
                console.log("Errorrrrrrrrrrrrrrrrrrrrrrrr" + e);
            });
            reqq.write(data);
            reqq.end();

        }


        try {
            console.log("Inside try");
            setTimeout(function () {
                console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&", full_token_new);
                var options = {
                    host: original_url,
                    path: '/v2/organizations',
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': full_token_new
                    }

                };
                console.log(options);
                var entity_list = [];
                var reqq = https.request(options, function (res) {
                    console.log("I am here");
                    res.on('data', function (chunk) {
                        //var text = decoder.write(chunk);
                        //console.log("}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}",full_token_new);
                        //console.log("==============================================",text);
                        orgs += chunk;
                        console.log(orgs);
                        //orgs = JSON.parse(orgs);

                    });
                    res.on('end', function (err, result) {

                        orgs = JSON.stringify(orgs);
                        var orgs1 = JSON.parse(orgs);
                        orgs1 = JSON.parse(orgs1);
                        console.log("print orgs", orgs1);
                        if (orgs1.hasOwnProperty("code") && orgs1.code !== undefined && orgs1.code !== null && orgs1.code === 10002) {
                            response.write("Wrong credentials");
                            response.end();
                        }
                        else if (orgs1.hasOwnProperty("code") && orgs1.code !== undefined && orgs1.code !== null && orgs1.code !== 10002) {
                            response.write("Some issue with bluemix");
                            response.end();
                        }
                        else {

                        var orgs_new = orgs1.resources;
                        console.log("orgs111111111111111111111111111111111111111", orgs1);
                        console.log("orgs newwwwwwwwwwwwwwwwwwwwwwwwwww", orgs_new);
                        for (var i = 0; i < orgs_new.length; i++) {
                            child = {
                                name: orgs_new[i].entity.name,
                                space_url: orgs_new[i].entity.spaces_url
                            };
                            entity_list.push(child);


                        }
                        var final_json = {
                            "username": username,
                            "entity_list": [entity_list]

                        };
                        console.log("dgvushvsiv;osiv'peopeofepfoepfoepfpefpefoefe", final_json);
                        response.send(final_json);
                        response.end();
                    }
                    });
                });
                reqq.on('error', function () {
                    response.write("failed");
                });
                reqq.end();
            }, 3000);
        }
        catch (err) {

            console.log(err);

        }


    }
}


exports.getSpaces = function(request,response){
    var dborg = cloudant.use("organizations");
    var org_name = request.body.orgname;
    var username = request.body.uname;
    var password = request.body.pass;
    var original_url = "api.ng.bluemix.net";
    var full_token_new="";
    var space_url = request.body.space_url;
    var data={};
    var orgs=[];
    var options={};
    var space_list=[];

    if(username === null){
        response.write("No username provided");
        response.end();
    }
    else if(password === null){
        response.write("No password provided");
        response.end();
    }
    else if(org_name === null){
        response.write("No org name provided");
        response.end();
    }
    else {
        console.log("usernameeeeeeeeeeeeeeeeeeeeeeeeeee", username);
        console.log("passworddddddddddddddddddddddddddddddd", password);
        console.log("orgnameeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", org_name);

        //console.log("Inside Try1");
        console.log(username);
        console.log(password);
        gettoken();
        function gettoken() {
            data = JSON.stringify({
                "uname": username,
                "pass": password
            });
            options = {
                host: 'devmsp.mybluemix.net',
                path: '/api/getToken',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': data.length
                }

            };
            var StringDecoder = require('string_decoder').StringDecoder;
            var reqq = https.request(options, function (res1) {
                var decoder = new StringDecoder('utf8');
                console.log(options);
                console.log("dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" + data);
                console.log("Hey thereeeeeeeeeeeeeeeeeeee");
                res1.on('data', function (chunk) {
                    var text = decoder.write(chunk);
                    console.log("vhunkkkkkkkkkkkkkkkkkkkkkkkkk", text);
                    full_token_new += chunk;
                    console.log("Tokennnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn", full_token_new);


                });
                res1.on('end', function (err, result) {
                    if (err) {

                        console.log(err);
                    }
                    if (!err) {

                        console.log("ended");
                    }

                });
            });
            reqq.on('error', function (e) {
                //console.log(error);
                console.log("Errorrrrrrrrrrrrrrrrrrrrrrrr" + e);
            });
            reqq.write(data);
            reqq.end();

        }

        try {
            setTimeout(function () {
                var options = {
                    host: original_url,
                    path: space_url,
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': full_token_new
                    }

                };
                console.log(options);
                var entity_list = [];
                var req = https.request(options, function (res) {
                    console.log("I am here");
                    res.on('data', function (chunk) {
                        //var text = decoder.write(chunk);
                        //console.log("}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}",full_token_new);
                        //console.log("==============================================",text);
                        orgs += chunk;
                        console.log(orgs);
                        //orgs = JSON.parse(orgs);

                    });
                    res.on('end', function (err, result) {
                        orgs = JSON.stringify(orgs);
                        var orgs1 = JSON.parse(orgs);
                        orgs1 = JSON.parse(orgs1);
                        var orgs_new = orgs1.resources;
                        //var child={};
                        for (var i = 0; i < orgs_new.length; i++) {
                            child = {
                                "space_guid": orgs_new[i].metadata.guid,
                                "space_name": orgs_new[i].entity.name
                            };
                            space_list.push(child);
                        }

                        response.send(space_list);
                        response.end();

                    });
                });
                req.end();
            }, 3000)
        }
        catch (err) {
            console.log(err);
        }

    }
}

exports.bluemixProvisioning = function(request,response){
    var space_guid = request.body.space_guid;
    var service_name =[];
    var service_plan_guid = request.body.service_plan_guid;
    var solnName = request.body.soln_name;
    var username = request.body.username;
    var password = request.body.password;
    var uname = request.body.uname;
    var version = request.body.version;
    var full_token_new="";
    var data={};
    var options={};
    var data1='';
    var index="";
    var original_url='api.ng.bluemix.net';
    if(username === null){
        response.write("No username provided");
        response.end();
    }
    else if(password === null){
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
                console.log("inside service guid loop");
               // console.log(service_plan_guid[k]);
                var dbsoln = cloudant.use("solutions");
                dbsoln.find({selector: {user: uname, solution_name: solnName, version: version}}, function (err, result) {
                    if (!err) {
                        //console.log(k);
                        if (result.docs !== null || result.docs !== undefined) {
                            var ser_details = result.docs[0].service_details.bluemix[0].services;
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
            gettoken();
            function gettoken() {
                data = JSON.stringify({
                    "uname": username,
                    "pass": password
                });
                options = {
                    host: 'devmsp.mybluemix.net',
                    path: '/api/getToken',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': data.length
                    }

                };
                var StringDecoder = require('string_decoder').StringDecoder;
                var reqq = https.request(options, function (res1) {
                    var decoder = new StringDecoder('utf8');
                    console.log(options);
                    console.log("dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" + data);
                    console.log("Hey thereeeeeeeeeeeeeeeeeeee");
                    res1.on('data', function (chunk) {
                        var text = decoder.write(chunk);
                        console.log("vhunkkkkkkkkkkkkkkkkkkkkkkkkk", text);
                        full_token_new += chunk;
                        console.log("Tokennnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn", full_token_new);


                    });
                    res1.on('end', function (err, result) {
                        if (err) {

                            console.log(err);
                        }
                        if (!err) {

                            console.log("ended");
                        }

                    });
                });
                reqq.on('error', function (e) {
                    //console.log(error);
                    console.log("Errorrrrrrrrrrrrrrrrrrrrrrrr" + e);
                });
                reqq.write(data);
                reqq.end();

            }

            try {
                var msg = "";
                console.log("Inside Tryyyy");

                /*for(var k=0;k<10;k++){
                    (function(j){
                        setTimeout(function(){
                            console.log("Inside closure",j);
                        },1000);
                    }(k));
                }*/
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
                                                       /*if(i === service_name.length){
                                                           console.log(i);
                                                           var interval = setTimeout(function(){
                                                               db_insert(service_name,solnName,full_token_new)

                                                           },10000);
                                                           clearInterval(interval);
                                                       }
*/

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






                               // console.log("Inside closure",j);
                            },1000);
                        }(i));


                    }

                    //db_insert(service_name,solnName,full_token_new);

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

function db_insert(service_name,solnName,full_token_new,uname,version){

    console.log("Hey there");
    var original_url='api.ng.bluemix.net';
    var dbsoln = cloudant.use("solutions");
    dbsoln.find({"selector": {"solution_name": solnName,"user":uname,"version":version}}, function (err, result) {
        if (!err) {

            if (result.docs !== null || result.docs !== undefined) {

                var ser_details = result.docs[0].service_details.bluemix[0].services;
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
                        var reqq = https.request(options, function(res) {
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
exports.createBluemixApp = function(request,response){
    var username = request.body.username;
    var password = request.body.password;
    var app_name = request.body.name;
    var space_guid = request.body.space_guid;
    var memory = request.body.memory;
    var buildpack = request.body.buildpack;
    var instances = request.body.instances;
    var full_token_new = "";
    var msg = "";

    gettoken();
    function gettoken(){
        data = JSON.stringify({
            "uname":username,
            "pass":password
        });
        options = {
            host : 'devmsp.mybluemix.net',
            path : '/api/getToken',
            method : 'POST',
            headers : {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }

        };
        var StringDecoder = require('string_decoder').StringDecoder;
        var reqq = https.request(options,function(res1){
            var decoder = new StringDecoder('utf8');
            console.log(options);
            console.log("dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"+data);
            console.log("Hey thereeeeeeeeeeeeeeeeeeee");
            res1.on('data',function (chunk) {
                var text = decoder.write(chunk);
                console.log("vhunkkkkkkkkkkkkkkkkkkkkkkkkk",text);
                full_token_new += chunk;
                console.log("Tokennnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn",full_token_new);


            });
            res1.on('end',function(err,result){
                if(err){

                    console.log(err);
                }
                if(!err){

                    console.log("ended");
                }

            });
        });
        reqq.on('error',function(e){
            //console.log(error);
            console.log("Errorrrrrrrrrrrrrrrrrrrrrrrr"+e);
        });
        reqq.write(data);
        reqq.end();

    }

    try{
        setTimeout(function(){
            data = JSON.stringify({
                "space_guid":space_guid,
                "name":app_name,
                "memory":memory,
                "buildpack":buildpack,
                "instances":instances
            });
            console.log("Printing dataaaaaaaaaaaaaaaaaaaaaa",data);
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
                    response.write(msg);
                    response.end();
                });
            });
            reqst.on('error',function (e) {
                console.log(e);
            });
            reqst.write(data);
            reqst.end();
        },3000);
    }
    catch(err){
        console.log(err);
    }



}




exports.v2_getBluemixServiceInfo=function(request, response) {
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

                dbSoln.find({selector: {solution_name: SolName, user: username, version:version}},function (err, result) {
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



exports.v2_getBluemixRuntimeInfo=function(request, response) {
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
        } else if (SolName === null || SolName === '' || version === null || version === '') {
            console.log("There is no SolName & version in body");
            failure_response.description = "There is no SolName & version in body"
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

                dbSoln.find({selector: {solution_name: SolName, user: username, version:version}},function (err, result) {
                    if (!err) {
                        console.log(result);
                        if (result.docs === null || result.docs === undefined || result.docs[0] === null || result.docs[0] === undefined) {
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


exports.v2_updateBMServiceInfo=function(request, response) {
    console.log(requestMessage);
    console
        .log("*************************************************************************")
    var dbSoln = cloudant.use(dbCredentials.dbSolution);

    var username = request.body.uname;
    var SolName = request.body.solnName;
    var version=parseInt(request.body.version);
    // console.log(request.body);
    // var service_det=request.body.service_details;
    var service_name = request.body.service_name;
    var compcnt = request.body.component_cnt;
    var solution_json = JSON.parse(request.body.solnjson);
    var service_guid = request.body.service_guid;
    console.log("Response from body: "
        + JSON.stringify(solution_json));
    // console.log(JSON.stringify(solutionJson));
    // response.write(JSON.stringify(solutionJson));

    if (username === null) {
        console.log("no sufficient details. returning false info");
        var resjson = {
            "status" : "failed",
        };
        response.write(JSON.stringify(resjson));
        response.end();
    } else if (SolName == null) {
        console.log("no sufficient details. returning false info");
        var resjson = {
            "status" : "failed",
        };
        response.write(JSON.stringify(resjson));
        response.end();
    } else if (service_name == null) {
        console.log("no sufficient details. returning false info");
        var resjson = {
            "status" : "failed",
        };
        response.write(JSON.stringify(resjson));
        response.end();
    } else if (compcnt == null) {
        console.log("no sufficient details. returning false info");
        var resjson = {
            "status" : "failed",
        };
        response.write(JSON.stringify(resjson));
        response.end();
    } else if (solution_json == null) {
        console.log("no sufficient details. returning false info");
        var resjson = {
            "status" : "failed",
        };
        response.write(JSON.stringify(resjson));
        response.end();
    }

    else {
        try {
            console.log(solution_json);

            dbSoln.find({selector : {solution_name: SolName, user: username, version:version}},function(err, result) {
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
                    dbSoln.insert(result.docs[0],function(err2,result2) {
                                console.log("response from insert");
                                console.log("response from insert "+ JSON.stringify(result));
                                if (err) {
                                    console.log(err2);
                                } else {
                                    console.log("New doc created ..");
                                    setTimeout(
                                        function() {
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

                    // console.log(services);
                    // response.write(JSON.stringify(services));
                    // response.end();
                } else {
                    var errMessage = "Error occurred while accessing components : \n"+ JSON.stringify(err);
                    response.write(errMessage);
                    console.log(errMessage);
                    response.end();
                    console.log(responseMessage);
                    setTimeout(
                        function() {
                            console.log("*** Request Responded ***");
                            response.write("{status: failed}");
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

exports.v2_updateBMRuntimeInfo=function(request, response) {
    console.log(requestMessage);
    console.log("*************************************************************************")
    var dbSoln = cloudant.use(dbCredentials.dbSolution);

    var username = request.body.uname;
    var SolName = request.body.solnName;
    var version=parseInt(request.body.version);
    // console.log(request.body);
    var service_det = request.body.service_details;
    var service_name = request.body.service_name;
    var compcnt = request.body.component_cnt;
    var solution_json = JSON.parse(request.body.solnjson);
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

            dbSoln.find({selector : {solution_name : SolName}},function(err, result) {
                if (!err) {
                    // var services=
                    // result.docs[0].service_details.msp[compcnt];

                    result.docs[0].service_details.bluemix[0].runtime[compcnt] = solution_json;
                    dbSoln.insert(result.docs[0],function(err2,result2) {
                        console.log("response from insert");
                        console.log("response from insert "+ JSON.stringify(result));
                        if (err) {
                            console.log(err2);
                        } else {
                            console.log("New doc created ..");
                            setTimeout(
                                function() {
                                    console.log("*** Request Responded ***");
                                    var resjson = {
                                        "status" : "success",
                                    };
                                    response.write(JSON.stringify(resjson));
                                    response.end();
                                },1000);
                        }

                    });

                    // console.log(services);
                    // response.write(JSON.stringify(services));
                    // response.end();
                } else {
                    var errMessage = "Error occurred while accessing components : \n"+ JSON.stringify(err);
                    response.write(errMessage);
                    console.log(errMessage);
                    response.end();
                    console.log(responseMessage);
                    setTimeout(
                        function() {
                            console.log("*** Request Responded ***");
                            response.write("{status: failed}");
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