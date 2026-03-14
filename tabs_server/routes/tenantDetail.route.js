const router = require("express").Router();
const {
  addTenantDetailController,
  updateTenantDetailController,
  fetchTenantDetailController,
  fetchAllTenantDetailForPlatformOwnerController,
  fetchAFilteredTenantDetailForPlatformOwnerController,
} = require("../controllers/tenantDetail.controller");
const { isTenant, isPlatformOwner } = require("../middlewares/auth.middleware");
const {
  validateBody,
  validateQuery,
} = require("../middlewares/validation.middleware");
const {
  addTenantDetailSchema,
  updateTenantDetailSchema,
} = require("../validationSchemas/tenantDetail.validation.schema");

const {
  querySchema,
} = require("../validationSchemas/common.validation.schema");

// // add plaform owner details
// router.post(
//   "/add-platform-owner-details",
//   isPlatformOwner,
//   validateQuery(querySchema),
//   validateBody(addAdminDetailsSchema),
//   addPlatformOwnerDetailsController,
// );

// // update plaform owner details
// router.patch(
//   "/update-platform-owner-details",
//   isPlatformOwner,
//   validateQuery(querySchema),
//   validateBody(addAdminDetailsSchema),
//   updatePlatformOwnerDetailsController,
// );

// add tenant details route
router.post(
  "/add-tenant-detail",
  isTenant,
  validateQuery(querySchema),
  validateBody(addTenantDetailSchema),
  addTenantDetailController,
);

// update tenant details route
router.patch(
  "/update-tenant-detail",
  isTenant,
  validateQuery(querySchema),
  validateBody(updateTenantDetailSchema),
  updateTenantDetailController,
);

// fetch tenant details route
router.get(
  "/fetch-tenant-detail",
  validateQuery(querySchema),
  fetchTenantDetailController,
);

// fetch alls tenant for platform owner route
router.get(
  "/fetch-all-tenant-detail-for-platform-owner",
  isPlatformOwner,
  validateQuery(querySchema),
  fetchAllTenantDetailForPlatformOwnerController,
);

// fetch alls tenants for platform owner route
router.get(
  "/fetch-filtered-tenant-detail-for-platform-owner",
  isPlatformOwner,
  validateQuery(querySchema),
  fetchAFilteredTenantDetailForPlatformOwnerController,
);

module.exports = router;
