const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Categories = sequelize.define("category", {
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
  image_url: {
    type: DataTypes.TEXT,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
});

module.exports = Categories;
