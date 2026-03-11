const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    userType: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    refreshTokenHash: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      default: "unknown",
    },
    ip: {
      type: String,
      default: "unknown",
    },
    device: {
      type: String,
      default: "unknown",
    },
    browser: {
      type: String,
      default: "unknown",
    },
    os: {
      type: String,
      default: "unknown",
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
    isRevoked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Session", sessionSchema);
