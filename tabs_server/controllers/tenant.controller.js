const Tenant = require("../models/tenant.model");
const Session = require("../models/session.model");
const UAParser = require("ua-parser-js");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/authToken.util");
const { hashToken } = require("../utils/tokenHash.util");

// tenant registration controller
const tenantRegistrationController = async (req, res) => {
  try {
    // Ensure the response is not cached
    res.setHeader("Cache-Control", "no-store");

    const { username, email, password, profession } = req.body;

    // check for existing tenant
    const tenant = await Tenant.findOne({
      $or: [{ email }, { username }],
    });

    // if tenant found
    if (tenant) {
      return res.status(409).json({
        success: false,
        message: "Account exists! Please login",
      });
    }

    // initiate a new tenant and save it the DB
    const newTenant = await new Tenant({
      username,
      email,
      password,
      profession,
    }).save();

    return res.status(200).json({
      success: true,
      message: "Registration successful",
      data: newTenant,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error!",
      err: err.message,
    });
  }
};

// teant login controller
const tenantLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check for existing tenant
    const tenant = await Tenant.findOne({ email });

    // if no tenant found
    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // verify the password
    const isMatch = await tenant.comparePassword(password);

    if (!isMatch) {
      return res.status(403).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const loginDetails = {
      uid: tenant._id,
      email: tenant.email,
      role: tenant.role,
      name: tenant.name,
      empId: tenant.empId,
    };

    // generate the authTokens
    const accessToken = generateAccessToken(loginDetails, "15m");
    const refreshToken = generateRefreshToken(loginDetails, "7d");
    const hashedRefreshToken = hashToken(refreshToken);

    const parser = new UAParser(req.headers["user-agent"]);
    const device = parser.getDevice();
    const browser = parser.getBrowser();
    const os = parser.getOS();

    // creating session
    await Session.create({
      userType: "Tenant",
      userId: tenant?._id,
      refreshTokenHash: hashedRefreshToken,
      id: req?.ip,
      userAgent: req?.headers["user-agent"],
      device: device?.model,
      browser: browser?.name,
      os: os?.name,
      expirestAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // set the cookie with access token
    res.cookie("accessToken", accessToken, {
      httpOnly: process.env.COOKIE_HTTPONLY === "true",
      secure: process.env.NODE_ENV === "production",
      // sameSite: "None",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000, // 15 mins
      path: "/",
    });

    // set the cookie with refresh token
    res.cookie("refreshToken", refreshToken, {
      httpOnly: process.env.COOKIE_HTTPONLY === "true",
      secure: process.env.NODE_ENV === "production",
      // sameSite: "None",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

    // saving the tenant in the requrest object for isAdmin middleware access
    req.user = loginDetails;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken,
      data: loginDetails,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error!",
      err: err.message,
    });
  }
};

// update tenant controller
const updateTenantController = async (req, res) => {
  try {
    const { uid } = req.params;
    const { password } = req.body;

    const updatedTenant = await Tenant.findByIdAndUpdate(
      uid,
      { password },
      { new: true, runValidators: true },
    );

    if (!updatedTenant) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tenant updated successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error!",
      err: err.message,
    });
  }
};

// check if tenant exists or not
const doesTenantExistController = async (req, res) => {
  try {
    const { username } = req.query;

    const tenant = await Tenant.findOne({ username });

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Tenant does not exist",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tenant exists",
      data: {
        id: tenant._id,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error!",
      err: err.message,
    });
  }
};

module.exports = {
  tenantRegistrationController,
  tenantLoginController,
  updateTenantController,
  doesTenantExistController,
};
