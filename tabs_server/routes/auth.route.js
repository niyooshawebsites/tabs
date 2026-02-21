const router = require("express").Router();
const { isAuthenticated } = require("../middlewares/auth.middleware");

router.get("/check-auth", isAuthenticated, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "User is authenticated",
    user: req.user,
  });
});

module.exports = router;
