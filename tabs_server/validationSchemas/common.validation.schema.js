const { z } = require("zod");

const querySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : undefined))
    .refine((val) => val === undefined || (!isNaN(val) && val > 0), {
      message: "Limit must be a positive number",
    }),

  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : undefined))
    .refine((val) => val === undefined || (!isNaN(val) && val > 0), {
      message: "Limit must be a positive number",
    }),
});

const generateParamSchema = (paramKey, message = "Invalid or missing ID") => {
  return z.object({
    [paramKey]: z
      .string({
        required_error: `${paramKey} is required`,
        invalid_type_error: `${paramKey} must be a string`,
      })
      .min(1, message),
  });
};

module.exports = { querySchema, generateParamSchema };
