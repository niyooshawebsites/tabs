const crypto = require("crypto");
const User = require("../models/user.model");
const Staff = require("../models/staff.model");

const resetPasswordController = async (req, res) => {
  try {
    const { accountType, email } = req.body;

    if (!accountType || !email) {
      return res.status(400).json({
        success: false,
        message: "Please fill all details!",
      });
    }

    if (accountType === "tenant") {
      const user = await User.find({ email });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Account not found!",
        });
      }

      // 1️⃣ Generate random token
      const resetToken = crypto.randomBytes(32).toString("hex");

      // 2️⃣ Hash token before saving
      const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      user.resetPasswordToken = hashedToken;

      // 🔥 THIS IS THE EXPIRY PART
      user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
      // 15 minutes from now

      await user.save({ validateBeforeSave: false });

      const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

      // Send email with resetLink

      res.status(200).json({
        success: true,
        message: "If that email exists, a reset link has been sent.",
      });
    }

    if (accountType === "staff") {
      const staff = await Staff.find({ email });

      if (!staff) {
        return res.status(404).json({
          success: false,
          message: "Account not found!",
        });
      }

      // 1️⃣ Generate random token
      const resetToken = crypto.randomBytes(32).toString("hex");

      // 2️⃣ Hash token before saving
      const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      staff.resetPasswordToken = hashedToken;

      // 🔥 THIS IS THE EXPIRY PART
      staff.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
      // 15 minutes from now

      await staff.save({ validateBeforeSave: false });

      const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

      // Send email with resetLink

      res.status(200).json({
        success: true,
        message: "If that email exists, a reset link has been sent.",
      });
    }

    if (accountType === "client") {
      const client = await Staff.find({ email });

      if (!client) {
        return res.status(404).json({
          success: false,
          message: "Account not found!",
        });
      }

      // 1️⃣ Generate random token
      const resetToken = crypto.randomBytes(32).toString("hex");

      // 2️⃣ Hash token before saving
      const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      client.resetPasswordToken = hashedToken;

      // 🔥 THIS IS THE EXPIRY PART
      client.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
      // 15 minutes from now

      await client.save({ validateBeforeSave: false });

      const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

      // Send email with resetLink

      res.status(200).json({
        success: true,
        message: "If that email exists, a reset link has been sent.",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error!",
      err: err.message,
    });
  }
};

module.exports = { resetPasswordController };
