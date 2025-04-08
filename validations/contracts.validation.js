const Joi = require("joi");

exports.contractValidation = (body) => {
  const schemaContract = Joi.object({
    rent_start: Joi.date().required().messages({
      "date.base": "Xaqiqiy sana kiriting",
      "any.required": "boshlangich sanani kiritish kerak",
    }),
    rent_end: Joi.date().greater(Joi.ref("rent_start")).required().messages({
      "date.base": "Xaqiqiy sana kiriting",
      "any.required": "tugash sanani kiritish kerak",
      "date.greater":
        "tugash sanasi boshlanish sanasidan kichik bolmasligi kerak",
    }),
    total_price: Joi.number().integer().min(1).required().messages({
      "number.base": "Total price must be a valid number.",
      "number.min": "Total price must be at least 1.",
      "any.required": "Total price is required.",
    }),
    notes: Joi.string().max(500).optional().messages({
      "string.base": "Notes must be a string.",
      "string.max": "Notes cannot exceed 500 characters.",
    }),
    clientId: Joi.number(),
    productId: Joi.number(),
    statusId: Joi.number(),
  });
  return schemaContract.validate(body, {
    ebortEarly: false,
  });
};
