const router = require("express").Router();
const { isAuthenticated } = require("../middlewares/auth.middleware");
const { validateBody } = require("../middlewares/validation.middleware");
const { resetPasswordController } = require("../controllers/auth.controller");

router.get("/check-auth", isAuthenticated, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "User is authenticated",
    user: req.user,
  });
});

router.post("/reset-tenant-password", validateBody, resetPasswordController);

module.exports = router;
