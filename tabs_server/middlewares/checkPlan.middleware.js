const Tenant = require("../models/tenant.model");

const checkPlan = async (req, res, next) => {
  try {
    const { uid } = req.query || req.user.uid;
    const tenant = await Tenant.findById(uid);

    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found." });
    }

    // Free Plan Limit Check
    if (tenant.plan.name === "free") {
      if (tenant.totalAppointments >= 1000 || tenant.totalClients >= 500) {
        return res.status(403).json({
          success: false,
          message: "Free plan limit reached. Please upgrade your plan.",
        });
      }
    }

    // Paid Plan Expiry Check
    else if (tenant.plan.isActive) {
      const now = new Date();
      const endDate = new Date(tenant.plan.endDate);

      if (now > endDate) {
        tenant.plan.isActive = false;
        await tenant.save();
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
