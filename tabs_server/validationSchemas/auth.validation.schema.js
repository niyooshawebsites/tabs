const { z } = require("zod");

const forgotPasswordSchema = z.object({
  accountType: z.string(),
  email: z.email("Invalid email address"),
});

const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters long"),
  confirmPassword: z
    .string()
    .min(6, "Password must be at least 6 characters long"),
});

module.exports = {
  forgotPasswordSchema,
  resetPasswordSchema,
};
