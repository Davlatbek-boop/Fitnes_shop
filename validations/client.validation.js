const Joi = require("joi");

exports.clientValidation = (body) => {
  const schemaClient = Joi.object({
    user_name: Joi.string()
      .min(4)
      .message("Username 4 ta harfdan ko'p bo'lsin")
      .max(20)
      .message("Username 20 ta harfdan kam bo'lsin")
      .required()
      .messages({
        "string.empty": "So'z bo'sh bo'lishi mumkin emas",
        "any.required": "So'zni kiriting",
      })
      .pattern(/^[A-Za-z]/)
      .message("Username harf bilan boshlanishi kerak"),

    last_name: Joi.string()
      .min(4)
      .message("Lastname 4 ta harfdan ko'p bo'lsin")
      .max(20)
      .message("Lastname 20 ta harfdan kam bo'lsin")
      .required()
      .messages({
        "string.empty": "So'z bo'sh bo'lishi mumkin emas",
        "any.required": "So'zni kiriting",
      })
      .pattern(/^[A-Za-z]/)
      .message("Lastname harf bilan boshlanishi kerak"),
    email: Joi.string().email().lowercase(),
    password: Joi.string()
      .pattern(new RegExp(/^[a-zA-Z0-9!$@#]{6,30}$/))
      .message(
        "Parolda katta va kichik harflardan, raqamlardan va '!@#$' ushbu belgilardan foydalanishingiz kerak"
      ),
    phone: Joi.string()
      .pattern(new RegExp(/^\d{2}-\d{3}-\d{2}-\d{2}$/))
      .message("Telefon raqamini 11-111-11-11 kabi formatda kiritin"),
    profile_photo: Joi.string().default("/images/img.png"),
    gender: Joi.string().valid("male", "female").required(),
    birth_date: Joi.date().less("now").required(),
    address: Joi.string().min(5).max(255).required(),
    passport: Joi.string()
      .regex(/^[A-Z]{2}[0-9]{7}$/)
      .message("AA1234567 formatida bo'lsin") 
      .required(),
  });
  return schemaClient.validate(body, {
    ebortEarly: false,
  });
};
