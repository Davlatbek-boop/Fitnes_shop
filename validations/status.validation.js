const Joi = require("joi");

exports.statusValidation = (body) => {
  const schemaStatus = Joi.object({
    name: Joi.string()
      .valid("pending", "approved", "rejected")
      .message("/status/ jarayonni to'g'ri kiriting"),
    description: Joi.string(),
  });
  return schemaStatus.validate(body, {
    ebortEarly: false,
  });
};
