const mongoose = require("mongoose");
const Service = require("../models/service.model");
const Location = require("../models/location.model");
const Appointment = require("../models/appointment.model");
const Client = require("../models/client.model");
const Admin = require("../models/admin.model");
const User = require("../models/user.model");
const moment = require("moment");
const {
  sendAppointmentBookingEmail,
  sendAppointmentStatusChangeEmail,
} = require("../utils/mail.util");

// check appointment slots availability
const appointmentSlotsAvailabilityCheckController = async (req, res) => {
  try {
    const { sid, lid, date } = req.body;
    const { uid } = req.query;

    if (!date || !lid || !uid) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const service = await Service.findById(sid);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const location = await Location.findById(lid);
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    const admin = await Admin.findOne({ tenant: uid });
    if (!admin) {
      return res.status(404).json({ message: "Tenant Details not found" });
    }

    const duration = service.duration;

    // -----------------------------
    // BUILD WORKING HOURS ARRAY
    // -----------------------------
    let workingHours = [];

    if (admin.timings.shiftType === "full") {
      if (!admin.timings.fullDay.start || !admin.timings.fullDay.end) {
        return res.status(400).json({
          success: false,
          message: "Full day timings missing",
        });
      }

      workingHours.push({
        start: admin.timings.fullDay.start,
        end: admin.timings.fullDay.end,
      });
    }

    if (admin.timings.shiftType === "part") {
      const p = admin.timings.partDay;

      if (
        !p.morningStart ||
        !p.morningEnd ||
        !p.eveningStart ||
        !p.eveningEnd
      ) {
        return res.status(400).json({
          success: false,
          message: "Part day timings missing",
        });
      }

      workingHours.push(
        { start: p.morningStart, end: p.morningEnd },
        { start: p.eveningStart, end: p.eveningEnd },
      );
    }

    // Utility functions
    const toMinutes = (t) => {
      const [h, m] = t.split(":");
      return parseInt(h) * 60 + parseInt(m);
    };

    const toHHMM = (mins) => {
      const h = String(Math.floor(mins / 60)).padStart(2, "0");
      const m = String(mins % 60).padStart(2, "0");
      return `${h}:${m}`;
    };

    // Fetch existing booked appointments
    const appointments = await Appointment.find({
      date,
      service: sid,
      location: lid,
    });

    let allSlots = [];

    // LOOP OVER EACH WORKING SESSION
    for (const session of workingHours) {
      const sessionStart = toMinutes(session.start);
      const sessionEnd = toMinutes(session.end);

      for (
        let time = sessionStart;
        time + duration <= sessionEnd;
        time += duration
      ) {
        const slotStart = time;
        const slotEnd = time + duration;

        let isBooked = false;

        // Check if overlapping with any existing appointment
        appointments.forEach((app) => {
          const appStart = toMinutes(app.time);
          const appEnd = appStart + duration;

          if (slotStart < appEnd && appStart < slotEnd) {
            isBooked = true;
          }
        });

        allSlots.push({
          start: toHHMM(slotStart),
          end: toHHMM(slotEnd),
          available: !isBooked,
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Slots fetched successfully",
      data: allSlots,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Server error!",
      err: err.message,
    });
  }
};

// book an appointment
const bookAppointmentController = async (req, res) => {
  try {
    const { uid } = req.query;

    const {
      name,
      gender,
      email,
      phone,
      dob,
      address,
      city,
      state,
      pincode,
      date,
      time,
      service,
      location,
      notes,
    } = req.body;

    console.log("Location: ", location);

    // check for exisitng client
    const existingClient = await Client.findOne({ email, tenant: uid });
    const admin = await Admin.findOne({ tenant: uid });

    // if client exists
    if (existingClient) {
      // creating and saving the new appointment
      const newAppointment = await new Appointment({
        service,
        location,
        date,
        time,
        client: existingClient._id,
        tenant: uid,
        notes,
      }).save();

      // Populate service and client
      const populatedAppointment = await Appointment.findById(
        newAppointment._id,
      )
        .populate("service")
        .populate("location")
        .populate("client")
        .populate("tenant");

      // send email to the client for appointment confirmation
      sendAppointmentBookingEmail(existingClient, populatedAppointment, admin);

      return res.status(201).json({
        success: true,
        message: "Appointment booked successfully",
        data: {
          appointment: populatedAppointment,
          client: existingClient,
        },
      });
    }

    // create and save the new client
    await new Client({
      name,
      gender,
      email,
      phone,
      dob,
      address,
      city,
      state,
      pincode,
      tenant: uid,
    }).save();

    // check for exisitng client
    const newClientDetails = await Client.findOne({ email, tenant: uid });

    // creating and saving the new appointment
    const newAppointment = await new Appointment({
      service,
      location,
      date,
      time,
      client: newClientDetails._id,
      tenant: uid,
      notes,
    }).save();

    // Populate service and client
    const populatedAppointment = await Appointment.findById(newAppointment._id)
      .populate("service")
      .populate("location")
      .populate("client");

    // send email to the client for appointment confirmation
    sendAppointmentBookingEmail(newClientDetails, populatedAppointment, admin);

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      data: {
        appointment: populatedAppointment,
        client: newClientDetails,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Server error!",
      err: err.message,
    });
  }
};

// show all appointments
const fetchAllApointmentsController = async (req, res) => {
  try {
    const { uid } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalAppointments = await Appointment.countDocuments({ tenant: uid });

    const appointments = await Appointment.find({ tenant: uid })
      .populate("service")
      .populate("location")
      .populate("client")
      .populate("tenant")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (appointments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No appointments found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Appointment fetched successfully",
      data: appointments,
      pagination: {
        totalAppointments,
        page,
        limit,
        totalPages: Math.ceil(totalAppointments / limit),
        hasNextPage: page * limit < totalAppointments,
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

// fetch a single appointment
const fetchAnAppointmentController = async (req, res) => {
  try {
    const { aid } = req.params;
    const { uid } = req.query;

    const appointment = await Appointment.findOne({ _id: aid, tenant: uid })
      .populate("service")
      .populate("location")
      .populate("client");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "No appointment found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Appointment found",
      data: appointment,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error!",
      err: err.message,
    });
  }
};

// fetch a single appointment
const searchAnAppointmentController = async (req, res) => {
  try {
    const { aid } = req.params;
    const { username } = req.query;

    // Check if ObjectId is valid
    if (!mongoose.isValidObjectId(aid)) {
      return res.status(404).json({
        success: false,
        message: "Invalid appointment ID",
      });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid user",
      });
    }

    const appointment = await Appointment.findOne({
      _id: aid,
      tenant: user._id,
    })
      .populate("service")
      .populate("location")
      .populate("client", "-phone -email -address");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "No appointment found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Appointment found",
      data: appointment,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error!",
      err: err.message,
    });
  }
};

// fetch a single appointment
const dashboardSearchAnAppointmentController = async (req, res) => {
  try {
    const { aid } = req.params;
    const { uid } = req.query;

    const appointment = await Appointment.findOne({ _id: aid, tenant: uid })
      .populate("service")
      .populate("location")
      .populate("client");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "No appointment found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Appointment found",
      data: appointment,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error!",
      err: err.message,
    });
  }
};

// update appointment
const updateAppointmentController = async (req, res) => {
  try {
    const { uid } = req.query;
    const { aid } = req.params;
    const { status, date, time, remarks } = req.body;
    const admin = await Admin.findOne({ tenant: uid });

    const updateFields = { status };

    if (status === "Rescheduled") {
      if (!date || !time) {
        return res.status(400).json({
          success: false,
          message: "Date and time are required for rescheduling",
        });
      }
      updateFields.date = date;
      updateFields.time = time;
    }

    let updatedAppointment;

    // If remarks exist, push it as an object
    if (remarks) {
      updatedAppointment = await Appointment.findOneAndUpdate(
        { _id: aid, tenant: uid },
        {
          $push: {
            remarks: {
              message: remarks,
            },
          },
          $set: updateFields,
        },
        { new: true },
      )
        .populate("service")
        .populate("client");
    } else {
      updatedAppointment = await Appointment.findByIdAndUpdate(
        aid,
        updateFields,
        { new: true },
      );
    }

    if (!updatedAppointment) {
      return res.status(404).json({
        success: false,
        message: "No appointment found",
      });
    }

    const clientDetails = {
      name: updatedAppointment.client.name,
      email: updatedAppointment.client.email,
    };

    // send email to the client for appointment status change
    sendAppointmentStatusChangeEmail(clientDetails, updatedAppointment, admin);

    return res.status(200).json({
      success: true,
      message: "Appointment details updated!",
      data: updatedAppointment,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error!",
      err: err.message,
    });
  }
};

// fetch all the appointments for a client
const fetchClientAppointmentsController = async (req, res) => {
  try {
    const { cid } = req.params;
    const { uid } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const appointments = await Appointment.find({ client: cid, tenant: uid })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate("client")
      .populate("service");

    const totalAppointments = await Appointment.countDocuments({
      client: cid,
      tenant: uid,
    });

    if (totalAppointments === 0) {
      return res.status(404).json({
        success: false,
        message: "No appointments found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Appointments found",
      data: appointments,
      pagination: {
        totalAppointments,
        page,
        limit,
        totalPages: Math.ceil(totalAppointments / limit),
        hasNextPage: page * limit < totalAppointments,
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

// fetch all the filtered appointments for a client of a tenant
const fetchFilteredClientAppointmentsController = async (req, res) => {
  try {
    const { cid } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { service, startDate, endDate, status, uid } = req.query;

    // build a dyncmic mongodb query
    const filter = { client: cid, tenant: uid };

    // if service is provided
    if (service) {
      filter.service = service;
    }

    // if dates are provided
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // if status is provided
    if (status) {
      filter.status = status;
    }

    const totalAppointments = await Appointment.countDocuments(filter);

    const appointments = await Appointment.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate("client")
      .populate("service");

    if (totalAppointments === 0) {
      return res.status(404).json({
        success: false,
        message: "No appointments found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Appointments found",
      data: appointments,
      pagination: {
        totalAppointments,
        page,
        limit,
        totalPages: Math.ceil(totalAppointments / limit),
        hasNextPage: page * limit < totalAppointments,
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

// fetch today appointments for a tenant route
const fetchTodayAppointmentsController = async (req, res) => {
  try {
    const { uid } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const startDate = moment().startOf("day").toDate();
    const endDate = moment().endOf("day").toDate();

    const totalAppointments = await Appointment.countDocuments({
      tenant: uid,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    const completedAppointments = await Appointment.countDocuments({
      tenant: uid,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
      status: "Completed",
    });

    const confirmedAppointments = await Appointment.countDocuments({
      tenant: uid,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
      status: "Confirmed",
    });

    const pendingAppointments = await Appointment.countDocuments({
      tenant: uid,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
      status: "Pending",
    });

    const cancelledAppointments = await Appointment.countDocuments({
      tenant: uid,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
      status: "Cancelled",
    });

    const appointments = await Appointment.find({
      tenant: uid,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("service")
      .populate("client")
      .populate("tenant");

    if (appointments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No appointments for today",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Appointments found",
      data: appointments,
      pagination: {
        limit,
        page,
        totalAppointments,
        completedAppointments,
        confirmedAppointments,
        pendingAppointments,
        cancelledAppointments,
        totalPages: Math.ceil(totalAppointments / limit),
        hasNextPage: page * limit < totalAppointments,
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

// fetch last 7 days appointments for a tenant route
const fetchLast7DaysAppointmentsController = async (req, res) => {
  try {
    const { uid } = req.query;

    const start = moment().subtract(6, "days").startOf("day").toDate();
    const end = moment().endOf("day").toDate();

    const result = await Appointment.aggregate([
      // Force convert tenant and date
      {
        $addFields: {
          dateObj: { $toDate: "$date" },
          tenantObj: { $toObjectId: "$tenant" },
        },
      },
      {
        $match: {
          tenantObj: new mongoose.Types.ObjectId(uid),
          dateObj: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$dateObj" },
            month: { $month: "$dateObj" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.month": 1, "_id.day": 1 } },
    ]);

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// fetch a whole year appointments for a tenant route
const fetchYearlyAppointmentsController = async (req, res) => {
  try {
    const { uid, year } = req.query;

    const selectedYear = year || moment().year();
    const start = moment(selectedYear, "YYYY").startOf("year").toDate();
    const end = moment(selectedYear, "YYYY").endOf("year").toDate();

    const result = await Appointment.aggregate([
      {
        $addFields: {
          dateObj: { $toDate: "$date" },
          tenantObj: { $toObjectId: "$tenant" },
        },
      },
      {
        $match: {
          tenantObj: new mongoose.Types.ObjectId(uid),
          dateObj: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$dateObj" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.month": 1 } },
    ]);

    const finalData = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const entry = result.find((r) => r._id.month === month);
      return {
        month,
        count: entry ? entry.count : 0,
      };
    });

    res.status(200).json({
      success: true,
      year: selectedYear,
      data: finalData,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// fetch filtered appointments route
const fetchFilteredAppointmentsController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { service, startDate, endDate, status, uid } = req.query;

    // build a dynamic mongodb query
    const filter = { tenant: uid };

    // if service is provided
    if (service) {
      filter.service = service;
    }

    // if start and end date is provided
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // if status is provided
    if (status) {
      filter.status = status;
    }

    const totalAppointments = await Appointment.countDocuments(filter);

    const appointments = await Appointment.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("service")
      .populate("client")
      .populate("tenant");

    if (appointments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No appointments found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Appointments found",
      data: appointments,
      pagination: {
        limit,
        page,
        totalAppointments,
        totalPages: Math.ceil(totalAppointments / limit),
        hasNextPage: page * limit < totalAppointments,
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

// fetch filtered appointments for platform owner
const fetchFilteredAppointmentsForPlatformOwnerController = async (
  req,
  res,
) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { service, startDate, endDate, status } = req.query;

    // build a dynamic mongodb query
    const filter = {};

    // if service is provided
    if (service) {
      filter.service = service;
    }

    // if start and end date is provided
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // if status is provided
    if (status) {
      filter.status = status;
    }

    const totalAppointments = await Appointment.countDocuments(filter);

    const appointments = await Appointment.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("service")
      .populate("client")
      .populate("tenant");

    if (appointments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No appointments found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Appointments found",
      data: appointments,
      pagination: {
        limit,
        page,
        totalAppointments,
        totalPages: Math.ceil(totalAppointments / limit),
        hasNextPage: page * limit < totalAppointments,
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

// fetch taday's filtered appointments route
const fetchTodayFilteredAppointmentsController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { service, status, uid } = req.query;

    const startOfDay = moment().startOf("day").toDate();
    const endOfDay = moment().endOf("day").toDate();

    // build a dymanic mondodb query
    const filter = {
      tenant: uid,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    };

    // if service is provided
    if (service) {
      filter.service = service;
    }

    // if status is provided
    if (status) {
      filter.status = status;
    }

    const totalAppointments = await Appointment.countDocuments(filter);

    const appointments = await Appointment.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("service")
      .populate("client")
      .populate("tenant");

    if (appointments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No appointments found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Appointments found",
      data: appointments,
      pagination: {
        limit,
        page,
        totalAppointments,
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

// fetch all appointments for platform owner
const fetchAllAppointmentsForPlatformOwnerController = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const totalAppointments = await Appointment.countDocuments();

    const allAppointments = await Appointment.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("service")
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
  appointmentSlotsAvailabilityCheckController,
  bookAppointmentController,
  fetchAllApointmentsController,
  fetchAnAppointmentController,
  searchAnAppointmentController,
  dashboardSearchAnAppointmentController,
  updateAppointmentController,
  fetchClientAppointmentsController,
  fetchTodayAppointmentsController,
  fetchFilteredAppointmentsController,
  fetchFilteredAppointmentsForPlatformOwnerController,
  fetchTodayFilteredAppointmentsController,
  fetchFilteredClientAppointmentsController,
  fetchAllAppointmentsForPlatformOwnerController,
  fetchLast7DaysAppointmentsController,
  fetchYearlyAppointmentsController,
};
