const router = require("express").Router();
const {
  appointmentSlotsAvailabilityCheckController,
  bookAppointmentController,
  fetchAllApointmentsController,
  fetchAnAppointmentController,
  searchAnAppointmentController,
  dashboardSearchAnAppointmentController,
  updateAppointmentController,
  fetchClientAppointmentsController,
  fetchTodayAppointmentsController,
  fetchFilteredAppointmentsController,
  fetchFilteredAppointmentsForPlatformOwnerController,
  fetchTodayFilteredAppointmentsController,
  fetchFilteredClientAppointmentsController,
  fetchAllAppointmentsForPlatformOwnerController,
  fetchLast7DaysAppointmentsController,
  fetchYearlyAppointmentsController,
} = require("../controllers/appointment.controller");

const {
  isTenantOrStaff,
  isPlatformOwner,
} = require("../middlewares/auth.middleware");
const checkPlan = require("../middlewares/checkPlan.middleware");

const {
  validateBody,
  validateQuery,
  validateParams,
} = require("../middlewares/validation.middleware");

const {
  querySchema,
  generateParamSchema,
} = require("../validationSchemas/common.validation.schema");

const {
  bookAppointmentSchema,
  updateAppointmentSchema,
} = require("../validationSchemas/appointment.validation.schema");

// Check appointment time slots route
router.post(
  "/check-available-slots",
  appointmentSlotsAvailabilityCheckController
);

// book appointment for a tenant route
router.post(
  "/book-appointment",
  validateQuery(querySchema),
  validateBody(bookAppointmentSchema),
  checkPlan,
  bookAppointmentController
);

// fetch all appointment route
router.get(
  "/fetch-all-appointments",
  isTenantOrStaff,
  validateQuery(querySchema),
  fetchAllApointmentsController
);

// fetch an appointment
router.get(
  "/fetch-appointment/:aid",
  isTenantOrStaff,
  validateQuery(querySchema),
  validateParams(generateParamSchema("aid")),
  fetchAnAppointmentController
);

// search an appointment without login
router.get(
  "/search-appointment/:aid",
  validateQuery(querySchema),
  validateParams(generateParamSchema("aid")),
  searchAnAppointmentController
);

// dashboard search an appointment
router.get(
  "/dashboard-search-appointment/:aid",
  isTenantOrStaff,
  validateQuery(querySchema),
  validateParams(generateParamSchema("aid")),
  dashboardSearchAnAppointmentController
);

// update an appointment
router.patch(
  "/update-appointment/:aid",
  isTenantOrStaff,
  validateQuery(querySchema),
  validateParams(generateParamSchema("aid")),
  validateBody(updateAppointmentSchema),
  updateAppointmentController
);

// fetch all appointments for a client
router.get(
  "/fetch-client-appointments/:cid",
  isTenantOrStaff,
  validateParams(generateParamSchema("cid")),
  validateQuery(querySchema),
  fetchClientAppointmentsController
);

// fetch all filtered ppointments for a client
router.get(
  "/fetch-filtered-client-appointments/:cid",
  isTenantOrStaff,
  validateParams(generateParamSchema("cid")),
  validateQuery(querySchema),
  fetchFilteredClientAppointmentsController
);

// fetch today appointments
router.get(
  "/fetch-today-appointments",
  isTenantOrStaff,
  validateQuery(querySchema),
  fetchTodayAppointmentsController
);

// fetch last 7 days appointments appointments
router.get(
  "/fetch-last-7-days-appointments",
  isTenantOrStaff,
  validateQuery(querySchema),
  fetchLast7DaysAppointmentsController
);

// fetch whole year appointments appointments
router.get(
  "/fetch-yearly-appointments",
  isTenantOrStaff,
  validateQuery(querySchema),
  fetchYearlyAppointmentsController
);

// fetch filtered appointments
router.get(
  "/fetch-filtered-appointments",
  isTenantOrStaff,
  validateQuery(querySchema),
  fetchFilteredAppointmentsController
);

// fetch filtered appointments for plaform owner
router.get(
  "/fetch-filtered-appointments-for-platform-owner",
  isPlatformOwner,
  validateQuery(querySchema),
  fetchFilteredAppointmentsForPlatformOwnerController
);

// fetch today's filtered appointments
router.get(
  "/fetch-today-filtered-appointments",
  isTenantOrStaff,
  validateQuery(querySchema),
  fetchTodayFilteredAppointmentsController
);

// fetch alls appointments for platform owner route
router.get(
  "/fetch-all-appointments-for-platform-owner",
  isPlatformOwner,
  validateQuery(querySchema),
  fetchAllAppointmentsForPlatformOwnerController
);

module.exports = router;
