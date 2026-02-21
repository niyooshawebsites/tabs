const express = require("express");
const dotenv = require("dotenv");

const app = express();
// configuration
dotenv.config();

const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const connection = require("./config/db");
const userRoutes = require("./routes/user.route");
const appointmentRoutes = require("./routes/appointment.route");
const serviceRoutes = require("./routes/service.route");
const clientRoutes = require("./routes/client.route");
const adminRoutes = require("./routes/admin.route");
const invoiceRoutes = require("./routes/invoice.route");
const authRoutes = require("./routes/auth.route");
const announcementRoutes = require("./routes/announcement.route");
const platformOwnerRoutes = require("./routes/platformOwner.route");
const staffRoutes = require("./routes/staff.route");
const locationRoutes = require("./routes/location.route");
const planRoutes = require("./routes/plan.route");
const deactivateExpiredPlans = require("./cron/deactivateExpiredPlans.cron");
const extractTenant = require("./middlewares/tenant.middleware");

const PORT = process.env.PORT || 7500;

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin) return callback(null, true);
//       const allowedDomain = /\.?propertydealer\.sbs$/;
//       const url = new URL(origin);

//       if (allowedDomain.test(url.hostname)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   }),
// );

app.use(cors({ credentials: true }));

connection();

// middleware for extracting subdomain as tenant
app.use(extractTenant);

app.get("/api/v1/whoami", (req, res) => {
  res.json({
    tenant: req.tenant || "no tenant",
  });
});

// DB connection middleware (ensures DB is connected before routes)
// the below code is only for serverless backend server
// app.use(async (req, res, next) => {
//   if (req.method === "OPTIONS") return next(); // ✅ skip DB for preflight
//   try {
//     await connection();
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// Start cron job after DB connection
deactivateExpiredPlans();

app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// user routes
app.use(process.env.API_VERSION, userRoutes);

// appointment routes
app.use(process.env.API_VERSION, appointmentRoutes);

// service routes
app.use(process.env.API_VERSION, serviceRoutes);

// cleint routes
app.use(process.env.API_VERSION, clientRoutes);

// admin routes
app.use(process.env.API_VERSION, adminRoutes);

// invoice routes
app.use(process.env.API_VERSION, invoiceRoutes);

// auth routes
app.use(process.env.API_VERSION, authRoutes);

// announcement routes
app.use(process.env.API_VERSION, announcementRoutes);

// platform routes
app.use(process.env.API_VERSION, platformOwnerRoutes);

// location routes
app.use(process.env.API_VERSION, locationRoutes);

// staff routes
app.use(process.env.API_VERSION, staffRoutes);

// plan routes
app.use(process.env.API_VERSION, planRoutes);

// serverless function
// module.exports = app;

app.use((req, res, next) => {
  console.log("HOST:", req.headers.host);
  next();
});

// app.listen(PORT, "0.0.0.0", () => {
//   console.log("SERVER STARTED");
//   console.log("PORT:", PORT);
// });

app.listen(PORT, () =>
  console.log(
    `The server is running on PORT ${PORT} in ${process.env.NODE_ENV} environment`,
  ),
);
