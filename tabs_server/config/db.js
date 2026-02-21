const mongoose = require("mongoose");
const colors = require("colors");

let isConntected = null; // Global cached connection

const connection = async () => {
  if (isConntected) {
    console.log(colors.green("Using existing database connection"));
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);

    isConntected = db.connections[0].readyState;
    console.log(colors.magenta("Successfully connected to DB"));
  } catch (err) {
    console.error(colors.bgRed(`DB connection failed: ${err.message}`));
    throw new Error("Database connection failed");
  }
};

module.exports = connection;
