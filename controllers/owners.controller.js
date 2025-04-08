const bcrypt = require("bcrypt");
const Owners = require("../models/owners.model");
const { errorHandler } = require("../helpers/error_handler");
const { ownerValidation } = require("../validations/owner.validation");
const JwtService = require("../services/jwt.service");
const config = require("config");
const mailService = require("../services/mail.service");
const uuid = require('uuid');

const jwtService = new JwtService(
  config.get("owner_access_key"),
  config.get("owner_refresh_key"),
  config.get("owner_access_time"),
  config.get("owner_refresh_time")
);

const addOwner = async (req, res) => {
  try {
    const { error, value } = ownerValidation(req.body);

    if (error) {
      return errorHandler(error, res);
    }

    const {
      user_name,
      last_name,
      email,
      password,
      phone,
      profile_photo,
      address,
      company_name,
    } = value;

    const existingUser = await Owners.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(409)
        .send({ error: "This email is already registered." });
    }

    const hash_password = bcrypt.hashSync(password, 7);
    const activation_link = uuid.v4();

    const owner = await Owners.create({
      user_name,
      last_name,
      email,
      hash_password,
      phone,
      photo: profile_photo,
      address,
      company_name,
      activation_link
    });

    await mailService.sendActivationMail(
      owner.email,
      `${config.get("api_url")}/api/client/activate/${activation_link}`
    );

    res.status(201).send({
      message: "Added new owner",
      owner,
      activation_link,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const activateOwner = async (req, res) => {
  try {
    const owner = await Owners.findOne({
      where: { activation_link: req.params.link },
    });
    if (!owner) {
      return res.status(404).send({ message: "Foydalanuvchi topilmadi" });
    }

    const payload = {
      id: owner.id,
      username: owner.user_name,
      email: owner.email,
      role: "owner"
    };

    const tokens = jwtService.generateTokens(payload);

    owner.is_active = true;
    owner.refresh_token = tokens.refreshToken;
    await owner.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_cookie_time"),
    });

    res.send({
      message: "Foydalanuvchi faollashtirildi",
      status: owner.is_active,
      accessToken: tokens.accessToken
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const loginOwner = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ message: "email va passwordni kiriting" });
    }

    const owner = await Owners.findOne({ where: { email } });

    if (!owner) {
      return res.status(400).send({ message: "email yoki password noto'g'ri" });
    }
    const validPassword = bcrypt.compareSync(password, owner.hash_password);

    if (!validPassword) {
      return res.status(400).send({ message: "email yoki password noto'g'ri" });
    }

    const payload = {
      id: owner.id,
      username: owner.user_name,
      email: owner.email,
      role: "owner"
    };

    const tokens = jwtService.generateTokens(payload);

    owner.refresh_token = tokens.refreshToken;
    await owner.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true, // faqat server orqali o'qish mumkin
      maxAge: config.get("refresh_cookie_time"), // cookie o'zini vaqti
    });

    res.send({
      message: "Tizimga xush kelibsiz",
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const logoutOwner = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res
        .status(400)
        .send({ message: "Cookie da refresh token topilmadi" });
    }

    const owner = await Owners.findOne({
      where: { refresh_token: refreshToken },
    });

    if (!owner) {
      return res
        .status(400)
        .send({ message: "Bunday tokenli foydalanuvchi topilmadi" });
    }

    owner.refresh_token = "";
    await owner.save();

    res.clearCookie("refreshToken");
    res.send({ message: "Owner logged out", owner: owner.user_name });
  } catch (error) {
    errorHandler(error, res);
  }
};

const refreshTokenOwner = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res
        .status(400)
        .send({ message: "Cookie da refresh token topilmadi" });
    }
    const owner = await Owners.findOne({
      where: { refresh_token: refreshToken },
    });
    if (!owner) {
      return res
        .status(400)
        .send({ message: "Bunday tokenli foydalanuvchi topilmadi" });
    }
    const payload = {
      id: owner.id,
      username: owner.user_name,
      email: owner.email,
      role: "owner"
    };

    const tokens = jwtService.generateTokens(payload);

    owner.refresh_token = tokens.refreshToken;
    await owner.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true, // faqat server orqali o'qish mumkin
      maxAge: config.get("refresh_cookie_time"), // cookie o'zini vaqti
    });

    res.send({
      message: "Refresh token yangilandi",
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllOwners = async (req, res) => {
  try {
    const owners = await Owners.findAll();
    res.status(200).send({ owners });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getOwnerById = async (req, res) => {
  try {
    const id = req.params.id;
    const owner = await Owners.findByPk(id);
    res.status(200).send({ owner });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateOwnerById = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      user_name,
      last_name,
      email,
      phone,
      profile_photo,
      address,
      company_name,
    } = req.body;

    const owner = await Owners.update(
      {
        user_name,
        last_name,
        email,
        phone,
        photo: profile_photo,
        address,
        company_name,
      },
      { where: { id }, returning: true }
    );
    res.status(200).send({ owner: owner[1][0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteOwnerById = async (req, res) => {
  try {
    const id = req.params.id;
    const owner = await Owners.destroy({ where: { id } });
    res.status(200).send({ owner });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addOwner,
  getAllOwners,
  getOwnerById,
  updateOwnerById,
  deleteOwnerById,
  loginOwner,
  logoutOwner,
  refreshTokenOwner,
  activateOwner
};
