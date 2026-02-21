const Service = require("../models/service.model");
const Appointment = require("../models/appointment.model");

// adding a service for a tenant
const addServiceController = async (req, res) => {
  try {
    const { uid } = req.params;
    const { name, charges, duration } = req.body;

    // check for existing service for the tenant
    const exisitngService = await Service.findOne({ uid, name });

    // if the service already exists for the tenant
    if (exisitngService) {
      return res.status(409).json({
        success: false,
        message: "Service already exists",
      });
    }

    // creating and saving the new service
    const newService = await new Service({
      name,
      charges,
      duration,
      tenant: uid,
    }).save();

    return res.status(201).json({
      success: true,
      message: "Sevice created successfully",
      data: newService,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error!",
      err: err.message,
    });
  }
};

// fetch all services for a tenant
const fetchAllServicesController = async (req, res) => {
  try {
    const { uid } = req.query;
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;

    const skip = (page - 1) * limit;

    const totalServices = await Service.countDocuments({ tenant: uid });

    const services = await Service.find({ tenant: uid })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (services.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No services found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "All services found",
      data: services,
      pagination: {
        totalServices,
        limit,
        page,
        totalPages: Math.ceil(totalServices / limit),
        hasNextPage: page * limit < totalServices,
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

// fetch all services for a tenant
const fetchAllServicesAtOnceController = async (req, res) => {
  try {
    const { uid } = req.query;
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;

    const skip = (page - 1) * limit;

    const totalServices = await Service.countDocuments({ tenant: uid });

    const services = await Service.find({ tenant: uid })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (services.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No services found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "All services found",
      data: services,
      pagination: {
        totalServices,
        limit,
        page,
        totalPages: Math.ceil(totalServices / limit),
        hasNextPage: page * limit < totalServices,
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

// fetch a service
const fetchServiceController = async (req, res) => {
  try {
    const { sid } = req.params;
    const { uid } = req.query;

    if (!sid) {
      return res.status(400).json({
        success: false,
        message: "Service ID is required",
      });
    }

    const service = await Service.findOne({ _id: sid, tenant: uid });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "No service found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "All services found",
      data: service,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error!",
      err: err.message,
    });
  }
};

// update a service
const updateAServiceController = async (req, res) => {
  try {
    const { sid } = req.params;
    const { uid } = req.query;
    const { name, charges, duration } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Service name is required",
      });
    }

    if (!charges) {
      return res.status(400).json({
        success: false,
        message: "Charges is required",
      });
    }

    const updatedService = await Service.findOneAndUpdate(
      { _id: sid, tenant: uid },
      { name, charges, duration },
      { new: true, runValidators: true }
    );

    if (!updatedService) {
      return res.status(404).json({
        success: false,
        message: "No services found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: updatedService,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error!",
      err: err.message,
    });
  }
};

// delete a service
const deleteAServiceController = async (req, res) => {
  try {
    const { sid } = req.params;
    const { uid } = req.query;

    // 1. Verify service exists and belongs to tenant
    const service = await Service.findOne({ _id: sid, tenant: uid });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    // 2. Delete all appointments linked to this service
    await Appointment.deleteMany({ service: sid });

    // 3. Delete the service
    await Service.deleteOne({ _id: sid });

    return res.status(200).json({
      success: true,
      message: "Service and related appointments deleted successfully",
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
  addServiceController,
  fetchAllServicesAtOnceController,
  fetchAllServicesController,
  fetchServiceController,
  updateAServiceController,
  deleteAServiceController,
};
