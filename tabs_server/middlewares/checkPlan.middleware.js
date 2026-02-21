const User = require("../models/user.model");

const checkPlan = async (req, res, next) => {
  try {
    const { uid } = req.query || req.user.uid;
    const user = await User.findById(uid);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Free Plan Limit Check
    if (user.plan.name === "free") {
      if (user.totalAppointments >= 1000 || user.totalClients >= 500) {
        return res.status(403).json({
          success: false,
          message: "Free plan limit reached. Please upgrade your plan.",
        });
      }
    }

    // Paid Plan Expiry Check
    else if (user.plan.isActive) {
      const now = new Date();
      const endDate = new Date(user.plan.endDate);

      if (now > endDate) {
        user.plan.isActive = false;
        await user.save();
        return res.status(403).json({
          success: false,
          message: "Your plan has expired. Please renew to continue.",
        });
      }
    }

    next();
  } catch (err) {
    console.error("Error checking plan:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error while checking plan.",
    });
  }
};

module.exports = checkPlan;
