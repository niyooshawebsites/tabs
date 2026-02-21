const router = require("express").Router();
const {
  addServiceController,
  fetchAllServicesAtOnceController,
  fetchAllServicesController,
  fetchServiceController,
  updateAServiceController,
  deleteAServiceController,
} = require("../controllers/service.controller");

const { isTenant } = require("../middlewares/auth.middleware");

const {
  validateBody,
  validateQuery,
  validateParams,
} = require("../middlewares/validation.middleware");

const {
  addServiceSchema,
  updateServiceSchema,
} = require("../validationSchemas/service.validation.schema");

const {
  querySchema,
  generateParamSchema,
} = require("../validationSchemas/common.validation.schema");

// add a service route
router.post(
  "/add-service/:uid",
  isTenant,
  validateParams(generateParamSchema("uid")),
  validateBody(addServiceSchema),
  addServiceController
);

// fetch all services at once route
router.get(
  "/fetch-all-services",
  validateQuery(querySchema),
  fetchAllServicesController
);

// fetch all services route
router.get(
  "/fetch-all-services-at-once",
  validateQuery(querySchema),
  fetchAllServicesAtOnceController
);

// fetch a service for a tenant
router.get(
  "/fetch-service/:sid",
  validateQuery(querySchema),
  validateParams(generateParamSchema("sid")),
  fetchServiceController
);

// update a service route
router.patch(
  "/update-service/:sid",
  isTenant,
  validateQuery(querySchema),
  validateParams(generateParamSchema("sid")),
  validateBody(updateServiceSchema),
  updateAServiceController
);

// delete a service route
router.delete(
  "/delete-service/:sid",
  isTenant,
  validateQuery(querySchema),
  validateParams(generateParamSchema("sid")),
  deleteAServiceController
);

module.exports = router;
