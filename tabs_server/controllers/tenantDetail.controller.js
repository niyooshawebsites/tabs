const TenantDetail = require("../models/tenantDetail.model");
const Tenant = require("../models/tenant.model");
const Appointment = require("../models/appointment.model");
const Client = require("../models/client.model");
const mongoose = require("mongoose");

// add tenant details
const addTenantDetailController = async (req, res) => {
  try {
    const { uid } = req.query;

    const existingTenantDetail = await TenantDetail.findOne({ tenant: uid });

    if (existingTenantDetail) {
      return res.status(409).json({
        success: false,
        message: "Tenant detail already exists",
      });
    }

    const tenantDetail = await new TenantDetail({
      ...req.body,
      tenant: uid,
    }).save();

    return res.status(200).json({
      success: true,
      message: "Tenant detail added successfully",
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

// udpate tenant details
const updateTenantDetailController = async (req, res) => {
  try {
    const { uid } = req.query;

    const updatedTenantDetail = await TenantDetail.findOneAndUpdate(
      { tenant: uid },
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Tenant detail updated successfully",
      data: updatedTenantDetail,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error!",
      err: err.message,
    });
  }
};

// fetch tenant details
const fetchTenantDetailController = async (req, res) => {
  const { username } = req.query;

  try {
    const tenant = await Tenant.findOne({ username });

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "No such tenant found",
        data: username,
        user: tenant,
      });
    }

    const uid = tenant._id;
    const tenantDetail = await TenantDetail.findOne({ tenant: uid });
    const noOfEntries = await TenantDetail.countDocuments({ tenant: uid });

    if (!tenantDetail) {
      return res.status(404).json({
        success: false,
        message: "Tenant detail not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Admin details fetched successfully",
      data: tenantDetail,
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

const fetchAllTenantDetailForPoController = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const totalTenantDetail = await TenantDetail.countDocuments();

    const allTenantDetail = await TenantDetail.find()
      .skip(skip)
      .limit(limit)
      .populate("tenant")
      .sort({ createdAt: -1 })
      .lean();

    if (allTenantDetail.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No tenant detail found",
      });
    }

    // ✅ Convert to ObjectId properly - handle both populated and unpopulated cases
    const tenantIds = allTenantDetail
      .map((td) => {
        const tenantRef = td.tenant?._id || td.tenant;
        // Ensure we're working with ObjectId, not plain object
        return mongoose.Types.ObjectId.isValid(tenantRef)
          ? new mongoose.Types.ObjectId(tenantRef.toString())
          : null;
      })
      .filter(Boolean);

    console.log(
      "Tenant IDs for query:",
      tenantIds.map((id) => id.toString()),
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

    // console.log("Appointments counts:", appointmentsCounts);

    // ✅ Create lookup maps
    const appointmentMap = new Map(
      appointmentsCounts.map((item) => [item._id.toString(), item.count]),
    );
    const clientMap = new Map(
      clientsCounts.map((item) => [item._id.toString(), item.count]),
    );

    // ✅ Enrich admins with counts
    const enrichedAllTenantDetail = allTenantDetail.map((td) => {
      const tenantId = (td.tenant?._id || td.tenant).toString();

      return {
        ...td,
        appointmentCount: appointmentMap.get(tenantId) || 0,
        clientCount: clientMap.get(tenantId) || 0,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Tenant details found",
      data: enrichedAllTenantDetail,
      pagination: {
        totalTenants: totalTenantDetail,
        limit,
        page,
        totalPages: Math.ceil(totalTenantDetail / limit),
        hasNextPage: page * limit < totalTenantDetail,
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

// fetch filtered tenant details form platform ownner controller
const fetchAFilteredTenantDetailForPoController = async (req, res) => {
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

    const totalTenantDetail = await TenantDetail.countDocuments(filter);

    const tenantDetail = await TenantDetail.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("tenant");

    if (totalTenantDetail.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No tenant detail found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tenant details found",
      data: tenantDetail,
      pagination: {
        limit,
        page,
        totalTenants: totalTenantDetail,
        totalPages: Math.ceil(totalTenantDetail / limit),
        hasNextPage: page * limit < totalTenantDetail,
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
const addPoDetailsController = async (req, res) => {
  try {
    const { uid } = req.query;

    const existingPlatformOwnerDetails = await TenantDetail.findOne({
      tenant: uid,
    });

    if (existingPlatformOwnerDetails) {
      return res.status(409).json({
        success: false,
        message: "Platform owner details already exists",
      });
    }

    const platformOwnerDetails = await new TenantDetail({
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
const updatePoDetailsController = async (req, res) => {
  try {
    const { uid } = req.query;

    const updatedplatformOwnerDetails = await TenantDetail.findOneAndUpdate(
      { tenant: uid },
      req.body,
      {
        new: true,
        runValidators: true,
      },
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
  addTenantDetailController,
  updateTenantDetailController,
  fetchTenantDetailController,
  fetchAllTenantDetailForPoController,
  fetchAFilteredTenantDetailForPoController,
  addPoDetailsController,
  updatePoDetailsController,
};
