const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Owners = sequelize.define("owner", {
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
  photo:{
    type: DataTypes.STRING
  },
  address: {
    type: DataTypes.TEXT,
  },
  company_name: {
    type: DataTypes.STRING(50),
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  activation_link:{
    type: DataTypes.STRING
  },
  refresh_token: {
    type: DataTypes.TEXT,
  },
});

module.exports = Owners;
