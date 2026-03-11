const jwt = require("jsonwebtoken");

const generateAuthToken = (userDetails, expiry) => {
  const authToken = jwt.sign(userDetails, process.env.JWT_SECRET, {
    expiresIn: expiry,
  });
  return authToken;
};

const generateAccessToken = (userDetails, expiry) => {
  const accessToken = jwt.sign(userDetails, process.env.JWT_SECRET, {
    expiresIn: expiry,
  });
  return accessToken;
};

const generateRefreshToken = (userDetails, expiry) => {
  const refreshToken = jwt.sign(userDetails, process.env.JWT_SECRET, {
    expiresIn: expiry,
  });
  return refreshToken;
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
