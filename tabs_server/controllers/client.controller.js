const Client = require("../models/client.model");
const mongoose = require("mongoose");

const fetchAllClientsController = async (req, res) => {
  try {
    const { uid } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const totalClients = await Client.countDocuments({ tenant: uid });

    const clients = await Client.find({ tenant: uid })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (clients.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No clients found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "All clients found successfully",
      data: clients,
      pagination: {
        totalClients,
        page,
        limit,
        totalPages: Math.ceil(totalClients / limit),
        hasNextPage: page * limit < totalClients,
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

const fetchAClientController = async (req, res) => {
  try {
    const { cid } = req.params;
    const { uid } = req.query;

    let client = await Client.findOne({ _id: cid, tenant: uid });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Client found successfully",
      data: client,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error!",
      err: err.message,
    });
  }
};

const fetchAClientByPhoneController = async (req, res) => {
  try {
    const { clientInfo } = req.params;
    const { uid } = req.query;

    let client;

    if (mongoose.Types.ObjectId.isValid(clientInfo)) {
      client = await Client.findOne({ _id: clientInfo, tenant: uid });
    } else {
      client = await Client.findOne({ phone: clientInfo, tenant: uid });
    }

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Client found successfully",
      data: client,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error!",
      err: err.message,
    });
  }
};

const fetchAllClientsForPlatformOwnerController = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const totalClients = await Client.countDocuments()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const allClients = await Client.find();

    if (allClients.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No clients found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Clients found",
      data: allClients,
      pagination: {
        totalClients,
        limit,
        page,
        totalPages: Math.ceil(totalClients / limit),
        hasNextPage: page * limit < totalClients,
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
  fetchAllClientsController,
  fetchAClientController,
  fetchAClientByPhoneController,
  fetchAllClientsForPlatformOwnerController,
};
