/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');
var solution = require('./api/solution');
var bluemixjs = require('./api/bluemix');
var mspjs = require('./api/msp');
var v2_solution=require('./api/v2/solution');
var v2_bluemixjs = require('./api/v2/bluemix');
var v2_mspjs = require('./api/v2/msp');

module.exports = function(app) {

//santhosh new code start here-->
// ************************************************************************************************************************************************
// This API creates an empty document in solution database when canvas
// initiated.
//     app.post('/api/createSolution',solution.createSolution);

//-- newly created- which creates solution of different version.
    app.post('/api/v2/modifysolutionversion',v2_solution.modifysolutionversion);

//-- newly created- which sends entire solution json to user for modification.
    app.post('/api/v2/modifySolution',solution.modifySolution);

//API to create a new structure in database.
    app.post('/api/v1/creatHybridSolution',solution.creatHybridSolution);

//API to create a new structure in database.
    app.post('/api/v1/creatMpsSolution',solution.creatMpsSolution);


// ************************************************************************************************************************************************
// This API will update the solution database whenever the user add component in
// the deployment architecture


//old one
//     app.put('/api/AddComponentToCanvas', solution.AddComponentToCanvas);

// ************************************************************************************************************************************************
// This V1 API will update the solution database whenever the user add component
// in the deployment architecture
//     app.put('/api/v1/AddComponentToCanvas', solution.v1_AddComponentToCanvas);

    app.put('/api/v2/AddComponentToCanvas', v2_solution.v2_AddComponentToCanvas);

// ************************************************************************************************************************************************
// This API will update the solution database whenever the user add bluemix
// component in the deployment architecture
//     app.put('/api/AddBMComponentToCanvas', bluemixjs.AddBMComponentToCanvas);

// ************************************************************************************************************************************************
// This V1 API will update the solution database whenever the user add bluemix
// component in the deployment architecture
//     app.put('/api/v1/AddBMComponentToCanvas', bluemixjs.v1_AddBMComponentToCanvas);

    app.post('/api/acceptdummy',v2_bluemixjs.acceptdummy);

    app.put('/api/v2/AddBMComponentToCanvas', v2_bluemixjs.v2_AddBMComponentToCanvas);


// ************************************************************************************************************************************************
// This API will update the solution database whenever the user add bluemix
// component in the deployment architecture
//     app.put('/api/AddBMRuntimeToCanvas',bluemixjs.AddBMRuntimeToCanvas);

// ************************************************************************************************************************************************
// This v1 API will update the solution database whenever the user add bluemix
// component in the deployment architecture
//     app.put('/api/v1/AddBMRuntimeToCanvas',bluemixjs.v1_AddBMRuntimeToCanvas);

    app.put('/api/v2/AddBMRuntimeToCanvas',v2_bluemixjs.v2_AddBMRuntimeToCanvas);

// ************************************************************************************************************************************************
// This API will fetch msp service info of component.
//     app.put('/api/getServiceInfo', solution.getServiceInfo);


// ************************************************************************************************************************************************
// This API will fetch msp service info of component.

//currently done, need to check
//     app.put('/api/v1/getServiceInfo',mspjs.getServiceInfo);

    app.put('/api/v2/getServiceInfo',v2_mspjs.v2_getServiceInfo);

// ************************************************************************************************************************************************
// This API will fetch service info of component.
//     app.put('/api/getBluemixServiceInfo',bluemixjs.getBluemixServiceInfo);

// ************************************************************************************************************************************************
// This V1 API will fetch service info of component.
//currently doing...
//     app.put('/api/v1/getBluemixServiceInfo',bluemixjs.v1_getBluemixServiceInfo);


    app.put('/api/v2/getBluemixServiceInfo',v2_bluemixjs.v2_getBluemixServiceInfo);

// ************************************************************************************************************************************************
// This API will fetch service info of component.
//     app.put('/api/getBluemixRuntimeInfo',bluemixjs.getBluemixRuntimeInfo);

// ************************************************************************************************************************************************
// This V1 API will fetch service info of component.
//currently doing...
//     app.put('/api/v1/getBluemixRuntimeInfo',bluemixjs.v1_getBluemixRuntimeInfo);


    app.put('/api/v2/getBluemixRuntimeInfo',v2_bluemixjs.v2_getBluemixRuntimeInfo);

// ************************************************************************************************************************************************
// This API will update msp service info of component in solution table.
//     app.put('/api/updateServiceInfo',mspjs.updateServiceInfo);

// ************************************************************************************************************************************************
// This V1 API will update service info of component in solution table.
//     app.put('/api/v1/updateServiceInfo',mspjs.v1_updateServiceInfo);

    app.put('/api/v2/updateServiceInfo',v2_mspjs.v2_updateServiceInfo);

// ************************************************************************************************************************************************
// This API will update service info of component in solution table.
//     app.put('/api/updateBMServiceInfo',bluemixjs.updateBMServiceInfo);

    app.put('/api/v2/updateBMServiceInfo',v2_bluemixjs.v2_updateBMServiceInfo);

// ************************************************************************************************************************************************
// This API will update runtime info of bluemix runtime in solution table.
//     app.put('/api/updateBMRuntimeInfo',bluemixjs.updateBMRuntimeInfo);

    app.put('/api/v2/updateBMRuntimeInfo',v2_bluemixjs.v2_updateBMRuntimeInfo);

// Now this is splitted into two - 1. canvas update , 2 connection update.
// Please refer code below
// ************************************************************************************************************************************************
// This API will update canvas info in solution table. now implemented only for
// canvas update. connection info we have to think
//     app.put('/api/updateCanvasConnectionInfo',solution.updateCanvasConnectionInfo);

// ************************************************************************************************************************************************
// This API will update canvas info in solution table. now implemented only for
// canvas update.
//     app.put('/api/updateCanvasInfo',solution.updateCanvasInfo);

    app.put('/api/v2/updateCanvasInfo',solution.v2_updateCanvasInfo);


// ************************************************************************************************************************************************
// This API will update MSP connection info in solution table.
//     app.put('/api/updateMspConnectionInfo',mspjs.updateMspConnectionInfo);

// ************************************************************************************************************************************************
// This API will update Bluemix connection info in solution table.
//     app.put('/api/updateBMConnectionInfo',bluemixjs.updateBMConnectionInfo);

// This v1 API fetches all components added in canvas along with price details
// to view bill of material
//     app.get('/api/v1/viewBillofMaterial', solution.v1_viewBillOfMaterial);


    app.get('/api/v2/viewBillofMaterial', v2_solution.v2_viewBillOfMaterial);

// This v1 API fetches all components added in canvas along with price details
// to view bill of material
//     app.get('/api/v1/viewMspBillofMaterial',solution.viewMspBillofMaterial);


    app.get('/api/v2/viewMspBillofMaterial',v2_solution.v2_viewMspBillofMaterial);

// This API fetches all components added in canvas along with price details to
// view bill of material
//     app.get('/api/viewBillofMaterial',solution.viewBillofMaterial);

// This API will fetch all the solution which are created by the user.
//     app.get('/api/viewMyDeployArch', solution.viewMyDeployArch);

//This fetches unique deployment architecture name
    app.get('/api/v2/viewMyDeployArchNames', solution.viewMyDeployArchNames);


// This V1 API will fetch all the solution which are created by the user based on version.
//     app.get('/api/v1/viewMyDeployArch', v2_solution.v1_viewMyDeployArch);

//This v2 API fetches based on solution
    app.get('/api/v2/viewMyDeployArchVersions', v2_solution.v2_viewMyDeployArchVersions);


// ************************************************************************************************************************************************
// This API will update the solution database whenever the user remove component
// in the deployment architecture
//     app.put('/api/removeComponentFromSolutiondb',solution.removeComponentFromSolutiondb);
    app.put('/api/removeComponentFromSolutiondb',solution.removeComponentFromSolutiondb);
    app.put('/api/v2/removeComponentFromSolutiondb',v2_solution.v2_removeComponentFromSolutiondb);

// ************************************************************************************************************************************************
// This API will update the solution database whenever the user remove entire the deployment architecture
//     app.post('/api/deleteSolution',solution.deleteSolution);

//Delete all version of the solution.
    app.post('/api/v2/deleteAllSolution',v2_solution.v2_deleteSolution);

//Delete particular Solution
    app.post('/api/v2/deleteSolutionVersion',v2_solution.v2_deleteSolutionVersion);

    app.get('/api/getBluemixComponentlist', bluemixjs.getBluemixComponentlist);

    app.get('/api/getBluemixComponentlists', bluemixjs.getBluemixComponentLists);

    app.get('/api/v1/getBluemixComponentlists', bluemixjs.getBluemixComponentlists);

    app.post('/api/getBluemixComponentProperties',bluemixjs.getBluemixComponentProperties);

// This is in active for getting MSP services for catalog
    app.get('/api/getMspComponentlists', mspjs.getMspComponentlists);

    app.post('/api/v1/getBluemixComponentProperties',bluemixjs.v1_getBluemixComponentProperties);

// Need to edit. jst added v1.
    app.get('/api/v1/getMspComponentlists', mspjs.getMspComponentLists);

    app.get('/api/v2/getMspComponentlists', v2_mspjs.getMspComponentLists);

// This is fetch the data those are hardcoded in our DB
    app.get('/api/getMspComponentlist',mspjs.getMspComponentlist);

    app.post('/api/getComponentPrice',mspjs.getComponentPrice);

    app.post('/api/v1/getComponentPrice',mspjs.v1_getComponentPrice);

    app.get('/api/getMspOfferings', mspjs.getMspOfferings);

    app.post('/api/login',solution.login);


    app.post('/api/getbluemixtoken',bluemixjs.getbluemixtoken);


// This API is to fetch bluemix services and insert into cloudant.
    app.get('/api/getBluemixServices', bluemixjs.getBluemixServices);
// This API provides to UI with list of services provided by bluemix along with
// a static icon.
    app.get('/api/getBluemixServicesList', bluemixjs.getBluemixServicesList);

    app.get('/api/v2/getBluemixServicesList', v2_bluemixjs.v2_getBluemixServicesList);

// This API provides to UI with list of services provided by bluemix along with
// a static icon.
    app.get('/api/old/getBluemixBuildpackList', bluemixjs.old_getBluemixBuildpackList);

    app.get('/api/getBluemixBuildpackList', bluemixjs.getBluemixBuildpackList);

// API to fetch bluemic token -- provided by Aravind
    app.get('/api/getbluemixtoken',bluemixjs.getbluemixtoken);

// This API is to fetch properties of each component and update in database.
    app.post('/api/getbluemixServicesproperties',bluemixjs.getbluemixServicesproperties);


    app.post('/api/placeOrder',solution.placeOrder);

//API to place order and to generate final order json
    app.post('/api/v1/placeOrder',solution.v1_placeOrder);

//API to place order
    app.post('/api/v2/placeOrder',solution.v2_placeOrder);

    //app.post('/api/acceptdummy',solution.acceptdummy);

//API to fetch canvas connection details.
    app.post('/api/getCanvasInfo',solution.getCanvasInfo);

    app.post('/api/v2/getCanvasInfo',v2_solution.v2_getCanvasInfo);

//To calculate Bluemix runtime pricing.
    app.post('/api/getRuntimePrice',bluemixjs.getRuntimePrice);

//This API is to calculate bluemix pricing written by kruthi
    app.post('/api/getBMServicePrice',bluemixjs.getBMServicePrice);

    app.post('/api/getOrganizations',v2_bluemixjs.getOrganizations);

    app.post('/api/getSpaces',v2_bluemixjs.getSpaces);

    app.post('/api/getToken',v2_bluemixjs.getToken);

    app.post('/api/bluemixProvisioning',v2_bluemixjs.bluemixProvisioning);

    app.post('/api/createBluemixApp',v2_bluemixjs.createBluemixApp);

    app.post('/api/updatestatus',v2_solution.updatestatus);

    //app.post('/api/updatestatus',v2_solution.updatestatus);

    app.get('/api/things',function(request,response){
        //sessionData=request.session;
        var responsejsonsso={"cookie":{"originalMaxAge":null,"expires":null,"httpOnly":true,"path":"/"},"originalUrl":"/","passport":{"user":{"id":"msp_sso-yjc6372p9t-cs19.iam.ibmcloud.com/https://w3id.tap.ibm.com/auth/sps/samlidp/saml20/santhoshmuniswami@in.ibm.com","uid":"00534S744","blueGroups":["cn=BSO-IN_AMS_IGS_INDIA,ou=memberlist,ou=ibmgroups,o=ibm.com","cn=BSO_GIN,ou=memberlist,ou=ibmgroups,o=ibm.com","cn=India_WECM,ou=memberlist,ou=ibmgroups,o=ibm.com","cn=ITSAS General Access 3,ou=memberlist,ou=ibmgroups,o=ibm.com","cn=patch - perf,ou=memberlist,ou=ibmgroups,o=ibm.com","cn=threat - perf,ou=memberlist,ou=ibmgroups,o=ibm.com","cn=user - perf,ou=memberlist,ou=ibmgroups,o=ibm.com","cn=WPPL India Non-Lenovo Employees,ou=memberlist,ou=ibmgroups,o=ibm.com","cn=com.ibm.tap.bravo.user.division,ou=memberlist,ou=ibmgroups,o=ibm.com","cn=com.ibm.tap.bravo.user,ou=memberlist,ou=ibmgroups,o=ibm.com","cn=com.ibm.tap.am.bravo,ou=memberlist,ou=ibmgroups,o=ibm.com","cn=w3hrlodes1,ou=memberlist,ou=ibmgroups,o=ibm.com","cn=BSORCH_STG_DEV,ou=memberlist,ou=ibmgroups,o=ibm.com","cn=HRMS_employees_ap,ou=memberlist,ou=ibmgroups,o=ibm.com","cn=w3km-QualityManagers-users-dynamic,ou=memberlist,ou=ibmgroups,o=ibm.com","cn=IDC_Brno_Lab_users,ou=memberlist,ou=ibmgroups,o=ibm.com","cn=k-TiedTonguesView,ou=memberlist,ou=ibmgroups,o=ibm.com","cn=Some-AP-NonLenovo,ou=memberlist,ou=ibmgroups,o=ibm.com","cn=Singapore_Group,ou=memberlist,ou=ibmgroups,o=ibm.com","cn=GBS_Asean,ou=memberlist,ou=ibmgroups,o=ibm.com","cn=w3km-ALL-I-N,ou=memberlist,ou=ibmgroups,o=ibm.com","cn=Radical-Wiki-Capilano-users,ou=memberlist,ou=ibmgroups,o=ibm.com","cn=Radical-Wiki-SDP-users,ou=memberlist,ou=ibmgroups,o=ibm.com","cn=Non-Rational,ou=memberlist,ou=ibmgroups,o=ibm.com","cn=Radical-Wiki-cdi-users,ou=memberlist,ou=ibmgroups,o=ibm.com","cn=Radical-Wiki-Common-users,ou=memberlist,ou=ibmgroups,o=ibm.com","cn=Radical-Wiki-Capilano-users-dynamic,ou=memberlist,ou=ibmgroups,o=ibm.com","cn=ibm-eus-ag.knowlagentondemand.com-in,ou=memberlist,ou=ibmgroups,o=ibm.com","cn=Rational Strategy & Roadmap Readers,ou=memberlist,ou=ibmgroups,o=ibm.com","cn=BT IT Games Event II,ou=memberlist,ou=ibmgroups,o=ibm.com","cn=rptHRMS_in,ou=memberlist,ou=ibmgroups,o=ibm.com","cn=HW Alerts DivDept,ou=memberlist,ou=ibmgroups,o=ibm.com","cn=ITM_TEMS,ou=memberlist,ou=ibmgroups,o=ibm.com","cn=LIS Regular India,ou=memberlist,ou=ibmgroups,o=ibm.com","cn=legalibm,ou=memberlist,ou=ibmgroups,o=ibm.com","cn=MSGv4,ou=memberlist,ou=ibmgroups,o=ibm.com","cn=com.ibm.v8.all.i-n,ou=memberlist,ou=ibmgroups,o=ibm.com","cn=SL322890,ou=memberlist,ou=ibmgroups,o=ibm.com","cn=DST SoftLayer Internal subAccts,ou=memberlist,ou=ibmgroups,o=ibm.com","cn=SL348074,ou=memberlist,ou=ibmgroups,o=ibm.com","cn=SL537825_vpnonly,ou=memberlist,ou=ibmgroups,o=ibm.com","cn=bcm.prod.gbsindia,ou=memberlist,ou=ibmgroups,o=ibm.com","cn=BI_PG_BACC_PROD_V10,ou=memberlist,ou=ibmgroups,o=ibm.com","cn=SL636545,ou=memberlist,ou=ibmgroups,o=ibm.com","cn=cognosprodpacom,ou=memberlist,ou=ibmgroups,o=ibm.com","cn=SC_PROXY_00_GROUP,ou=memberlist,ou=ibmgroups,o=ibm.com","cn=ibm.assetagent.installation.group,ou=memberlist,ou=ibmgroups,o=ibm.com"],"tenantId":"msp_sso-yjc6372p9t-cs19.iam.ibmcloud.com","emailaddress":"santhoshmuniswami@in.ibm.com","cn":"Santhosh Muniswami","_json":{"iss":"msp_sso-yjc6372p9t-cs19.iam.ibmcloud.com","ext":"{\"uid\":\"00534S744\",\"blueGroups\":[\"cn=BSO-IN_AMS_IGS_INDIA,ou=memberlist,ou=ibmgroups,o=ibm.com\",\"cn=BSO_GIN,ou=memberlist,ou=ibmgroups,o=ibm.com\",\"cn=India_WECM,ou=memberlist,ou=ibmgroups,o=ibm.com\",\"cn=ITSAS General Access 3,ou=memberlist,ou=ibmgroups,o=ibm.com\",\"cn=patch - perf,ou=memberlist,ou=ibmgroups,o=ibm.com\",\"cn=threat - perf,ou=memberlist,ou=ibmgroups,o=ibm.com\",\"cn=user - perf,ou=memberlist,ou=ibmgroups,o=ibm.com\",\"cn=WPPL India Non-Lenovo Employees,ou=memberlist,ou=ibmgroups,o=ibm.com\",\"cn=com.ibm.tap.bravo.user.division,ou=memberlist,ou=ibmgroups,o=ibm.com\",\"cn=com.ibm.tap.bravo.user,ou=memberlist,ou=ibmgroups,o=ibm.com\",\"cn=com.ibm.tap.am.bravo,ou=memberlist,ou=ibmgroups,o=ibm.com\",\"cn=w3hrlodes1,ou=memberlist,ou=ibmgroups,o=ibm.com\",\"cn=BSORCH_STG_DEV,ou=memberlist,ou=ibmgroups,o=ibm.com\",\"cn=HRMS_employees_ap,ou=memberlist,ou=ibmgroups,o=ibm.com\",\"cn=w3km-QualityManagers-users-dynamic,ou=memberlist,ou=ibmgroups,o=ibm.com\",\"cn=IDC_Brno_Lab_users,ou=memberlist,ou=ibmgroups,o=ibm.com\",\"cn=k-TiedTonguesView,ou=memberlist,ou=ibmgroups,o=ibm.com\",\"cn=Some-AP-NonLenovo,ou=memberlist,ou=ibmgroups,o=ibm.com\",\"cn=Singapore_Group,ou=memberlist,ou=ibmgroups,o=ibm.com\",\"cn=GBS_Asean,ou=memberlist,ou=ibmgroups,o=ibm.com\",\"cn=w3km-ALL-I-N,ou=memberlist,ou=ibmgroups,o=ibm.com\",\"cn=Radical-Wiki-Capilano-users,ou=memberlist,ou=ibmgroups,o=ibm.com\",\"cn=Radical-Wiki-SDP-users,ou=memberlist,ou=ibmgroups,o=ibm.com\",\"cn=Non-Rational,ou=memberlist,ou=ibmgroups,o=ibm.com\",\"cn=Radical-Wiki-cdi-users,ou=memberlist,ou=ibmgroups,o=ibm.com\",\"cn=Radical-Wiki-Common-users,ou=memberlist,ou=ibmgroups,o=ibm.com\",\"cn=Radical-Wiki-Capilano-users-dynamic,ou=memberlist,ou=ibmgroups,o=ibm.com\",\"cn=ibm-eus-ag.knowlagentondemand.com-in,ou=memberlist,ou=ibmgroups,o=ibm.com\",\"cn=Rational Strategy & Roadmap Readers,ou=memberlist,ou=ibmgroups,o=ibm.com\",\"cn=BT IT Games Event II,ou=memberlist,ou=ibmgroups,o=ibm.com\",\"cn=rptHRMS_in,ou=memberlist,ou=ibmgroups,o=ibm.com\",\"cn=HW Alerts DivDept,ou=memberlist,ou=ibmgroups,o=ibm.com\",\"cn=ITM_TEMS,ou=memberlist,ou=ibmgroups,o=ibm.com\",\"cn=LIS Regular India,ou=memberlist,ou=ibmgroups,o=ibm.com\",\"cn=legalibm,ou=memberlist,ou=ibmgroups,o=ibm.com\",\"cn=MSGv4,ou=memberlist,ou=ibmgroups,o=ibm.com\",\"cn=com.ibm.v8.all.i-n,ou=memberlist,ou=ibmgroups,o=ibm.com\",\"cn=SL322890,ou=memberlist,ou=ibmgroups,o=ibm.com\",\"cn=DST SoftLayer Internal subAccts,ou=memberlist,ou=ibmgroups,o=ibm.com\",\"cn=SL348074,ou=memberlist,ou=ibmgroups,o=ibm.com\",\"cn=SL537825_vpnonly,ou=memberlist,ou=ibmgroups,o=ibm.com\",\"cn=bcm.prod.gbsindia,ou=memberlist,ou=ibmgroups,o=ibm.com\",\"cn=BI_PG_BACC_PROD_V10,ou=memberlist,ou=ibmgroups,o=ibm.com\",\"cn=SL636545,ou=memberlist,ou=ibmgroups,o=ibm.com\",\"cn=cognosprodpacom,ou=memberlist,ou=ibmgroups,o=ibm.com\",\"cn=SC_PROXY_00_GROUP,ou=memberlist,ou=ibmgroups,o=ibm.com\",\"cn=ibm.assetagent.installation.group,ou=memberlist,ou=ibmgroups,o=ibm.com\"],\"tenantId\":\"msp_sso-yjc6372p9t-cs19.iam.ibmcloud.com\",\"emailaddress\":\"santhoshmuniswami@in.ibm.com\",\"cn\":\"Santhosh Muniswami\"}","at_hash":"7oDSoA47y25AgEtB13jBPQ","sub":"msp_sso-yjc6372p9t-cs19.iam.ibmcloud.com/https://w3id.tap.ibm.com/auth/sps/samlidp/saml20/santhoshmuniswami@in.ibm.com","aud":"xJqUpbqxXH","lastName":"Muniswami","firstName":"Santhosh","realmName":"https://w3id.tap.ibm.com/auth/sps/samlidp/saml20","exp":1469629858,"iat":1469629558},"accessToken":"Pyv7QBget8vF7rGzqcEWtOh28JpVQEToGGTcFd7y","refreshToken":"WTMhwYXvjAun6IvpCOi80kjisZW75HaXx6i8M5wOp9TmVYrvJF"}}};
        var sessionData=responsejsonsso;
        console.log('Inside Things--> Session Data-->'+JSON.stringify(sessionData));
        response.send(JSON.stringify(sessionData));
        //response.end();
    });

//end--->

    // All undefined asset or api routes should return a 404
    app.route('/:url(api|auth|components|app|bower_components|assets)/*')
        .get(errors[404]);

    // All other routes should redirect to the index.html
    app.route('/*')
        .get(function(req, res) {
            res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
        });
};
