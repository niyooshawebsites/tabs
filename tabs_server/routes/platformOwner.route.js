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
  fetchTenantAppointmentDetailsForPoController,
  fetchClientAppointmentsForPoController,
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
  validateParams,
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

router.get(
  "/fetch-an-appointment-for-po",
  isPlatformOwner,
  validateQuery(querySchema),
  fetchTenantAppointmentDetailsForPoController,
);

// fetch all appointments for a client
router.get(
  "/fetch-client-appointments-for-po/:cid",
  isPlatformOwner,
  validateParams(generateParamSchema("cid")),
  validateQuery(querySchema),
  fetchClientAppointmentsForPoController,
);

module.exports = router;
