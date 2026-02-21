const { z } = require("zod");

// add location schema
const addLocationSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be more than 3 letters")
    .max(50, "Name must be less than 50 letters")
    .regex(
      /^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/,
      "Name must contain only letters, numbers, and single spaces"
    ),
});

// Update location schema
const updateLocationSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be more than 3 letters")
    .max(50, "Name must be less than 50 letters")
    .regex(
      /^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/,
      "Name must contain only letters, numbers, and single spaces"
    ),
});

module.exports = { addLocationSchema, updateLocationSchema };
