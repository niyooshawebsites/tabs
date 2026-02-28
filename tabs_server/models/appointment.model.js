const mongoose = require("mongoose");

const remarksSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, "Remarks is required"],
      trim: true,
    },
  },
  {
    _id: false,
    timestamps: true,
  },
);

const appointmentSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: [true, "The service is required"],
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: [true, "The location is required"],
    },
    date: {
      type: Date,
      required: [true, "The date is required"],
    },
    time: {
      type: String,
      required: [true, "The time is required"],
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: [true, "The client is required"],
    },
    status: {
      type: String,
      enum: [
        "No-Show",
        "Rescheduled",
        "Cancelled",
        "Pending",
        "Confirmed",
        "Completed",
      ],
      default: "Pending",
      trim: true,
    },
    remarks: [remarksSchema],
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    notes: {
      type: String,
      default: "No Note",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Appointment", appointmentSchema);
