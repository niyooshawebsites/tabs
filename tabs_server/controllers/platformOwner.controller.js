const Appointment = require("../models/appointment.model");
const Tenant = require("../models/tenant.model");
const Client = require("../models/client.model");
const Session = require("../models/session.model");
const PlatformOwner = require("../models/platformOwner.model");
const moment = require("moment");
const UAParser = require("ua-parser-js");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/authToken.util");
const { hashToken } = require("../utils/tokenHash.util");

// platform owner registration controller
const platformOwnerRegistrationController = async (req, res) => {
  try {
    // Ensure the response is not cached
    res.setHeader("Cache-Control", "no-store");

    const { password } = req.body;

    // initiate a new platform owner and save it the DB
    await new PlatformOwner({
      password,
    }).save();

    return res.status(200).json({
      success: true,
      message: "Registration successful",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error!",
      err: err.message,
    });
  }
};

// platform owner login controller
const platformOwnerLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const owner = await PlatformOwner.findOne({ email });

    // if no owner found
    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // verify the password
    const isMatch = await owner.comparePassword(password);

    if (!isMatch) {
      return res.status(403).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const loginDetails = {
      uid: owner._id,
      email: owner.email,
      role: owner.role,
      name: owner.name,
      empId: owner.empId,
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
      userType: "PO",
      userId: owner?._id,
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

    // saving the platform owner in the requrest object for isAdmin middleware access
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

// fetch all appointments count controller
const fetchOverAllStatsController = async (req, res) => {
  try {
    const startDate = moment().startOf("day").toDate();
    const endDate = moment().endOf("day").toDate();

    const allTimesAppointmentsCount = await Appointment.countDocuments();
    const todayAppointmentsCount = await Appointment.countDocuments({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    const allTimesTenantsCount = await Tenant.countDocuments({
      _id: { $ne: "68ebc727e241289c057cae39" },
    });
    const todayTenantsCount = await Tenant.countDocuments({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    const allTimesClientsCount = await Client.countDocuments();
    const todayClientsCount = await Client.countDocuments({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    return res.status(200).json({
      success: true,
      message: "All stats fetched successfully",
      data: {
        allTimesAppointmentsCount,
        allTimesTenantsCount,
        allTimesClientsCount,
        todayAppointmentsCount,
        todayTenantsCount,
        todayClientsCount,
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
  platformOwnerRegistrationController,
  platformOwnerLoginController,
  fetchOverAllStatsController,
};
