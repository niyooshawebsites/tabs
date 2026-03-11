const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
      ref: "Tenant",
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
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpire: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// for hashing the password at registration
staffSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = bcrypt.hash(this.password, salt);
});

// for comparaing the password at login
staffSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Staff", staffSchema);
