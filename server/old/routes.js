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

  // Insert routes below




// deleted some code here.

// Backup to be deleted

// ************************************************************************************************************************************************
// This API creates an empty document in solution database when canvas
// initiated.
  app.post('/api/createSolution',solution.createSolution);

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
  app.put('/api/AddComponentToCanvas', solution.AddComponentToCanvas);

// ************************************************************************************************************************************************
// This V1 API will update the solution database whenever the user add component
// in the deployment architecture
  app.put('/api/v1/AddComponentToCanvas', solution.v1_AddComponentToCanvas);

  app.put('/api/v2/AddComponentToCanvas', v2_solution.v2_AddComponentToCanvas);

// ************************************************************************************************************************************************
// This API will update the solution database whenever the user add bluemix
// component in the deployment architecture
  app.put('/api/AddBMComponentToCanvas', bluemixjs.AddBMComponentToCanvas);

// ************************************************************************************************************************************************
// This V1 API will update the solution database whenever the user add bluemix
// component in the deployment architecture
  app.put('/api/v1/AddBMComponentToCanvas', bluemixjs.v1_AddBMComponentToCanvas);

  app.put('/api/v2/AddBMComponentToCanvas', v2_bluemixjs.v2_AddBMComponentToCanvas);


// ************************************************************************************************************************************************
// This API will update the solution database whenever the user add bluemix
// component in the deployment architecture
  app.put('/api/AddBMRuntimeToCanvas',bluemixjs.AddBMRuntimeToCanvas);

// ************************************************************************************************************************************************
// This v1 API will update the solution database whenever the user add bluemix
// component in the deployment architecture
  app.put('/api/v1/AddBMRuntimeToCanvas',bluemixjs.v1_AddBMRuntimeToCanvas);

  app.put('/api/v2/AddBMRuntimeToCanvas',v2_bluemixjs.v2_AddBMRuntimeToCanvas);

// ************************************************************************************************************************************************
// This API will fetch msp service info of component.
  app.put('/api/getServiceInfo', solution.getServiceInfo);


// ************************************************************************************************************************************************
// This API will fetch msp service info of component.

//currently done, need to check
  app.put('/api/v1/getServiceInfo',mspjs.getServiceInfo);

  app.put('/api/v2/getServiceInfo',v2_mspjs.v2_getServiceInfo);


// ************************************************************************************************************************************************
// This API will fetch service info of component.
  app.put('/api/getBluemixServiceInfo',bluemixjs.getBluemixServiceInfo);

// ************************************************************************************************************************************************
// This V1 API will fetch service info of component.
//currently doing...
  app.put('/api/v1/getBluemixServiceInfo',bluemixjs.v1_getBluemixServiceInfo);


  app.put('/api/v2/getBluemixServiceInfo',v2_bluemixjs.v2_getBluemixServiceInfo);

// ************************************************************************************************************************************************
// This API will fetch service info of component.
  app.put('/api/getBluemixRuntimeInfo',bluemixjs.getBluemixRuntimeInfo);

// ************************************************************************************************************************************************
// This V1 API will fetch service info of component.
//currently doing...
  app.put('/api/v1/getBluemixRuntimeInfo',bluemixjs.v1_getBluemixRuntimeInfo);


  app.put('/api/v2/getBluemixRuntimeInfo',v2_bluemixjs.v2_getBluemixRuntimeInfo);

// ************************************************************************************************************************************************
// This API will update msp service info of component in solution table.
  app.put('/api/updateServiceInfo',mspjs.updateServiceInfo);

// ************************************************************************************************************************************************
// This V1 API will update service info of component in solution table.
  app.put('/api/v1/updateServiceInfo',mspjs.v1_updateServiceInfo);

  app.put('/api/v2/updateServiceInfo',v2_mspjs.v2_updateServiceInfo);

// ************************************************************************************************************************************************
// This API will update service info of component in solution table.
  app.put('/api/updateBMServiceInfo',bluemixjs.updateBMServiceInfo);


  app.put('/api/v2/updateBMServiceInfo',v2_bluemixjs.v2_updateBMServiceInfo);

// ************************************************************************************************************************************************
// This API will update runtime info of bluemix runtime in solution table.
  app.put('/api/updateBMRuntimeInfo',bluemixjs.updateBMRuntimeInfo);

  app.put('/api/v2/updateBMRuntimeInfo',v2_bluemixjs.v2_updateBMRuntimeInfo);

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

  app.put('/api/v2/updateCanvasInfo',solution.v2_updateCanvasInfo);


// ************************************************************************************************************************************************
// This API will update MSP connection info in solution table.
  app.put('/api/updateMspConnectionInfo',mspjs.updateMspConnectionInfo);

// ************************************************************************************************************************************************
// This API will update Bluemix connection info in solution table.
  app.put('/api/updateBMConnectionInfo',bluemixjs.updateBMConnectionInfo);

// This v1 API fetches all components added in canvas along with price details
// to view bill of material
  app.get('/api/v1/viewBillofMaterial', solution.v1_viewBillOfMaterial);


  app.get('/api/v2/viewBillofMaterial', v2_solution.v2_viewBillOfMaterial);

// This v1 API fetches all components added in canvas along with price details
// to view bill of material
  app.get('/api/v1/viewMspBillofMaterial',solution.viewMspBillofMaterial);


  app.get('/api/v2/viewMspBillofMaterial',v2_solution.v2_viewMspBillofMaterial);

// This API fetches all components added in canvas along with price details to
// view bill of material
  app.get('/api/viewBillofMaterial',solution.viewBillofMaterial);

// This API will fetch all the solution which are created by the user.
  app.get('/api/viewMyDeployArch', solution.viewMyDeployArch);

//This fetches unique deployment architecture name
  app.get('/api/v2/viewMyDeployArchNames', solution.viewMyDeployArchNames);


// This V1 API will fetch all the solution which are created by the user based on version.
  app.get('/api/v1/viewMyDeployArch', v2_solution.v1_viewMyDeployArch);

//This v2 API fetches based on solution
  app.get('/api/v2/viewMyDeployArchVersions', v2_solution.v2_viewMyDeployArchVersions);


// ************************************************************************************************************************************************
// This API will update the solution database whenever the user remove component
// in the deployment architecture
  app.put('/api/removeComponentFromSolutiondb',solution.removeComponentFromSolutiondb);

  app.put('/api/v2/removeComponentFromSolutiondb',v2_solution.v2_removeComponentFromSolutiondb);

// ************************************************************************************************************************************************
// This API will update the solution database whenever the user remove entire the deployment architecture
  app.post('/api/deleteSolution',solution.deleteSolution);

//Delete all version
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

  app.post('/api/acceptdummy',solution.acceptdummy);

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




  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
};
