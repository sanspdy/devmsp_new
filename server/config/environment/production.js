'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip:       process.env.VCAP_APP_HOST ||
            undefined,

  // Server port
  port:     process.env.VCAP_APP_PORT ||
            8080
    
};