const Admin = require("../models/admin.model");
const User = require("../models/user.model");
const Appointment = require("../models/admin.model");
const Client = require("../models/client.model");
const mongoose = require("mongoose");

// add admin details
const addAdminDetailsController = async (req, res) => {
  try {
    const { uid } = req.query;

    const existingAdminDetails = await Admin.findOne({ tenant: uid });

    if (existingAdminDetails) {
      return res.status(409).json({
        success: false,
        message: "Admin details already exists",
      });
    }

    const adminDetails = await new Admin({
      ...req.body,
      tenant: uid,
    }).save();

    return res.status(200).json({
      success: true,
      message: "Admin details added successfully",
      data: adminDetails,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error!",
      err: err.message,
    });
  }
};

// udpate admin details
const updateAdminDetailsController = async (req, res) => {
  try {
    const { uid } = req.query;

    const updatedAdminDetails = await Admin.findOneAndUpdate(
      { tenant: uid },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Admin details updated successfully",
      data: updatedAdminDetails,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error!",
      err: err.message,
    });
  }
};

// fetch admin details
const fetchAdminDetailsController = async (req, res) => {
  const { username } = req.query;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No such user found",
        data: username,
        user: user,
      });
    }

    const uid = user._id;
    const adminDetails = await Admin.findOne({ tenant: uid });
    const noOfEntries = await Admin.countDocuments({ tenant: uid });

    if (!adminDetails) {
      return res.status(404).json({
        success: false,
        message: "Admin details not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Admin details fetched successfully",
      data: adminDetails,
      detailsExist: noOfEntries ? true : false,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error!",
      err: err.message,
    });
  }
};

// const fetchAllAdminsForPlatformOwnerController = async (req, res) => {
//   try {
//     const limit = parseInt(req.query.limit) || 10;
//     const page = parseInt(req.query.page) || 1;
//     const skip = (page - 1) * limit;

//     const totalAdmins = await Admin.countDocuments();

//     const allAdmins = await Admin.find()
//       .skip(skip)
//       .limit(limit)
//       .sort({ createdAt: -1 })
//       .populate("tenant")
//       .lean();

//     if (allAdmins.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No tenant details found",
//       });
//     }

//     // ✅ Get tenant User IDs from Admins
//     const tenantUserIds = allAdmins
//       .map((admin) => admin.tenant?._id)
//       .filter(Boolean);

//     // ✅ Aggregate appointment & client counts using tenant (User._id)
//     const [appointmentsCounts, clientsCounts] = await Promise.all([
//       Appointment.aggregate([
//         { $match: { tenant: { $in: tenantUserIds } } },
//         { $group: { _id: "$tenant", count: { $sum: 1 } } },
//       ]),
//       Client.aggregate([
//         { $match: { tenant: { $in: tenantUserIds } } },
//         { $group: { _id: "$tenant", count: { $sum: 1 } } },
//       ]),
//     ]);

//     // ✅ Convert counts into maps
//     const appointmentMap = Object.fromEntries(
//       appointmentsCounts.map((item) => [item._id.toString(), item.count])
//     );
//     const clientMap = Object.fromEntries(
//       clientsCounts.map((item) => [item._id.toString(), item.count])
//     );

//     // ✅ Enrich each admin with counts
//     const enrichedAdmins = allAdmins.map((admin) => {
//       const tenantId = admin.tenant?._id?.toString();
//       return {
//         ...admin,
//         appointmentCount: appointmentMap[tenantId] || 0,
//         clientCount: clientMap[tenantId] || 0,
//       };
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Tenant details found",
//       data: enrichedAdmins,
//       pagination: {
//         totalTenants: totalAdmins,
//         limit,
//         page,
//         totalPages: Math.ceil(totalAdmins / limit),
//         hasNextPage: page * limit < totalAdmins,
//         hasPrevPage: page > 1,
//       },
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//       err: err.message,
//     });
//   }
// };

const fetchAllAdminsForPlatformOwnerController = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const totalAdmins = await Admin.countDocuments();

    const allAdmins = await Admin.find()
      .skip(skip)
      .limit(limit)
      .populate("tenant")
      .sort({ createdAt: -1 })
      .lean();

    if (allAdmins.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No tenant details found",
      });
    }

    // ✅ Convert to ObjectId properly - handle both populated and unpopulated cases
    const tenantIds = allAdmins
      .map((admin) => {
        const tenantRef = admin.tenant?._id || admin.tenant;
        // Ensure we're working with ObjectId, not plain object
        return mongoose.Types.ObjectId.isValid(tenantRef)
          ? new mongoose.Types.ObjectId(tenantRef.toString())
          : null;
      })
      .filter(Boolean);

    console.log(
      "Tenant IDs for query:",
      tenantIds.map((id) => id.toString())
    );

    // ✅ Aggregate counts
    const [appointmentsCounts, clientsCounts] = await Promise.all([
      Appointment.aggregate([
        { $match: { tenant: { $in: tenantIds } } },
        { $group: { _id: "$tenant", count: { $sum: 1 } } },
      ]),
      Client.aggregate([
        { $match: { tenant: { $in: tenantIds } } },
        { $group: { _id: "$tenant", count: { $sum: 1 } } },
      ]),
    ]);

    console.log("Appointments counts:", appointmentsCounts);

    // ✅ Create lookup maps
    const appointmentMap = new Map(
      appointmentsCounts.map((item) => [item._id.toString(), item.count])
    );
    const clientMap = new Map(
      clientsCounts.map((item) => [item._id.toString(), item.count])
    );

    // ✅ Enrich admins with counts
    const enrichedAdmins = allAdmins.map((admin) => {
      const tenantId = (admin.tenant?._id || admin.tenant).toString();

      return {
        ...admin,
        appointmentCount: appointmentMap.get(tenantId) || 0,
        clientCount: clientMap.get(tenantId) || 0,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Tenant details found",
      data: enrichedAdmins,
      pagination: {
        totalTenants: totalAdmins,
        limit,
        page,
        totalPages: Math.ceil(totalAdmins / limit),
        hasNextPage: page * limit < totalAdmins,
        hasPrevPage: page > 1,
      },
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      err: err.message,
    });
  }
};

// fetch filtered admin details form platform ownner controller
const fetchAFilteredAdminDetailsForPlatformOwnerController = async (
  req,
  res
) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { profession, startDate, endDate } = req.query;

    // build a dynamic mongodb query
    const filter = {};

    // if service is provided
    if (profession) {
      filter.profession = profession;
    }

    // if start and end date is provided
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const totalAdmins = await Admin.countDocuments(filter);

    const admins = await Admin.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("tenant");

    if (totalAdmins.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No tenant details found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tenant details found",
      data: admins,
      pagination: {
        limit,
        page,
        totalTenants: totalAdmins,
        totalPages: Math.ceil(totalAdmins / limit),
        hasNextPage: page * limit < totalAdmins,
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

// add platform owner details controller
const addPlatformOwnerDetailsController = async (req, res) => {
  try {
    const { uid } = req.query;

    const existingPlatformOwnerDetails = await Admin.findOne({ tenant: uid });

    if (existingPlatformOwnerDetails) {
      return res.status(409).json({
        success: false,
        message: "Platform owner details already exists",
      });
    }

    const platformOwnerDetails = await new Admin({
      ...req.body,
      tenant: uid,
    }).save();

    return res.status(200).json({
      success: true,
      message: "Platform owner details added successfully",
      data: platformOwnerDetails,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error!",
      err: err.message,
    });
  }
};

// update platform owner details controller
const updatePlatformOwnerDetailsController = async (req, res) => {
  try {
    const { uid } = req.query;

    const updatedplatformOwnerDetails = await Admin.findOneAndUpdate(
      { tenant: uid },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Platform owner details updated successfully",
      data: updatedplatformOwnerDetails,
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
  addAdminDetailsController,
  updateAdminDetailsController,
  fetchAdminDetailsController,
  fetchAllAdminsForPlatformOwnerController,
  fetchAFilteredAdminDetailsForPlatformOwnerController,
  addPlatformOwnerDetailsController,
  updatePlatformOwnerDetailsController,
};
