const Tenant = require("../models/tenant.model");
const {
  encryptPassword,
  decryptPassword,
} = require("../utils/securePassword.util");
const generateAuthToken = require("../utils/authToken.util");

// registration controller
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

    // encrypting the password
    const encryptedPassword = await encryptPassword(password);

    // initiate a new tenant and save it the DB
    const newTenant = await new Tenant({
      username,
      email,
      password: encryptedPassword,
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

// login controller
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
    const passwordVerfication = await decryptPassword(
      password,
      tenant.password,
    );

    if (!passwordVerfication) {
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

    // generate the authToken
    const authToken = await generateAuthToken(loginDetails, "1d");

    // set the cookie
    res.cookie("authToken", authToken, {
      httpOnly: process.env.COOKIE_HTTPONLY === "true",
      secure: process.env.NODE_ENV === "production",
      // sameSite: "None",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      path: "/",
    });

    // saving the tenant in the requrest object for isAdmin middleware access
    req.user = loginDetails;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      authToken,
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

// logout controller
const logoutController = async (req, res) => {
  try {
    res.clearCookie("authToken", {
      httpOnly: process.env.COOKIE_HTTPONLY === "true",
      secure: process.env.NODE_ENV === "production",
      // sameSite: "None",
      sameSite: "lax",
      path: "/",
    });

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

// update tenant controller
const updateTenantController = async (req, res) => {
  try {
    const { uid } = req.params;

    const { password } = req.body;

    const encryptedPassword = await encryptPassword(password);

    const updatedTenant = await Tenant.findByIdAndUpdate(
      uid,
      { password: encryptedPassword },
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
  logoutController,
  updateTenantController,
  doesTenantExistController,
};
