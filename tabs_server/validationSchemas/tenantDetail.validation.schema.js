const { z } = require("zod");

// Working days = simple array of strings
const workingDaysSchema = z.array(z.string().min(1), {
  required_error: "Working days are required",
});

// // Full day time
// const fullDaySchema = z.object({
//   start: z.string(),
//   end: z.string(),
// });

// // Part day time
// const partDaySchema = z.object({
//   morningStart: z.string().min(1, "Morning start time is required"),
//   morningEnd: z.string().min(1, "Morning end time is required"),
//   eveningStart: z.string().min(1, "Evening start time is required"),
//   eveningEnd: z.string().min(1, "Evening end time is required"),
// });

// Main timings schema
const timingsSchema = z.discriminatedUnion("shiftType", [
  // FULL TIME
  z.object({
    shiftType: z.literal("full"),
    fullDay: z.object({
      start: z.string().min(1, "Start time is required"),
      end: z.string().min(1, "End time is required"),
    }),
  }),

  // PART TIME
  z.object({
    shiftType: z.literal("part"),
    partDay: z.object({
      morningStart: z.string().min(1, "Morning start time is required"),
      morningEnd: z.string().min(1, "Morning end time is required"),
      eveningStart: z.string().min(1, "Evening start time is required"),
      eveningEnd: z.string().min(1, "Evening end time is required"),
    }),
  }),
]);

const addTenantDetailSchema = z.object({
  legalName: z.string().min(3, "Legal name must be greater than 3 characters"),
  gstNo: z.string().optional(),
  isDoctor: z.enum(["yes", "no"]),
  name: z.string().optional(),
  experience: z.string().optional(),
  proffessinalCourse: z.string().optional(),
  email: z.email(),
  phone: z.string().min(10).max(10),
  altPhone: z.string().optional(),
  address: z.string().min(1),

  // ⬇ Correct according to your payload
  workingDays: workingDaysSchema,

  // ⬇ Correct according to your payload
  timings: timingsSchema,
});

const updateTenantDetailSchema = addTenantDetailSchema;

module.exports = { addTenantDetailSchema, updateTenantDetailSchema };
