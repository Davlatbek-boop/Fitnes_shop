const Joi = require("joi");

exports.categoryValidation = (body) => {
  const schemaCategory = Joi.object({
    name: Joi.string().min(1).message("bo'sh bo'lmasin"),
    description: Joi.string(),
    image_url: Joi.string().default("/images/img.png"),
  });
  return schemaCategory.validate(body, {
    ebortEarly: false,
  });
};
