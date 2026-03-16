const Staff = require("../models/staff.model");
const Session = require("../models/session.model");
const UAParser = require("ua-parser-js");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/authToken.util");
const { hashToken } = require("../utils/tokenHash.util");

const staffCreationController = async (req, res) => {
  try {
    const { uid } = req.params;
    const { name, empId, email, password, sid, lid } = req.body;

    const existingStaff = await Staff.findOne({ email });

    if (existingStaff) {
      return res.status(409).json({
        success: false,
        message: "Staff already exists!",
      });
    }

    // initiate a new staff and save it the DB
    const newStaff = await new Staff({
      name,
      empId,
      services: sid,
      location: lid,
      tenant: uid,
      email,
      password,
    }).save();

    return res.status(200).json({
      success: true,
      message: "Staff creation successful",
      data: newStaff,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error!",
      err: err.message,
    });
  }
};

const staffLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingStaff = await Staff.findOne({ email });

    if (!existingStaff) {
      return res.status(404).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await existingStaff.comparePassword(password);

    if (!isMatch) {
      return res.status(403).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const loginDetails = {
      uid: existingStaff._id,
      email: existingStaff.email,
      role: existingStaff.role,
      name: existingStaff.name,
      empId: existingStaff.empId,
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
      userId: existingStaff._id,
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

    // saving the staff in the requrest object for isAdmin middleware access
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

const updateStaffPasswordController = async (req, res) => {
  try {
    const { staffId } = req.params;
    const { password } = req.body;

    const updatedStaff = await Staff.findByIdAndUpdate(
      staffId,
      { password },
      { new: true, runValidators: true },
    );

    if (!updatedStaff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error!",
      err: err.message,
    });
  }
};

const updateStaffDetailsController = async (req, res) => {
  try {
    const { uid } = req.query;
    const { staffId } = req.params;
    const { name, empId, email, password, sid, lid } = req.body;

    const updatedStaff = await Staff.findByIdAndUpdate(
      staffId,
      {
        name,
        empId,
        email,
        password,
        services: sid,
        location: lid,
        tenant: uid,
      },
      { new: true, runValidators: true },
    );

    if (!updatedStaff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Staff details updated successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error!",
      err: err.message,
    });
  }
};

const fetchAStaffController = async (req, res) => {
  try {
    const { uid } = req.query;
    const { staffId } = req.params;

    const staff = await Staff.findOne({ tenant: uid, _id: staffId })
      .populate("services")
      .populate("location");

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Staff found successfully",
      data: staff,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error!",
      err: err.message,
    });
  }
};

const fetchStaffController = async (req, res) => {
  try {
    const { uid } = req.query;

    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;

    const skip = (page - 1) * limit;

    const totalStaff = await Staff.countDocuments({ tenant: uid });

    const staff = await Staff.find({ tenant: uid })
      .select("-password")
      .populate("services")
      .populate("location")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (staff.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "All services found",
      data: staff,
      pagination: {
        totalStaff,
        limit,
        page,
        totalPages: Math.ceil(totalStaff / limit),
        hasNextPage: page * limit < totalStaff,
        hasPrevPage: page > 1,
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

const deleteAStaffController = async (req, res) => {
  try {
    const { staffId } = req.params;
    const { uid } = req.query;

    const staff = await Staff.findOne({ _id: staffId, tenant: uid });

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }

    // 3. Delete the service
    await Staff.deleteOne({ _id: staffId });

    return res.status(200).json({
      success: true,
      message: "Staff deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error!",
      err: err.message,
    });
  }
};

const fetchAllStaffServicesController = async (req, res) => {
  try {
    const { empId } = req.query;
    const { tid } = req.query;

    const staff = await Staff.findOne({ empId: empId, tenant: tid }).populate(
      "services",
    );

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Staff services fetched successfully",
      data: staff.services,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error!",
      err: err.message,
    });
  }
};

const fetchAllStaffLocationsController = async (req, res) => {
  try {
    const { empId } = req.query;
    const { tid } = req.query;

    const staff = await Staff.findOne({ empId: empId, tenant: tid }).populate(
      "location",
    );

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Staff locations fetched successfully",
      data: [staff.location],
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error!",
      err: err.message,
    });
  }
};

const resetStaffPasswordController = async (req, res) => {
  try {
    const { uid } = req.query;
    const { staffId } = req.params;
    const { password } = req.body;
    const updatedStaff = await Staff.findOneAndUpdate(
      { _id: staffId, tenant: uid },
      { password },
      { new: true, runValidators: true },
    );

    if (!updatedStaff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error!",
      err: err.message,
    });
  }
};

// fetch all staffs controller
const fetchAllStaffsForPOController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalStaffs = await Staff.countDocuments({});
    const staffs = await Staff.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (staffs.length == 0) {
      return res.status(404).json({
        success: false,
        message: "No staffs found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Staffs fetched successfully",
      data: staffs,
      pagination: {
        totalStaffs,
        page,
        limit,
        totalPages: Math.ceil(totalStaffs / limit),
        hasNextPage: page * limit < totalStaffs,
        hasPrevPage: page > 1,
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
  staffCreationController,
  staffLoginController,
  updateStaffPasswordController,
  updateStaffDetailsController,
  fetchAStaffController,
  fetchStaffController,
  deleteAStaffController,
  fetchAllStaffServicesController,
  fetchAllStaffLocationsController,
  resetStaffPasswordController,
  fetchAllStaffsForPOController,
};
