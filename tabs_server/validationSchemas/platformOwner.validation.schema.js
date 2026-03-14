const { z } = require("zod");

// login schema
const poLoginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string("Password is required"),
});

module.exports = { poLoginSchema };
