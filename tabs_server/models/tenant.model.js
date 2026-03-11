const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const tenantSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: [true, "Username already taken"],
      required: [true, "Username is required"],
      trim: true,
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
    profession: {
      type: String,
      required: [true, "Profession is required"],
      trim: true,
    },
    role: {
      type: Number,
      required: true,
      enum: [0, 1, 2], // 0 for endUser, 1 for staff, 2 for tenant
      default: 2,
    },
    totalAppointments: {
      type: Number,
      default: 0,
    },
    totalClients: {
      type: Number,
      default: 0,
    },
    plan: {
      name: {
        type: String,
        default: "free", // free | monthly | annual
      },
      price: {
        type: Number,
        default: 0,
      },
      startDate: {
        type: Date,
      },
      endDate: {
        type: Date,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
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
tenantSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = bcrypt.hash(this.password, salt);
});

// for comparaing the password at login
tenantSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Tenant", tenantSchema);
