const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Admins = sequelize.define("admin", {
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
    allowNull: false,
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
  is_creator: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  refresh_token: {
    type: DataTypes.TEXT,
  },
});

module.exports = Admins;
