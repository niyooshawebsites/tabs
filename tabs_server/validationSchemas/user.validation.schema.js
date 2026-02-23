const { z } = require("zod");

// registration schema
const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be more than 3 letters")
    .regex(
      /^[a-z0-9]+$/,
      "Username must contain only lowercase letters and numbers, no spaces or special characters",
    ),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  profession: z
    .string()
    .min(1, "Profession is required!")
    .regex(
      /^[a-zA-Z\s]+$/,
      "Profession must contain only letters and spaces (no numbers or special characters)",
    ),
});

// login schema
const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string("Password is required"),
});

// update user schema
const updateUserSchema = z.object({
  password: z.string().min(3, "Password must be at least 6 characters long"),
});

// create user schema
const createUserSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password too short"),
  role: z.number().refine((val) => val === 2 || val === 3, {
    message: "Role must be 2 (Tenant) or 3 (Platform Admin)",
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  updateUserSchema,
  createUserSchema,
};
