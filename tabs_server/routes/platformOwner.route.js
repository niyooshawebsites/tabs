const router = require("express").Router();

const {
  platformOwnerRegistrationController,
  platformOwnerLoginController,
  fetchOverAllStatsController,
} = require("../controllers/platformOwner.controller");
const { isPlatformOwner } = require("../middlewares/auth.middleware");

router.post("/platformowner-registration", platformOwnerRegistrationController);

router.post("/platformowner-login", platformOwnerLoginController);

router.get(
  "/fetch-overall-stats",
  isPlatformOwner,
  fetchOverAllStatsController,
);

module.exports = router;
