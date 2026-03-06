const router = require("express").Router();
const { isAuthenticated } = require("../middlewares/auth.middleware");
const { validateBody } = require("../middlewares/validation.middleware");
const {
  forgotPasswordController,
  resetPasswordController,
} = require("../controllers/auth.controller");

router.get("/check-auth", isAuthenticated, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "User is authenticated",
    user: req.user,
  });
});

// forgot password
router.patch("/forgot-password", validateBody, forgotPasswordController);

// reset password
router.patch("/reset-password", validateBody, resetPasswordController);

module.exports = router;
