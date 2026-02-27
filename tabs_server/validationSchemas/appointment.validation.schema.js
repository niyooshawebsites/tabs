const { z } = require("zod");

// book appointment schema
const bookAppointmentSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(1, "Name cannot be empty"),

  gender: z.enum(["male", "female", "other"], {
    required_error: "Gender is required",
    invalid_type_error: "Gender must be 'male', 'female', or 'other'",
  }),

  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Invalid email address"),

  phone: z
    .string({
      required_error: "Phone number is required",
    })
    .min(10, "Phone number must be 10 digits")
    .max(10, "Phone number must be 10 digits"),

  dob: z
    .string({
      required_error: "Date of birth is required",
    })
    .min(1, "DOB cannot be empty"),

  address: z
    .string({
      required_error: "Address is required",
    })
    .min(1, "Address cannot be empty"),

  city: z
    .string({
      required_error: "City is required",
    })
    .min(1, "City cannot be empty"),

  state: z
    .string({
      required_error: "State is required",
    })
    .min(1, "State cannot be empty"),

  pincode: z
    .string({
      required_error: "Pincode is required",
    })
    .min(6, "Pincode must have 6 digits")
    .max(6, "Pincode must have 6 digits"),

  date: z
    .string({
      required_error: "Date is required",
    })
    .min(1, "Date cannot be empty"),

  time: z
    .string({
      required_error: "Time is required",
    })
    .min(1, "Time cannot be empty"),

  service: z
    .string({
      required_error: "Service ID is required",
    })
    .min(1, "Service ID cannot be empty"),

  location: z
    .string({ required_error: "Location Id is required" })
    .min(1, "Location ID cannot be empty"),
});

// update appointment schema
const updateAppointmentSchema = z
  .object({
    status: z.enum(
      ["Pending", "Confirmed", "Rescheduled", "Completed", "Cancelled"],
      {
        required_error: "Status is required",
      },
    ),
    date: z.string().optional(),
    time: z.string().optional(),
    remarks: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // If status is Rescheduled, date and time are required
    if (data.status === "Rescheduled") {
      if (!data.date) {
        ctx.addIssue({
          path: ["date"],
          code: z.ZodIssueCode.custom,
          message: "Date is required when status is 'Rescheduled'",
        });
      }
      if (!data.time) {
        ctx.addIssue({
          path: ["time"],
          code: z.ZodIssueCode.custom,
          message: "Time is required when status is 'Rescheduled'",
        });
      }
    }
  });

module.exports = { bookAppointmentSchema, updateAppointmentSchema };
