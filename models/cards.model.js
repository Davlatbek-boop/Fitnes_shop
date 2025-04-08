const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Clients = require("./clients.model");

const Cards = sequelize.define("card", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  card_number: {
    type: DataTypes.BIGINT,
    unique: true,
    allowNull:false
  },
  expiration_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  cardholder_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
});

Cards.belongsTo(Clients),
Clients.hasMany(Cards) 

module.exports = Cards;
