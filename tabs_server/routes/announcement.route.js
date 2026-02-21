const router = require("express").Router();
const { isTenant } = require("../middlewares/auth.middleware");
const {
  createAnnouncementController,
  deleteAnnouncementController,
  fetchAnnouncementController,
} = require("../controllers/announcement.controller");
const {
  validateBody,
  validateParams,
  validateQuery,
} = require("../middlewares/validation.middleware");
const {
  generateParamSchema,
  querySchema,
} = require("../validationSchemas/common.validation.schema");
const createAnnouncementSchema = require("../validationSchemas/announcement.validation.schema");

// create announcement route
router.post(
  "/create-announcement",
  isTenant,
  validateQuery(querySchema),
  validateBody(createAnnouncementSchema),
  createAnnouncementController
);

// delete announcement route
router.delete(
  "/delete-announcement/:aid",
  isTenant,
  validateQuery(querySchema),
  validateParams(generateParamSchema("aid")),
  deleteAnnouncementController
);

// delete announcement route
router.get(
  "/fetch-announcement",
  validateQuery(querySchema),
  fetchAnnouncementController
);

module.exports = router;
