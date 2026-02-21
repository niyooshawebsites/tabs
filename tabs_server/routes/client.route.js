const router = require("express").Router();

const {
  fetchAllClientsController,
  fetchAClientController,
  fetchAClientByPhoneController,
  fetchAllClientsForPlatformOwnerController,
} = require("../controllers/client.controller");

const {
  isTenantOrStaff,
  isPlatformOwner,
} = require("../middlewares/auth.middleware");

const {
  validateQuery,
  validateParams,
} = require("../middlewares/validation.middleware");

const {
  querySchema,
  generateParamSchema,
} = require("../validationSchemas/common.validation.schema");

// fetch all clients for a tenant route
router.get(
  "/fetch-all-clients",
  isTenantOrStaff,
  validateQuery(querySchema),
  fetchAllClientsController
);

// fetch a client route
router.get(
  "/fetch-client/:cid",
  isTenantOrStaff,
  validateQuery(querySchema),
  validateParams(generateParamSchema("cid")),
  fetchAClientController
);

// fetch a client by phone route
router.get(
  "/fetch-client-by-client-info/:clientInfo",
  isTenantOrStaff,
  validateQuery(querySchema),
  validateParams(generateParamSchema("clientInfo")),
  fetchAClientByPhoneController
);

// fetch all clients for platform owner route
router.get(
  "/fetch-all-clients-for-platform-owner",
  isPlatformOwner,
  validateQuery(querySchema),
  fetchAllClientsForPlatformOwnerController
);

module.exports = router;
