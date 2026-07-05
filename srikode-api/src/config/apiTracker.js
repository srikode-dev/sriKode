import listEndpoints from "express-list-endpoints";

import logger from "./logger.js";

const apiTracker = (app) => {
  const endpoints = listEndpoints(app);

  let totalApis = 0;
  let publicApis = 0;
  let privateApis = 0;

  /*
  |--------------------------------------------------------------------------
  | COUNT APIS
  |--------------------------------------------------------------------------
  */

  endpoints.forEach((endpoint) => {
    totalApis += endpoint.methods.length;

    const isPrivate = endpoint.middlewares.includes("authMiddleware");

    if (isPrivate) {
      privateApis += endpoint.methods.length;
    } else {
      publicApis += endpoint.methods.length;
    }
  });

  //   Api Summary
  logger.info("🚀 API SUMMARY");
  logger.info("========================================");
  logger.info(`📦 Total APIs   : ${totalApis}`);
  logger.info(`🌐 Public APIs  : ${publicApis}`);
  logger.info(`🔒 Private APIs : ${privateApis}`);
  logger.info("========================================");

  //  API Routes
//   logger.info("📍 REGISTERED ROUTES");
//   logger.info("----------------------------------------");

//   endpoints.forEach((endpoint) => {
//     const methods = endpoint.methods.join(", ");

//     logger.info(`[${methods}] ${endpoint.path}`);
//   });

//   logger.info("----------------------------------------");
};

export default apiTracker;