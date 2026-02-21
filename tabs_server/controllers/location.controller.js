const Location = require("../models/location.model");

const addLocationController = async (req, res) => {
  try {
    const { uid } = req.params;
    const { name } = req.body;

    const existingLocation = await Location.findOne({ name });

    if (existingLocation) {
      return res.status(409).json({
        success: false,
        message: "Location already exists!",
      });
    }

    const newLocation = await new Location({
      name,
      tenant: uid,
    }).save();

    return res.status(200).json({
      success: true,
      message: "Location added successfully",
      data: newLocation,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error!",
      err: err.message,
    });
  }
};

const updateLocationController = async (req, res) => {
  try {
    const { lid } = req.params;
    const { name } = req.body;

    const updatedLocation = await Location.findByIdAndUpdate(
      lid,
      { name },
      { new: true, runValidators: true }
    );

    if (!updatedLocation) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Location updated successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error!",
      err: err.message,
    });
  }
};

const fetchALocationController = async (req, res) => {
  try {
    const { uid } = req.query;
    const { lid } = req.params;

    const location = await Location.findOne({ tenant: uid, _id: lid });

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Location found successfully",
      data: location,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error!",
      err: err.message,
    });
  }
};

const fetchAllLocationsController = async (req, res) => {
  try {
    const { uid } = req.query;

    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;

    const skip = (page - 1) * limit;

    const totalLocations = await Location.countDocuments({ tenant: uid });

    const locations = await Location.find({ tenant: uid })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (locations.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "All locations found",
      data: locations,
      pagination: {
        totalLocations,
        limit,
        page,
        totalPages: Math.ceil(totalLocations / limit),
        hasNextPage: page * limit < totalLocations,
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

const fetchAllLocationsAtOnceController = async (req, res) => {
  try {
    const { uid } = req.query;

    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;

    const skip = (page - 1) * limit;

    const totalLocations = await Location.countDocuments({ tenant: uid });

    const locations = await Location.find({ tenant: uid })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (locations.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "All locations found",
      data: locations,
      pagination: {
        totalLocations,
        limit,
        page,
        totalPages: Math.ceil(totalLocations / limit),
        hasNextPage: page * limit < totalLocations,
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

const deleteALocationController = async (req, res) => {
  try {
    const { lid } = req.params;
    const { uid } = req.query;

    const location = await Location.findOne({ _id: lid, tenant: uid });

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    // 3. Delete the service
    await Location.deleteOne({ _id: lid });

    return res.status(200).json({
      success: true,
      message: "Location deleted successfully",
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
  addLocationController,
  updateLocationController,
  fetchALocationController,
  fetchAllLocationsAtOnceController,
  fetchAllLocationsController,
  deleteALocationController,
};
