const bcrypt = require("bcrypt");
const Admins = require("../models/admins.model");
const { errorHandler } = require("../helpers/error_handler");
const { adminValidation } = require("../validations/admin.validation");
const JwtService = require("../services/jwt.service");
const config = require("config");


const jwtService = new JwtService(
  config.get("admin_access_key"),
  config.get("admin_refresh_key"),
  config.get("admin_access_time"),
  config.get("admin_refresh_time")
);

const addAdmin = async (req, res) => {
  try {
    const { error, value } = adminValidation(req.body);

    if (error) {
      return errorHandler(error, res);
    }

    const { user_name, last_name, email, password, phone, profile_photo } =
      value;

    const existingUser = await Admins.findOne({ where: { email } });

    if (existingUser) {
      return res
        .status(409)
        .send({ error: "This email is already registered." });
    }

    const hash_password = bcrypt.hashSync(password, 7);

    const newAdmin = await Admins.create({
      user_name,
      last_name,
      email,
      hash_password,
      phone,
      photo: profile_photo,
    });
 
    // const payload = {
    //   id: newAdmin.id,
    //   username: newAdmin.user_name,
    //   email: newAdmin.email,
    //   is_creator: newAdmin.is_creator,
    //   role: "Admin",
    // };

    // const tokens = jwtService.generateTokens(payload);

    // newAdmin.refresh_token = tokens.refreshToken;
    // await newAdmin.save();

    // res.cookie("refreshToken", tokens.refreshToken, {
    //   httpOnly: true,
    //   maxAge: config.get("refresh_cookie_time"),
    // });

    res.status(201).send({
      message: "Admin added",
      newAdmin,
      // accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admins.findOne({ where: { email } });

    if (!admin) {
      return res.status(400).send({ message: "email yoki password noto'g'ri" });
    }
    const validPassword = bcrypt.compareSync(password, admin.hash_password);

    if (!validPassword) {
      return res.status(400).send({ message: "email yoki password noto'g'ri" });
    }

    const payload = {
      id: admin.id,
      username: admin.user_name,
      email: admin.email,
      is_creator: admin.is_creator,
      role: "Admin",
    };


    const tokens = jwtService.generateTokens(payload);

    admin.refresh_token = tokens.refreshToken;
    await admin.save();

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

const logoutAdmin = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res
        .status(400)
        .send({ message: "Cookie da refresh token topilmadi" });
    }

    const admin = await Admins.findOne({
      where: { refresh_token: refreshToken },
    });

    if (!admin) {
      return res
        .status(400)
        .send({ message: "Bunday tokenli foydalanuvchi topilmadi" });
    }

    admin.refresh_token = "";
    await admin.save();

    res.clearCookie("refreshToken");
    res.send({ message: "Admin logged out", admin: admin.user_name });
  } catch (error) {
    errorHandler(error, res);
  }
};

const refreshTokenAdmin = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res
        .status(400)
        .send({ message: "Cookie da refresh token topilmadi" });
    }
    const admin = await Admins.findOne({
      where: { refresh_token: refreshToken },
    });
    if (!admin) {
      return res
        .status(400)
        .send({ message: "Bunday tokenli foydalanuvchi topilmadi" });
    }
    const payload = {
      id: admin.id,
      username: admin.user_name,
      email: admin.email,
      is_creator: admin.is_creator,
      role: "Admin",
    };


    const tokens = jwtService.generateTokens(payload);

    admin.refresh_token = tokens.refreshToken;
    await admin.save();

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

const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admins.findAll({ where: { is_creator: false } });
    res.status(200).send({ admins });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAdminById = async (req, res) => {
  try {
    const id = req.params.id;
    const admin = await Admins.findOne({ where: { id, is_creator: false } });
    res.status(200).send({ admin });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateAdminById = async (req, res) => {
  try {
    const id = req.params.id;
    const { user_name, last_name, email, phone, profile_photo } = req.body;

    const admin = await Admins.update(
      { user_name, last_name, email, phone, photo: profile_photo },
      { where: { id }, returning: true }
    );
    res.status(200).send({ admin: admin[1][0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteAdminById = async (req, res) => {
  try {
    const id = req.params.id;
    const admin = await Admins.destroy({ where: { id } });
    res.status(200).send({ admin });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updatePasswordAdminById = async (req, res) =>{
  try {
    const id = req.params.id
    
    const { password, new_password, confirm_password } = req.body
    const admin = await Admins.findOne({where:{id}})

    const comparePassword = bcrypt.compareSync(password, admin.hash_password);
    if (!comparePassword) {
      return res.status(400).send({ message: "password noto'g'ri" });
    }
    console.log(1);
    if (!/^[a-zA-Z0-9!$@#]{6,30}$/.test(new_password)) {
      return res.status(400).send({
        message: "Parol 6–30 belgidan iborat bo‘lishi va faqat harflar, raqamlar hamda '!$@#' belgilaridan tashkil topgan bo‘lishi kerak",
      });
    }
    
    console.log(2);
    if (new_password != confirm_password){
      return res.status(400).send({ message: "ikala parollar bir xil bo'lsin" });
    }
    console.log(3);
    const hashPassword = bcrypt.hashSync(new_password, 7)
    console.log(4);
    admin.hash_password = hashPassword
    await admin.save()
    console.log(5);
    return res.status(200).send({ message: "parol yangilandi" });
  } catch (error) {
    errorHandler(error, res)
  }
}

module.exports = {
  addAdmin,
  getAllAdmins,
  getAdminById,
  updateAdminById,
  deleteAdminById,
  loginAdmin,
  logoutAdmin,
  refreshTokenAdmin,
  updatePasswordAdminById 
};
