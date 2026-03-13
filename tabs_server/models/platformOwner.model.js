const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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

// for hashing the password at registration
platformOwnerSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = bcrypt.hash(this.password, salt);
});

// for comparaing the password at login
platformOwnerSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("PlatformOwner", platformOwnerSchema);
