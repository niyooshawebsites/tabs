const router = require("express").Router();

const {
  // platformOwnerRegistrationController,
  platformOwnerLoginController,
  fetchOverAllStatsController,
  fetchAllTenantsForPoController,
  fetchTenantDetailForPoController,
  fetchTenantAppointmentsForPoController,
  fetchFilteredTenantAppointmentsForPoController,
  fetchTenantClientsForPoController,
} = require("../controllers/platformOwner.controller");
const { isPlatformOwner } = require("../middlewares/auth.middleware");
const {
  poLoginSchema,
} = require("../validationSchemas/platformOwner.validation.schema");

const {
  querySchema,
  generateParamSchema,
} = require("../validationSchemas/common.validation.schema");
const {
  validateBody,
  validateQuery,
} = require("../middlewares/validation.middleware");

// router.post("/po-registration", platformOwnerRegistrationController);

router.post(
  "/po-login",
  validateBody(poLoginSchema),
  platformOwnerLoginController,
);

router.get(
  "/fetch-overall-stats",
  isPlatformOwner,
  fetchOverAllStatsController,
);

router.get(
  "/fetch-all-tenants-for-po",
  isPlatformOwner,
  fetchAllTenantsForPoController,
);

router.get(
  "/fetch-tenant-detail-for-po",
  isPlatformOwner,
  fetchTenantDetailForPoController,
);

router.get(
  "/fetch-tenant-appointments-for-po",
  isPlatformOwner,
  fetchTenantAppointmentsForPoController,
);

router.get(
  "/fetch-filtered-tenant-appointments-for-po",
  isPlatformOwner,
  validateQuery(querySchema),
  fetchFilteredTenantAppointmentsForPoController,
);

router.get(
  "/fetch-tenant-clients-for-po",
  isPlatformOwner,
  validateQuery(querySchema),
  fetchTenantClientsForPoController,
);

module.exports = router;
