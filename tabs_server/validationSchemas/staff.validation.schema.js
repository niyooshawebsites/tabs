const { z } = require("zod");
const mongoose = require("mongoose");

// ObjectId validation schema
const objectIdSchema = z
  .string()
  .trim()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid Object Id",
  });

// Staff creation schema
const staffCreationSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be more than 3 letters")
    .max(50, "Name must be less than 50 letters")
    .regex(
      /^[A-Za-z]+(?: [A-Za-z]+)*$/,
      "Name must contain only letters and single spaces (e.g., 'John Doe')",
    ),

  email: z.email("Invalid email address"),

  empId: z
    .string()
    .min(1, "Employee ID must be more than 1 letter")
    .regex(
      /^[A-Za-z0-9]+$/,
      "Employee ID must contain only letters and numbers, no spaces or special characters",
    ),

  password: z.string().min(6, "Password must be at least 6 characters long"),

  sid: z.array(objectIdSchema).nonempty("Select at least one service"),
  lid: z.string(objectIdSchema).nonempty("Select at least one location"),
});

// login schema
const staffLoginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string("Password is required"),
});

// updation schema
const staffUpdationSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be more than 3 letters")
    .max(50, "Name must be less than 50 letters")
    .regex(
      /^[a-z]+(?: [a-z]+)*$/,
      "Name must contain only lowercase letters and single spaces (e.g., 'john doe')",
    ),

  email: z.email("Invalid email address"),
  empId: z
    .string()
    .min(1, "Name must be more than 1 letters")
    .regex(
      /^[a-z0-9]+$/,
      "Username must contain only lowercase letters and numbers, no spaces or special characters",
    ),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  sid: z.array(objectIdSchema).nonempty("Select at least one service"), // ensures array is not empty
});

module.exports = { staffCreationSchema, staffLoginSchema, staffUpdationSchema };
