const Appointment = require("../models/appointment.model");
const Tenant = require("../models/tenant.model");
const Client = require("../models/client.model");
const PlatformOwner = require("../models/platformOwner.model");
const moment = require("moment");
const {
  encryptPassword,
  decryptPassword,
} = require("../utils/securePassword.util");
const generateAuthToken = require("../utils/authToken.util");

// platform owner registration controller
const platformOwnerRegistrationController = async (req, res) => {
  try {
    // Ensure the response is not cached
    res.setHeader("Cache-Control", "no-store");

    const { password } = req.body;

    // encrypting the password
    const encryptedPassword = await encryptPassword(password);

    // initiate a new platform owner and save it the DB
    const newPlatformOwner = await new PlatformOwner({
      password: encryptedPassword,
    }).save();

    return res.status(200).json({
      success: true,
      message: "Registration successful",
      data: newPlatformOwner,
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
    const passwordVerfication = await decryptPassword(password, owner.password);

    if (!passwordVerfication) {
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

    // saving the platform owner in the requrest object for isAdmin middleware access
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
