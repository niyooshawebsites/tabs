const { z } = require("zod");

const createAnnouncementSchema = z.object({
  message: z
    .string({
      required_error: "Announcement message is required",
      invalid_type_error: "Message must be a string",
    })
    .min(1, "Announcement message cannot be empty"),
});

module.exports = createAnnouncementSchema;
