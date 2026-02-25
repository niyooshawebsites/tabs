const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Staff name is required"],
    },
    empId: {
      type: String,
      trim: true,
      unique: [true, "Employee ID already used"],
      required: [true, "Employee ID is required"],
    },
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
      },
    ],
    handlesAllServices: {
      type: Boolean,
      default: false,
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    email: {
      type: String,
      unique: [true, "Email already taken"],
      required: [true, "Email is required"],
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Staff", staffSchema);
