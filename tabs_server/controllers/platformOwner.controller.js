const Appointment = require("../models/appointment.model");
const User = require("../models/appointment.model");
const Client = require("../models/client.model");
const moment = require("moment");

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

    const allTimesTenantsCount = await User.countDocuments({
      _id: { $ne: "68ebc727e241289c057cae39" },
    });
    const todayTenantsCount = await User.countDocuments({
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

module.exports = { fetchOverAllStatsController };
