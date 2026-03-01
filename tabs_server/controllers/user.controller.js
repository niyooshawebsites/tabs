const User = require("../models/user.model");
const {
  encryptPassword,
  decryptPassword,
} = require("../utils/securePassword.util");
const generateAuthToken = require("../utils/authToken.util");

// registration controller
const registerController = async (req, res) => {
  try {
    // Ensure the response is not cached
    res.setHeader("Cache-Control", "no-store");

    const { username, email, password, profession } = req.body;

    // check for existing user
    const user = await User.findOne({
      $or: [{ email }, { username }],
    });

    // if user found
    if (user) {
      return res.status(409).json({
        success: false,
        message: "Account exists! Please login",
      });
    }

    // encrypting the password
    const encryptedPassword = await encryptPassword(password);

    // initiate a new user and save it the DB
    const newUser = await new User({
      username,
      email,
      password: encryptedPassword,
      profession,
    }).save();

    return res.status(200).json({
      success: true,
      message: "Registration successful",
      data: newUser,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error!",
      err: err.message,
    });
  }
};

// login controller
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check for existing user
    const user = await User.findOne({ email });

    // if no user found
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // verify the password
    const passwordVerfication = await decryptPassword(password, user.password);

    if (!passwordVerfication) {
      return res.status(403).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const loginDetails = {
      uid: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
      empId: user.empId,
    };

    // generate the authToken
    const authToken = await generateAuthToken(loginDetails, "1d");

    // set the cookie
    res.cookie("authToken", authToken, {
      httpOnly: process.env.COOKIE_HTTPONLY === "true",
      secure: process.env.NODE_ENV === "production",
      // sameSite: "None",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      path: "/",
    });

    // saving the user in the requrest object for isAdmin middleware access
    req.user = loginDetails;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      authToken,
      data: loginDetails,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error!",
      err: err.message,
    });
  }
};

// logout controller
const logoutController = async (req, res) => {
  try {
    res.clearCookie("authToken", {
      httpOnly: process.env.COOKIE_HTTPONLY === "true",
      secure: process.env.NODE_ENV === "production",
      // sameSite: "None",
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error!",
      err: err.message,
    });
  }
};

// update user controller
const updateUserController = async (req, res) => {
  try {
    const { uid } = req.params;

    const { password } = req.body;

    const encryptedPassword = await encryptPassword(password);

    const updatedUser = await User.findByIdAndUpdate(
      uid,
      { password: encryptedPassword },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User details updated successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error!",
      err: err.message,
    });
  }
};

const doesTenantExistController = async (req, res) => {
  try {
    const { username } = req.query;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User exists",
      data: {
        id: user._id,
      },
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
  registerController,
  loginController,
  logoutController,
  updateUserController,
  doesTenantExistController,
};
