const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Clients = sequelize.define("client", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_name: {
    type: DataTypes.STRING(30),
  },
  last_name: {
    type: DataTypes.STRING(30),
  },
  email: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  },
  hash_password: {
    type: DataTypes.STRING,
  },
  phone: {
    type: DataTypes.STRING(15),
  },
  photo: {
    type: DataTypes.TEXT,
  },
  gender: {
    type: DataTypes.ENUM,
    values: ["male", "female"],
    allowNull: false
  },
  birth_date: {
    type: DataTypes.DATE,
  },
  address:{
    type: DataTypes.TEXT
  },
  passport: {
    type: DataTypes.STRING(10),
    unique:true,
    allowNull: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  activation_link:{
    type: DataTypes.STRING
  },
  refresh_token: {
    type: DataTypes.TEXT,
  },
});

module.exports = Clients;
