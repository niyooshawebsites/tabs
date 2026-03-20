const Appointment = require("../models/appointment.model");
const Tenant = require("../models/tenant.model");
const Client = require("../models/client.model");
const Session = require("../models/session.model");
const Location = require("../models/location.model");
const Staff = require("../models/staff.model");
const PlatformOwner = require("../models/platformOwner.model");
const TenantDetail = require("../models/tenantDetail.model");
const moment = require("moment");
const UAParser = require("ua-parser-js");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/authToken.util");
const { hashToken } = require("../utils/tokenHash.util");

// // platform owner registration controller
// const platformOwnerRegistrationController = async (req, res) => {
//   try {
//     // Ensure the response is not cached
//     res.setHeader("Cache-Control", "no-store");

//     const { password } = req.body;

//     // initiate a new platform owner and save it the DB
//     await new PlatformOwner({
//       password,
//     }).save();

//     return res.status(200).json({
//       success: true,
//       message: "Registration successful",
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: "Server error!",
//       err: err.message,
//     });
//   }
// };

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
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
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

// fetch all tenants platform owner controller
const fetchAllTenantsForPoController = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const totalTenants = await Tenant.countDocuments();

    const allTenants = await Tenant.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    if (allTenants.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No tenant found",
      });
    }

    // ✅ Get tenant User IDs from Tenants
    const tenantUserIds = allTenants.map((td) => td._id).filter(Boolean);

    // ✅ Aggregate appointment & client counts using tenant (User._id)
    const [appointmentsCounts, clientsCounts, staffCounts, locationCounts] =
      await Promise.all([
        Appointment.aggregate([
          { $match: { tenant: { $in: tenantUserIds } } },
          { $group: { _id: "$tenant", count: { $sum: 1 } } },
        ]),
        Client.aggregate([
          { $match: { tenant: { $in: tenantUserIds } } },
          { $group: { _id: "$tenant", count: { $sum: 1 } } },
        ]),
        Staff.aggregate([
          { $match: { tenant: { $in: tenantUserIds } } },
          { $group: { _id: "$tenant", count: { $sum: 1 } } },
        ]),
        Location.aggregate([
          { $match: { tenant: { $in: tenantUserIds } } },
          { $group: { _id: "$tenant", count: { $sum: 1 } } },
        ]),
      ]);

    // ✅ Convert counts into maps
    const appointmentMap = Object.fromEntries(
      appointmentsCounts.map((item) => [item._id.toString(), item.count]),
    );
    const clientMap = Object.fromEntries(
      clientsCounts.map((item) => [item._id.toString(), item.count]),
    );

    const staffMap = Object.fromEntries(
      staffCounts.map((item) => [item._id.toString(), item.count]),
    );

    const locationMap = Object.fromEntries(
      locationCounts.map((item) => [item._id.toString(), item.count]),
    );

    // ✅ Enrich each tenant details with counts
    const enrichedTenants = allTenants.map((td) => {
      const tenantId = td._id?.toString();
      return {
        ...td,
        appointmentCount: appointmentMap[tenantId] || 0,
        clientCount: clientMap[tenantId] || 0,
        staffCount: staffMap[tenantId] || 0,
        locationCount: locationMap[tenantId] || 0,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Tenant details found",
      data: enrichedTenants,
      pagination: {
        totalTenants: totalTenants,
        limit,
        page,
        totalPages: Math.ceil(totalTenants / limit),
        hasNextPage: page * limit < totalTenants,
        hasPrevPage: page > 1,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      err: err.message,
    });
  }
};

// fetch tenant details
const fetchTenantDetailForPoController = async (req, res) => {
  const { tid } = req.query;

  try {
    const tenantDetail = await TenantDetail.findOne({ tenant: tid });

    if (!tenantDetail) {
      return res.status(404).json({
        success: false,
        message: "Tenant detail not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tenant details fetched successfully",
      data: tenantDetail,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error!",
      err: err.message,
    });
  }
};

// fetch tenant appointments for platform owner
const fetchTenantAppointmentsForPoController = async (req, res) => {
  try {
    const { tid } = req.query;
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const totalAppointments = await Appointment.countDocuments();

    const allAppointments = await Appointment.find({ tenant: tid })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("service")
      .populate("location")
      .populate("client")
      .populate("tenant");

    if (allAppointments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No appointments found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Appointments found",
      data: allAppointments,
      pagination: {
        totalAppointments,
        limit,
        page,
        totalPages: Math.ceil(totalAppointments / limit),
        hasNextPage: page * limit < totalAppointments,
        hasPrevPage: page > 1,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      err: err.message,
    });
  }
};

module.exports = {
  // platformOwnerRegistrationController,
  platformOwnerLoginController,
  fetchOverAllStatsController,
  fetchAllTenantsForPoController,
  fetchTenantDetailForPoController,
  fetchTenantAppointmentsForPoController,
};
