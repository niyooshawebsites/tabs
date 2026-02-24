const Staff = require("../models/staff.model");
const {
  encryptPassword,
  decryptPassword,
} = require("../utils/securePassword.util");
const generateAuthToken = require("../utils/authToken.util");

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

    // encrypting the password
    const encryptedPassword = await encryptPassword(password);

    // initiate a new user and save it the DB
    const newStaff = await new Staff({
      name,
      empId,
      services: sid,
      location: lid,
      tenant: uid,
      email,
      password: encryptedPassword,
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

    const passwordVerfication = await decryptPassword(
      password,
      existingStaff.password,
    );

    if (!passwordVerfication) {
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

    // saving the user in the requrest object for isAdmin middleware access
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

const staffLogoutController = async (req, res) => {
  try {
    res.clearCookie("authToken", {
      httpOnly: process.env.COOKIE_HTTPONLY === "true",
      secure: process.env.NODE_ENV === "production",
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

const updateStaffPasswordController = async (req, res) => {
  try {
    const { staffId } = req.params;
    const { password } = req.body;
    const encryptedPassword = await encryptPassword(password);

    const updatedStaff = await Staff.findByIdAndUpdate(
      staffId,
      { password: encryptedPassword },
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

    const encryptedPassword = await encryptPassword(password);

    const updatedStaff = await Staff.findByIdAndUpdate(
      staffId,
      {
        name,
        empId,
        email,
        password: encryptedPassword,
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

module.exports = {
  staffCreationController,
  staffLoginController,
  staffLogoutController,
  updateStaffPasswordController,
  updateStaffDetailsController,
  fetchAStaffController,
  fetchStaffController,
  deleteAStaffController,
};
