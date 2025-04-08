const Joi = require("joi");

exports.productValidation = (body) => {
  const schemaProduct = Joi.object({
    name: Joi.string().min(1).message("bo'sh bo'lmasin"),
    description: Joi.string(),
    price_per_day: Joi.number().integer().positive().required().messages({
      "number.base": "Price per day must be a number.",
      "number.integer": "Price per day must be an integer.",
      "number.positive": "Price per day must be a positive number.",
      "any.required": "Price per day is required.",
    }),
    quantity: Joi.number().integer().positive().required().messages({
      "number.base": `"quantity" son bo'lishi kerak`,
      "number.integer": `"quantity" butun son bo'lishi kerak`,
      "number.positive": `"quantity" musbat bo'lishi kerak`,
      "any.required": `"quantity" majburiy maydon`,
    }),
    condition: Joi.string()
    .valid("new", "old")
    .required()
    .messages({
      "any.only": `"condition" faqat "new" yoki "old" bo'lishi mumkin`,
      "any.required": `"condition" maydoni majburiy`
    }),
    image_url: Joi.string().default("/images/img.png"),
  });
  return schemaProduct.validate(body, {
    ebortEarly: false,
  });
};
