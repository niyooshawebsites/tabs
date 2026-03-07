const router = require("express").Router();
const {
  tenantRegistrationController,
  tenantLoginController,
  logoutController,
  updateTenantController,
  doesTenantExistController,
} = require("../controllers/tenant.controller");

const { isTenant } = require("../middlewares/auth.middleware");

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

// logout route
router.post("/logout", logoutController);

// update tenant route
router.patch(
  "/update-tenant-password/:uid",
  isTenant,
  validateParams(generateParamSchema("uid")),
  validateBody(updateUserSchema),
  updateTenantController,
);

router.get("/does-tenant-exist", doesTenantExistController);

module.exports = router;
