const Joi = require("joi");

exports.paymentValidation = (body) => {
  const schemaPayment = Joi.object({
    amount: Joi.number().positive().required().messages({
      "number.base": `"amount" son bo'lishi kerak`,
      "number.positive": `"amount" musbat bo'lishi kerak`,
      "any.required": `"amount" maydoni majburiy`,
    }),
    payment_method: Joi.string()
      .valid("UZKARD", "HUMO", "PAYPAL", "VISA", "PAYME", "Click")
      .required()
      .messages({
        "any.only": `"payment_method" to'g'ri tanlang`,
        "any.required": `"payment_method" maydoni majburiy`,
      }),
    is_paid: Joi.boolean(),
    paid_at: Joi.date().max("now").required().messages({
      "date.base": `"paid_at" haqiqiy sana bo'lishi kerak`,
      "date.max": `"paid_at" hozirgi sanadan oldingi sana bo'lishi kerak`,
      "any.required": `"paid_at" maydoni majburiy`,
    }),
    transaction_code: Joi.string(),
    contractId: Joi.number(),
  });
  return schemaPayment.validate(body, {
    ebortEarly: false,
  });
};
