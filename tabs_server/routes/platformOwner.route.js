const router = require("express").Router();

const {
  // platformOwnerRegistrationController,
  platformOwnerLoginController,
  fetchOverAllStatsController,
  fetchAllTenantsForPoController,
} = require("../controllers/platformOwner.controller");
const { isPlatformOwner } = require("../middlewares/auth.middleware");
const {
  poLoginSchema,
} = require("../validationSchemas/platformOwner.validation.schema");
const { validateBody } = require("../middlewares/validation.middleware");

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

module.exports = router;
