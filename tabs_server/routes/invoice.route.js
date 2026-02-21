const router = require("express").Router();
const generateInvoiceController = require("../controllers/invoice.controller");
const { isTenantOrStaff } = require("../middlewares/auth.middleware");
const {
  validateParams,
  validateQuery,
} = require("../middlewares/validation.middleware");
const {
  generateParamSchema,
  querySchema,
} = require("../validationSchemas/common.validation.schema");

router.get(
  "/generate-invoice/:aid",
  isTenantOrStaff,
  validateQuery(querySchema),
  validateParams(generateParamSchema("aid")),
  generateInvoiceController
);

module.exports = router;
