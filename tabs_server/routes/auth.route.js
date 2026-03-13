const router = require("express").Router();
const { isAuthenticated } = require("../middlewares/auth.middleware");
const { validateBody } = require("../middlewares/validation.middleware");
const {
  forgotPasswordController,
  resetPasswordController,
  logoutController,
  refreshTokenController,
} = require("../controllers/auth.controller");
const {
  forgotPasswordSchema,
  resetPasswordSchema,
} = require("../validationSchemas/auth.validation.schema");

router.get("/check-auth", isAuthenticated, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Login is authenticated",
    user: req.user,
  });
});

// forgot password
router.patch(
  "/forgot-password",
  validateBody(forgotPasswordSchema),
  forgotPasswordController,
);

// reset password
router.patch(
  "/reset-password",
  validateBody(resetPasswordSchema),
  resetPasswordController,
);

// logout route
router.post("/logout", logoutController);

// refresh token route
router.post("/refresh-token", refreshTokenController);

module.exports = router;
