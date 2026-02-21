const router = require("express").Router();
const {
  addAdminDetailsController,
  updateAdminDetailsController,
  fetchAdminDetailsController,
  fetchAllAdminsForPlatformOwnerController,
  fetchAFilteredAdminDetailsForPlatformOwnerController,
  addPlatformOwnerDetailsController,
  updatePlatformOwnerDetailsController,
} = require("../controllers/admin.controller");
const { isTenant, isPlatformOwner } = require("../middlewares/auth.middleware");
const {
  validateBody,
  validateQuery,
} = require("../middlewares/validation.middleware");
const {
  addAdminDetailsSchema,
  updateAdminDetailsSchema,
} = require("../validationSchemas/admin.validation.schema");

const {
  querySchema,
} = require("../validationSchemas/common.validation.schema");

// add plaform owner details
router.post(
  "/add-platform-owner-details",
  isPlatformOwner,
  validateQuery(querySchema),
  validateBody(addAdminDetailsSchema),
  addPlatformOwnerDetailsController
);

// update plaform owner details
router.patch(
  "/update-platform-owner-details",
  isPlatformOwner,
  validateQuery(querySchema),
  validateBody(addAdminDetailsSchema),
  updatePlatformOwnerDetailsController
);

// add admin details route
router.post(
  "/add-admin-details",
  isTenant,
  validateQuery(querySchema),
  validateBody(addAdminDetailsSchema),
  addAdminDetailsController
);

// update admin details route
router.patch(
  "/update-admin-details",
  isTenant,
  validateQuery(querySchema),
  validateBody(updateAdminDetailsSchema),
  updateAdminDetailsController
);

// fetch admin details route
router.get(
  "/fetch-admin-details",
  validateQuery(querySchema),
  fetchAdminDetailsController
);

// fetch alls admins for platform owner route
router.get(
  "/fetch-all-admin-details-for-platform-owner",
  isPlatformOwner,
  validateQuery(querySchema),
  fetchAllAdminsForPlatformOwnerController
);

// fetch alls admins for platform owner route
router.get(
  "/fetch-filtered-admin-details-for-platform-owner",
  isPlatformOwner,
  validateQuery(querySchema),
  fetchAFilteredAdminDetailsForPlatformOwnerController
);

module.exports = router;
