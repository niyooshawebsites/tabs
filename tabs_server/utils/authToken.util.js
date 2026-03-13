const jwt = require("jsonwebtoken");

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
