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

  app.post('/api/login',solution.login);


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
