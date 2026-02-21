const router = require("express").Router();

const {
  fetchOverAllStatsController,
} = require("../controllers/platformOwner.controller");
const { isPlatformOwner } = require("../middlewares/auth.middleware");

router.get(
  "/fetch-overall-stats",
  isPlatformOwner,
  fetchOverAllStatsController
);

module.exports = router;
