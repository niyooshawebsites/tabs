const router = require("express").Router();

const {
  staffCreationController,
  staffLoginController,
  staffLogoutController,
  updateStaffPasswordController,
  updateStaffDetailsController,
  fetchAStaffController,
  fetchStaffController,
  deleteAStaffController,
} = require("../controllers/staff.controller");

const { isTenant, isStaff } = require("../middlewares/auth.middleware");

const {
  validateBody,
  validateParams,
  validateQuery,
} = require("../middlewares/validation.middleware");

const {
  staffCreationSchema,
  staffLoginSchema,
  staffUpdationSchema,
} = require("../validationSchemas/staff.validation.schema");

const {
  querySchema,
  generateParamSchema,
} = require("../validationSchemas/common.validation.schema");

// create staff route
router.post(
  "/create-staff/:uid",
  isTenant,
  validateParams(generateParamSchema("uid")),
  validateBody(staffCreationSchema),
  staffCreationController
);

// login staff route
router.post(
  "/staff-login",
  validateBody(staffLoginSchema),
  staffLoginController
);

// staff logout route
router.post("/staff-logout", staffLogoutController);

// update staff route
router.patch(
  "/update-staff-details/:staffId",
  isTenant,
  validateParams(generateParamSchema("staffId")),
  validateQuery(querySchema),
  validateBody(staffUpdationSchema),
  updateStaffDetailsController
);

// update password staff route
router.patch(
  "/update-staff-password/:staffId",
  isStaff,
  validateParams(generateParamSchema("staffId")),
  validateBody(staffUpdationSchema),
  updateStaffPasswordController
);

// get a staff route
router.get(
  "/fetch-a-staff/:staffId",
  isTenant,
  validateParams(generateParamSchema("staffId")),
  validateQuery(querySchema),
  fetchAStaffController
);

// get staff route
router.get(
  "/fetch-staff",
  isTenant,
  validateQuery(querySchema),
  fetchStaffController
);

// delete staff route
router.delete(
  "/delete-a-staff/:staffId",
  isTenant,
  validateParams(generateParamSchema("staffId")),
  validateQuery(querySchema),
  deleteAStaffController
);

module.exports = router;
