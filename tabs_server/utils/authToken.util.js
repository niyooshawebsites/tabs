const jwt = require("jsonwebtoken");

const generateAccessToken = (userDetails, expiry) => {
  const accessToken = jwt.sign(userDetails, process.env.JWT_ACCESS_SECRET, {
    expiresIn: expiry,
  });
  return accessToken;
};

const generateRefreshToken = (userDetails, expiry) => {
  const refreshToken = jwt.sign(userDetails, process.env.JWT_REFRESH_SECRET, {
    expiresIn: expiry,
  });
  return refreshToken;
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
