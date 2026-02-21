const mongoose = require("mongoose");

const timingSchema = new mongoose.Schema(
  {
    shiftType: {
      type: String,
      enum: ["full", "part"],
      required: true,
    },

    fullDay: {
      start: { type: String, default: null },
      end: { type: String, default: null },
    },

    partDay: {
      morningStart: { type: String, default: null },
      morningEnd: { type: String, default: null },
      eveningStart: { type: String, default: null },
      eveningEnd: { type: String, default: null },
    },
  },
  { _id: false }
);

const adminSchema = new mongoose.Schema(
  {
    legalName: {
      type: String,
      trim: true,
      minlength: 3,
      required: [true, "Legal name is required"],
    },
    gstNo: {
      type: String,
      unique: true,
      trim: true,
      default: null,
    },
    isDoctor: {
      type: String,
      enum: ["yes", "no"],
      default: "no",
    },
    name: {
      type: String,
      trim: true,
      minlength: 3,
      default: null,
    },
    experience: {
      type: String,
      trim: true,
      default: null,
    },
    proffessinalCourse: {
      type: String,
      trim: true,
      default: null,
    },
    email: {
      type: String,
      unique: [true, "Email must be unique"],
      required: [true, "Email is required"],
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^\d{10}$/, "Phone number must be 10 digits"],
    },
    altPhone: {
      type: String,
      trim: true,
      match: [/^\d{10}$/, "Phone number must be 10 digits"],
      default: null,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    workingDays: {
      type: [String],
      required: [true, "Working Days are required"],
    },
    timings: timingSchema,
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Admin", adminSchema);
