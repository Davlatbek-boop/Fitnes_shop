const Category = require("../models/categories.model");
const { errorHandler } = require("../helpers/error_handler");
const { categoryValidation } = require("../validations/categories.validation");

const addCategory = async (req, res) => {
  try {
    const { error, value } = categoryValidation(req.body);

    if (error) {
      return errorHandler(error, res);
    }
    const { name, description, image_url } = value;

    const newCategory = await Category.create({
      name,
      description,
      image_url,
    });
    res.status(201).send({ message: "Added new Category", newCategory });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllCategory = async (req, res) => {
  try {
    const category = await Category.findAll();
    res.status(200).send({ category });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getCategoryById = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await Category.findByPk(id);
    res.status(200).send({ category });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateCategoryById = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, description, image_url } = req.body;

    const category = await Category.update(
      { name, description, image_url },
      { where: { id }, returning: true }
    );
    res.status(200).send({ category: category[1][0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteCategoryById = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await Category.destroy({ where: { id } });
    res.status(200).send({ category });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addCategory,
  getAllCategory,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
