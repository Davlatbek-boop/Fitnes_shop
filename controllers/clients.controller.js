const bcrypt = require("bcrypt");
const Clients = require("../models/clients.model");
const { errorHandler } = require("../helpers/error_handler");
const { clientValidation } = require("../validations/client.validation");
const JwtService = require("../services/jwt.service");
const config = require("config");
const uuid = require("uuid");
const mailService = require("../services/mail.service");

const jwtService = new JwtService(
  config.get("client_access_key"),
  config.get("client_refresh_key"),
  config.get("client_access_time"),
  config.get("client_refresh_time")
);

const addClient = async (req, res) => {
  try {
    const { error, value } = clientValidation(req.body);
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
      gender,
      birth_date,
      address,
      passport,
    } = value;

    const existingUser = await Clients.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(409)
        .send({ error: "This email is already registered." });
    }

    const hash_password = bcrypt.hashSync(password, 7);
    const activation_link = uuid.v4();

    const newClient = await Clients.create({
      user_name,
      last_name,
      email,
      hash_password,
      phone,
      photo: profile_photo,
      gender,
      birth_date,
      address,
      passport,
      activation_link,
    });

    await mailService.sendActivationMail(
      newClient.email,
      `${config.get("api_url")}/api/client/activate/${activation_link}`
    );

    res.status(201).send({
      message: "Client added",
      newClient,
      activation_link,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const activateClient = async (req, res) => {
  try {
    const client = await Clients.findOne({
      where: { activation_link: req.params.link },
    });
    if (!client) {
      return res.status(404).send({ message: "Foydalanuvchi topilmadi" });
    }

    const payload = {
      id: client.id,
      username: client.user_name,
      email: client.email,
      passport: client.passport,
      role: "client"
    };

    const tokens = jwtService.generateTokens(payload);

    client.is_active = true;
    client.refresh_token = tokens.refreshToken;
    await client.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_cookie_time"),
    });

    res.send({
      message: "Foydalanuvchi faollashtirildi",
      status: client.is_active,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const loginClient = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const client = await Clients.findOne({ where: { email } });

    if (!client) {
      return res.status(400).send({ message: "email yoki password noto'g'ri" });
    }
    const validPassword = bcrypt.compareSync(password, client.hash_password);

    if (!validPassword) {
      return res.status(400).send({ message: "email yoki password noto'g'ri" });
    }

    const payload = {
      id: client.id,
      username: client.user_name,
      email: client.email,
      passport: client.passport,
      role: "client"
    };

    const tokens = jwtService.generateTokens(payload);

    client.refresh_token = tokens.refreshToken;
    await client.save();

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

const logoutClient = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res
        .status(400)
        .send({ message: "Cookie da refresh token topilmadi" });
    }

    const client = await Clients.findOne({
      where: { refresh_token: refreshToken },
    });

    if (!client) {
      return res
        .status(400)
        .send({ message: "Bunday tokenli foydalanuvchi topilmadi" });
    }

    client.refresh_token = "";
    await client.save();

    res.clearCookie("refreshToken");
    res.send({ message: "Client logged out", client: client.user_name });
  } catch (error) {
    errorHandler(error, res);
  }
};

const refreshTokenClient = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res
        .status(400)
        .send({ message: "Cookie da refresh token topilmadi" });
    }
    const client = await Clients.findOne({
      where: { refresh_token: refreshToken },
    });
    if (!client) {
      return res
        .status(400)
        .send({ message: "Bunday tokenli foydalanuvchi topilmadi" });
    }
    const payload = {
      id: client.id,
      username: client.user_name,
      email: client.email,
      passport: client.passport,
      role: "client"
    };

    const tokens = jwtService.generateTokens(payload);

    client.refresh_token = tokens.refreshToken;
    await client.save();

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

const getAllClients = async (req, res) => {
  try {
    const clients = await Clients.findAll();
    res.status(200).send({ clients });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getClientById = async (req, res) => {
  try {
    const id = req.params.id;
    const client = await Clients.findByPk(id);
    res.status(200).send({ client });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateClientById = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      user_name,
      last_name,
      email,
      phone,
      profile_photo,
      gender,
      birth_date,
      address,
      passport,
    } = req.body;

    const client = await Clients.update(
      {
        user_name,
        last_name,
        email,
        phone,
        photo: profile_photo,
        gender,
        birth_date,
        address,
        passport,
      },
      { where: { id }, returning: true }
    );
    res.status(200).send({ client: client[1][0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteClientById = async (req, res) => {
  try {
    const id = req.params.id;
    const client = await Clients.destroy({ where: { id } });
    res.status(200).send({ client });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addClient,
  getAllClients,
  getClientById,
  updateClientById,
  deleteClientById,
  loginClient,
  logoutClient,
  refreshTokenClient,
  activateClient,
};
