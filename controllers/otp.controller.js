const { errorHandler } = require("../helpers/error_handler");
const otpGenerator = require("otp-generator");
const config = require("config");
const { encode, decode } = require("../helpers/crypt");
const mailService = require("../services/mail.service");
const smsService = require("../services/sms.service");
const client = require("../config/redis");
const { formatPhoneNumber } = require("../helpers/phone_number");

const createOtp = async (req, res) => {
  try {
    const { phone, email } = req.body;

    const otp = otpGenerator.generate(4, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const now = new Date();
    const expirationTime = config.get("expiration_minute") * 60;
    await client.setEx(email, expirationTime, otp);

    const details = {
      timestamp: now,
      phone,
    };
    const encodedData = await encode(JSON.stringify(details));

    const phone_number = formatPhoneNumber(phone);
    //send otp to SMS, email, bot, ...
    // const response = await smsService.sendSms(phone_number, otp);
    // if (response.status != 200) {
    //   return res.status(503).send({ message: "OTP yuborishda xatolik" });
    // }
    const message = `Code has been send to user ${phone_number.slice(
      phone_number.length - 4
    )}`;
    //send otp to SMS, email, bot, ...
    await mailService.sendActivationMail(email, otp);
    res.status(201).send({
      message,
      verification_key: encodedData,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { verification_key, phone_number, otp, email } = req.body;

    const decodedData = await decode(verification_key);
    const details = JSON.parse(decodedData);

    if (details.phone_number != phone_number) {
      const response = {
        Status: "Failure",
        Message: "OTP bu raqamga yuborilmagan",
      };
      return res.status(400).send(response);
    }

    const storedOtp = await client.get(email);

    if (!storedOtp) {
      const response = {
        Status: "Failure",
        Message: "OTP topilmadi yoki muddati tugagan",
      };
      return res.status(400).send(response);
    }

    if (storedOtp === otp) {
      // OTP to‘g‘ri bo‘lsa, Redisdan o‘chiramiz:
      await client.del(email);

      const response = {
        Status: "Success",
      };
      return res.status(200).send(response);
    }

    const response = {
      Status: "Failure",
      Message: "OTP mos emas",
    };
    return res.status(400).send(response);
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  createOtp,
  verifyOtp,
};
