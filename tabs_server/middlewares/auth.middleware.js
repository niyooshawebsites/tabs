const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    console.log("TOKEN", accessToken);

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "No access token!!!",
      });
    }
    const loginDetails = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);

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
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "No access token!!!",
      });
    }
    const loginDetails = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);

    if (loginDetails.role !== 2) {
      return res.status(401).json({
        success: false,
        message: "You are not a tenant. Unauthorized access. Permission denied",
      });
    }
    req.user = loginDetails;
    next();
  } catch (err) {
    console.log(err);
  }
};

const isTenantOrStaff = (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "No access token!!!",
      });
    }
    const loginDetails = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);

    if (loginDetails.role !== 1 && loginDetails.role !== 2) {
      return res.status(401).json({
        success: false,
        message:
          "You are not a tenant or staff. Unauthorized access. Permission denied",
      });
    }
    req.user = loginDetails;
    next();
  } catch (err) {
    console.log(err);
  }
};

const isStaff = (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "No access token!!!",
      });
    }
    const loginDetails = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);

    if (loginDetails.role !== 1) {
      return res.status(401).json({
        success: false,
        message: "You are not a tenant. Unauthorized access. Permission denied",
      });
    }

    req.user = loginDetails;
    next();
  } catch (err) {
    console.log(err);
  }
};

const isPlatformOwner = (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "No access token!!!",
      });
    }
    const loginDetails = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);

    if (loginDetails.role !== 3) {
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
