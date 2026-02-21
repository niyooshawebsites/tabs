const cron = require("node-cron");
const User = require("../models/user.model");

const deactivateExpiredPlans = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const now = new Date();

      const result = await User.updateMany(
        { "plan.isActive": true, "plan.endDate": { $lt: now } },
        { $set: { "plan.isActive": false } }
      );

      if (result.modifiedCount > 0) {
        console.log(
          `🔄 ${result.modifiedCount} expired plans deactivated at ${now}`
        );
      } else {
        console.log(`✅ No expired plans found at ${now}`);
      }
    } catch (error) {
      console.error("❌ Error in cron job:", error.message);
    }
  });
};

module.exports = deactivateExpiredPlans;
