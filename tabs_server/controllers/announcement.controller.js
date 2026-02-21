const Announcement = require("../models/announcement.model");

// creating announcements
const createAnnouncementController = async (req, res) => {
  try {
    const { message } = req.body;
    const { uid } = req.query;

    const announcementCount = await Announcement.countDocuments({
      tenant: uid,
    });

    if (announcementCount === 1) {
      return res.status(400).json({
        success: false,
        message: "Announcement already exists",
      });
    }

    const newAnnouncement = await new Announcement({
      message,
      tenant: uid,
    }).save();

    return res.status(200).json({
      success: true,
      message: "Announcement created successfully",
      data: newAnnouncement,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error!",
      err: err.message,
    });
  }
};

// deleting accouncements
const deleteAnnouncementController = async (req, res) => {
  try {
    const { aid } = req.params;
    const { uid } = req.query;

    if (!aid) {
      return res.status(400).json({
        success: false,
        message: "No announcement id provided",
      });
    }

    await Announcement.findOneAndDelete({ _id: aid, tenant: uid });

    return res.status(200).json({
      success: true,
      message: "Announcement deleted successfully!",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error!",
      err: err.message,
    });
  }
};

// fetching accouncements
const fetchAnnouncementController = async (req, res) => {
  try {
    const { uid } = req.query;
    const announcement = await Announcement.findOne({ tenant: uid });

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "No announcement found",
      });
    }

    return res.status(200).json({
      success: true,
      announcement: announcement,
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
  createAnnouncementController,
  deleteAnnouncementController,
  fetchAnnouncementController,
};
