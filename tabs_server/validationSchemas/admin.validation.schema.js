const { z } = require("zod");

// Working days = simple array of strings
const workingDaysSchema = z.array(z.string().min(1), {
  required_error: "Working days are required",
});

// Full day time
const fullDaySchema = z.object({
  start: z.string(),
  end: z.string(),
});

// Part day time
const partDaySchema = z.object({
  morningStart: z.string().min(1, "Morning start time is required"),
  morningEnd: z.string().min(1, "Morning end time is required"),
  eveningStart: z.string().min(1, "Evening start time is required"),
  eveningEnd: z.string().min(1, "Evening end time is required"),
});

// Main timings schema
const timingsSchema = z
  .object({
    shiftType: z.enum(["full", "part"]),

    fullDay: fullDaySchema.optional(),
    partDay: partDaySchema.optional(),
  })
  .refine(
    (data) => {
      if (data.shiftType === "full") {
        return data.fullDay?.start && data.fullDay?.end;
      }
      return true;
    },
    { message: "Start time and End time are required for Full Day" }
  )
  .refine(
    (data) => {
      if (data.shiftType === "part") {
        return (
          data.partDay?.morningStart &&
          data.partDay?.morningEnd &&
          data.partDay?.eveningStart &&
          data.partDay?.eveningEnd
        );
      }
      return true;
    },
    { message: "All Part Day timings are required" }
  );

const addAdminDetailsSchema = z.object({
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

const updateAdminDetailsSchema = addAdminDetailsSchema;

module.exports = { addAdminDetailsSchema, updateAdminDetailsSchema };
