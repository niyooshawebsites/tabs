const router = require("express").Router();
const {
  tenantRegistrationController,
  tenantLoginController,
  updateTenantController,
  doesTenantExistController,
  fetchAllTenantsForPOController,
} = require("../controllers/tenant.controller");

const { isTenant, isPlatformOwner } = require("../middlewares/auth.middleware");

const {
  validateBody,
  validateParams,
} = require("../middlewares/validation.middleware");

const {
  registerSchema,
  loginSchema,
  updateUserSchema,
} = require("../validationSchemas/tenant.validation.schema");

const {
  generateParamSchema,
} = require("../validationSchemas/common.validation.schema");

// register route
router.post(
  "/tenant-registration",
  validateBody(registerSchema),
  tenantRegistrationController,
);

// login route
router.post("/tenant-login", validateBody(loginSchema), tenantLoginController);

// update tenant route
router.patch(
  "/update-tenant-password/:uid",
  isTenant,
  validateParams(generateParamSchema("uid")),
  validateBody(updateUserSchema),
  updateTenantController,
);

router.get("/does-tenant-exist", doesTenantExistController);

router.get(
  "/fetch-all-tenants-for-po",
  isPlatformOwner,
  fetchAllTenantsForPOController,
);

module.exports = router;
