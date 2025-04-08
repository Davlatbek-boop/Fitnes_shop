const Joi = require("joi");

exports.cardValidation = (body) => {
  const schemaCard = Joi.object({
    card_number: Joi.string()
      .regex(/^\d{16}$/)
      .required(),
    expiration_date: Joi.date()
      .required(),
    cardholder_name: Joi.string()
      .regex(/^[a-zA-Z\s]*$/)
      .min(1)
      .max(50)
      .required(),
    clientId: Joi.number()
  });
  return schemaCard.validate(body, {
    ebortEarly: false,
  });
};
