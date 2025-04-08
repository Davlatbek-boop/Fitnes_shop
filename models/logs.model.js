const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Logs = sequelize.define("log", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  lavel: {
    type: DataTypes.STRING(50),
  },
  message: {
    type: DataTypes.TEXT,
  },
  timestamp: {
    type: DataTypes.DATE,
  },
});

module.exports = Logs;
