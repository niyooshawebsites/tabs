const router = require("express").Router();

const {
  addLocationController,
  updateLocationController,
  fetchALocationController,
  fetchAllLocationsController,
  fetchAllLocationsAtOnceController,
  deleteALocationController,
} = require("../controllers/location.controller");

const { isTenant } = require("../middlewares/auth.middleware");

const {
  validateBody,
  validateParams,
  validateQuery,
} = require("../middlewares/validation.middleware");

const {
  addLocationSchema,
  updateLocationSchema,
} = require("../validationSchemas/location.validation.schema");

const {
  querySchema,
  generateParamSchema,
} = require("../validationSchemas/common.validation.schema");

// add location route
router.post(
  "/add-location/:uid",
  isTenant,
  validateParams(generateParamSchema("uid")),
  validateBody(addLocationSchema),
  addLocationController,
);

// update location route
router.patch(
  "/update-location/:lid",
  isTenant,
  validateParams(generateParamSchema("lid")),
  validateQuery(querySchema),
  validateBody(updateLocationSchema),
  updateLocationController,
);

// get a location route
router.get(
  "/fetch-a-location/:lid",
  isTenant,
  validateParams(generateParamSchema("lid")),
  validateQuery(querySchema),
  fetchALocationController,
);

// get location route
// router.get(
//   "/fetch-all-locations",
//   isTenant,
//   validateQuery(querySchema),
//   fetchAllLocationsController,
// );

router.get(
  "/fetch-all-locations",
  validateQuery(querySchema),
  fetchAllLocationsController,
);

// fetch all locations route
router.get(
  "/fetch-all-locations-at-once",
  validateQuery(querySchema),
  fetchAllLocationsAtOnceController,
);

// delete location route
router.delete(
  "/delete-a-location/:lid",
  isTenant,
  validateParams(generateParamSchema("lid")),
  validateQuery(querySchema),
  deleteALocationController,
);

module.exports = router;
