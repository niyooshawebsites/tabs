const router = require("express").Router();
const {
  registerController,
  loginController,
  logoutController,
  updateUserController,
  doesTenantExistController,
} = require("../controllers/user.controller");

const { isTenant } = require("../middlewares/auth.middleware");

const {
  validateBody,
  validateParams,
  validateQuery,
} = require("../middlewares/validation.middleware");

const {
  registerSchema,
  loginSchema,
  updateUserSchema,
} = require("../validationSchemas/user.validation.schema");

const {
  querySchema,
  generateParamSchema,
} = require("../validationSchemas/common.validation.schema");

// register route
router.post("/register", validateBody(registerSchema), registerController);

// login route
router.post("/login", validateBody(loginSchema), loginController);

// logout route
router.post("/logout", logoutController);

// update tenant route
router.patch(
  "/update-tenant/:uid",
  isTenant,
  validateParams(generateParamSchema("uid")),
  validateBody(updateUserSchema),
  updateUserController
);

router.get("/does-tenant-exist", doesTenantExistController);

module.exports = router;
