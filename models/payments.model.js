const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Contracts = require("./contracts.model");

const Payments = sequelize.define("payment", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  amount: {
    type: DataTypes.BIGINT,
  }, 
  payment_method: {
    type: DataTypes.STRING,
  },
  is_paid:{
    type: DataTypes.BOOLEAN,
  },
  paid_at:{
    type: DataTypes.DATE
  },
  transaction_code:{
    type: DataTypes.BIGINT
  }
});

Payments.belongsTo(Contracts)
Contracts.hasMany(Payments)

module.exports = Payments;
