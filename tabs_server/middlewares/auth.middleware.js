const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  try {
    const authToken = req.cookies.authToken;

    if (!authToken) {
      return res.status(401).json({
        success: false,
        message: "No token, no access",
      });
    }
    const loginDetails = jwt.verify(authToken, process.env.JWT_SECRET);

    if (!loginDetails.uid || !loginDetails.email) {
      return res.status(401).json({
        success: false,
        message: "You are not authenticated!",
      });
    }

    req.user = loginDetails;
    next();
  } catch (err) {
    console.log(err);
  }
};

const isTenant = (req, res, next) => {
  try {
    const authToken = req.cookies.authToken;

    if (!authToken) {
      return res.status(401).json({
        success: false,
        message: "No token, no access",
      });
    }
    const loginDetails = jwt.verify(authToken, process.env.JWT_SECRET);

    if (loginDetails.role == 1) {
      req.user = loginDetails;
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "You are not a tenant. Unauthorized access. Permission denied",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const isTenantOrStaff = (req, res, next) => {
  try {
    const authToken = req.cookies.authToken;

    if (!authToken) {
      return res.status(401).json({
        success: false,
        message: "No token, no access",
      });
    }
    const loginDetails = jwt.verify(authToken, process.env.JWT_SECRET);

    if (loginDetails.role == 1 || loginDetails.role == 3) {
      req.user = loginDetails;
      next();
    } else {
      return res.status(401).json({
        success: false,
        message:
          "You are not a tenant or staff. Unauthorized access. Permission denied",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const isStaff = (req, res, next) => {
  try {
    const authToken = req.cookies.authToken;

    if (!authToken) {
      return res.status(401).json({
        success: false,
        message: "No token, no access",
      });
    }
    const loginDetails = jwt.verify(authToken, process.env.JWT_SECRET);

    if (loginDetails.role == 3) {
      req.user = loginDetails;
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "You are not a tenant. Unauthorized access. Permission denied",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const isPlatformOwner = (req, res, next) => {
  try {
    const authToken = req.cookies.authToken;

    if (!authToken) {
      return res.status(401).json({
        success: false,
        message: "No token, no access",
      });
    }
    const loginDetails = jwt.verify(authToken, process.env.JWT_SECRET);

    if (loginDetails.role !== 2) {
      return res.status(401).json({
        success: false,
        message:
          "You are not the platform owner. Unauthorized access. Permission denied",
      });
    }

    req.user = loginDetails;
    next();
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  isAuthenticated,
  isTenant,
  isTenantOrStaff,
  isStaff,
  isPlatformOwner,
};
