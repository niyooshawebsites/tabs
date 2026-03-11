const crypto = require("crypto");
const Tenant = require("../models/tenant.model");
const Staff = require("../models/staff.model");
const Session = require("../models/session.model");
const { sendPasswordResetEmail } = require("../utils/mail.util");
const { encryptPassword } = require("../utils/securePassword.util");
const { hashToken } = require("../utils/tokenHash.util");
const jwt = require("jsonwebtoken");
const UAParser = require("ua-parser-js");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/authToken.util");

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
      const tenant = await Tenant.findOne({ email });

      if (!tenant) {
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

      tenant.resetPasswordToken = hashedToken;

      // 🔥 THIS IS THE EXPIRY PART
      tenant.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
      // 15 minutes from now

      await tenant.save({ validateBeforeSave: false });

      const resetLink = `${process.env.CLIENT_URL}/reset-password?accountType=${accountType}&token=${resetToken}`;

      // Send email with resetLink
      sendPasswordResetEmail(resetLink, tenant);

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
    const Model = accountType === "tenant" ? Tenant : Staff;

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

// logout controller
const logoutController = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "No refresh token, no logout",
      });
    }

    const hashedRefreshToken = hashToken(token);

    await Session.deleteOne({ refreshTokenHash: hashedRefreshToken });
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error!",
      err: err.message,
    });
  }
};

const refreshTokenController = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "Refresh token missing",
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    const hashedToken = hashToken(refreshToken);

    const session = await Session.findOne({
      refreshTokenHash: hashedToken,
    });

    // TOKEN REUSE DETECTION
    if (!session) {
      await Session.deleteMany({
        userId: decoded.id,
      });

      return res.status(403).json({
        success: false,
        message: "Refresh token reuse detected",
      });
    }

    // session expiry
    if (session.expiresAt < new Date()) {
      await Session.deleteOne({ _id: session._id });

      return res.status(403).json({
        success: false,
        message: "Session expired. Please login again.",
      });
    }

    // delete old session
    await Session.deleteOne({ _id: session._id });

    const newRefreshToken = generateRefreshToken(decoded.id);
    const accessToken = generateAccessToken(decoded.id);

    const newRefreshTokenHash = hashToken(newRefreshToken);

    const parser = new UAParser(req.headers["user-agent"]);
    const device = parser.getDevice();
    const browser = parser.getBrowser();
    const os = parser.getOS();

    await Session.create({
      userId: decoded.id,
      refreshTokenHash: newRefreshTokenHash,
      ip: req?.ip,
      userAgent: req.headers["user-agent"],
      device: device?.model,
      browser: browser?.name,
      os: os?.name,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: process.env.COOKIE_HTTPONLY === "true",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
      path: "/",
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: process.env.COOKIE_HTTPONLY === "true",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.json({
      success: true,
      message: "Tokens refreshed",
    });
  } catch (err) {
    console.log(err);
    return res.status(403).json({
      success: false,
      message: "Invalid refresh token",
    });
  }
};

module.exports = {
  forgotPasswordController,
  resetPasswordController,
  logoutController,
  refreshTokenController,
};
