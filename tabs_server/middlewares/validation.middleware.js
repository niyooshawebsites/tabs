const { z } = require("zod");

const validateBody = (schema) => {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed;
      console.log(parsed);
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: err.issues.map((e) => e.message),
        });
      }

      // 👇 Log and return generic error
      console.error("Unexpected error in validateBody middleware:", err);

      return res.status(500).json({
        success: false,
        message: "Server error",
        error: err.message,
      });
    }
  };
};

const validateQuery = (schema) => {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req.query);
      req.query = parsed; // overwrite req.query with validated data
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: err.issues.map((e) => e.message),
        });
      }

      // 👇 Log and return generic error
      console.error("Unexpected error in validateBody middleware:", err);

      return res.status(500).json({
        success: false,
        message: "Server error",
        error: err.message,
      });
    }
  };
};

const validateParams = (schema) => {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req.params);
      req.params = parsed; // overwrite req.params with validated data
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: err.issues.map((e) => e.message),
        });
      }

      // 👇 Log and return generic error
      console.error("Unexpected error in validateBody middleware:", err);

      return res.status(500).json({
        success: false,
        message: "Server error",
        error: err.message,
      });
    }
  };
};

module.exports = { validateBody, validateQuery, validateParams };
