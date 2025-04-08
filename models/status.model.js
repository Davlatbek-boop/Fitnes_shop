const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Status = sequelize.define("status", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name:{
    type: DataTypes.ENUM("pending", "approved", "rejected", "damaged"),
    defaultValue: "pending",
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
});

module.exports = Status;
 