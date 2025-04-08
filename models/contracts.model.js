const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Products = require("./products.model");
const Status = require("./status.model");
const Clients = require("./clients.model");

const Contracts = sequelize.define("contract", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  rent_start: {
    type: DataTypes.DATE,
  },
  rent_end: {
    type: DataTypes.DATE,
  },
  total_days: {
    type: DataTypes.INTEGER,
  },
  total_price: {
    type: DataTypes.BIGINT,
  },
  notes: {
    type: DataTypes.TEXT,
  },
});

Contracts.belongsTo(Products)
Products.hasMany(Contracts)

Contracts.belongsTo(Status)
Status.hasMany(Contracts)

Contracts.belongsTo(Clients)
Clients.hasMany(Contracts)

module.exports = Contracts;
