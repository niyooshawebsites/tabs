const crypto = require("crypto");
const User = require("../models/user.model");
const Staff = require("../models/staff.model");
const { sendPasswordResetEmail } = require("../utils/mail.util");
const { encryptPassword } = require("../utils/securePassword.util");

const forgotPasswordController = async (req, res) => {
  try {
    const { accountType, email } = req.body;

    if (!accountType || !email) {
      return res.status(400).json({
        success: false,
        message: "Please fill all details!",
      });
    }

    if (accountType === "tenant") {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Account not found!",
        });
      }

      // Generate random token
      const resetToken = crypto.randomBytes(32).toString("hex");

      // Hash token before saving
      const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      user.resetPasswordToken = hashedToken;

      // 🔥 THIS IS THE EXPIRY PART
      user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
      // 15 minutes from now

      await user.save({ validateBeforeSave: false });

      const resetLink = `${process.env.CLIENT_URL}/reset-password?accountType=${accountType}&token=${resetToken}`;

      // Send email with resetLink
      sendPasswordResetEmail(resetLink, user);

      res.status(200).json({
        success: true,
        message: "If that email exists, a reset link has been sent.",
      });
    }

    if (accountType === "staff") {
      const staff = await Staff.findOne({ email });

      if (!staff) {
        return res.status(404).json({
          success: false,
          message: "Account not found!",
        });
      }

      // Generate random token
      const resetToken = crypto.randomBytes(32).toString("hex");

      // Hash token before saving
      const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      staff.resetPasswordToken = hashedToken;

      // 🔥 THIS IS THE EXPIRY PART
      staff.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
      // 15 minutes from now

      await staff.save({ validateBeforeSave: false });

      const resetLink = `${process.env.CLIENT_URL}/reset-password?accountType=${accountType}&token=${resetToken}`;

      // Send email with resetLink
      sendPasswordResetEmail(resetLink, staff);

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

const resetPasswordController = async (req, res) => {
  try {
    const { accountType, token } = req.query;
    const { password } = req.body;

    if (!token || !password || !accountType) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // hash the token from URL
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // choose model
    const Model = accountType === "tenant" ? User : Staff;

    // find account
    const account = await Model.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!account) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // encrypting the password
    const encryptedPassword = await encryptPassword(password);

    // update password
    account.password = encryptedPassword;

    // clear reset fields
    account.resetPasswordToken = null;
    account.resetPasswordExpire = null;

    await account.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

module.exports = { forgotPasswordController, resetPasswordController };
