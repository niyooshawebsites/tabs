const mongoose = require("mongoose");

const platformOwnerSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      default: "admin",
    },
    email: {
      type: String,
      unique: [true, "Email already taken"],
      default: "niyooshawebsites@gmail.com",
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      required: true,
      default: 3,
    },
    name: {
      type: String,
      default: null,
    },
    empId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("PlatformOwner", platformOwnerSchema);
