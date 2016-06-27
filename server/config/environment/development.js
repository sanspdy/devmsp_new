'use strict';

// Development specific configuration
// ==================================
module.exports = {

    //Fill Cloudant connection credentials
     CHOST: "535f6c6d-5347-40a0-a3d0-24a56444aa3d-bluemix.cloudant.com",
     CPORT: "443",
     CUSER: "535f6c6d-5347-40a0-a3d0-24a56444aa3d-bluemix",
     CPASSWORD: "c7da9db3fd6edecacd9d7386745c0cdcb6966fb1c2dfaf1a000d00911564bdd8",
     CURL: "https://535f6c6d-5347-40a0-a3d0-24a56444aa3d-bluemix:c7da9db3fd6edecacd9d7386745c0cdcb6966fb1c2dfaf1a000d00911564bdd8@535f6c6d-5347-40a0-a3d0-24a56444aa3d-bluemix.cloudant.com",

    //Used for seeding database
    seedDB: false,
    ROOT_DOC: "opportunities",
    ROOT_DB: "opportunity_master",
    ROOT_DB_DEAL: "deal_details"
};
