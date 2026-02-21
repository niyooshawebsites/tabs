const bcrypt = require("bcrypt");

const encryptPassword = async (password) => {
  try {
    const saltRounds = 10;
    const encryptedPassword = await bcrypt.hash(password, saltRounds);
    return encryptedPassword;
  } catch (err) {
    console.log(`Error in encrypting the password: ${err.message}`);
  }
};

const decryptPassword = async (password, encryptedPassword) => {
  try {
    const isMatch = await bcrypt.compare(password, encryptedPassword);
    return isMatch;
  } catch (err) {
    console.log(`Error in decrypting the password: ${err.message}`);
  }
};

module.exports = { encryptPassword, decryptPassword };
