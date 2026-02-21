const { z } = require("zod");

// Schema for adding a service
const addServiceSchema = z.object({
  name: z.string().min(3, "Service name must have atleast 3 characters"),
  charges: z.number({
    required_error: "Charges is required",
    invalid_type_error: "Charges must be a number",
  }),
  duration: z.number({
    required_error: "Charges is required",
    invalid_type_error: "Charges must be a number",
  }),
});

// Schema for updating a service
const updateServiceSchema = addServiceSchema;

module.exports = {
  addServiceSchema,
  updateServiceSchema,
};
