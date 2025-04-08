const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Owners = require("./owners.model");
const Categories = require("./categories.model");

const Products = sequelize.define("product", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name:{
    type: DataTypes.STRING(100)
  },
  description: {
    type: DataTypes.TEXT,
  },
  price_per_day: {
    type: DataTypes.BIGINT,
  },
  quantity: {
    type: DataTypes.SMALLINT,
  },
  condition: {
    type: DataTypes.ENUM("new", "old")
  },
  image_url: {
    type: DataTypes.TEXT,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
});

Products.belongsTo(Owners)
Owners.hasMany(Products)

Products.belongsTo(Categories)
Categories.hasMany(Products)

module.exports = Products;
