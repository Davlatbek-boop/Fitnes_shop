const Product = require("../models/products.model");
const { errorHandler } = require("../helpers/error_handler");
const { productValidation } = require("../validations/products.validation");

const addProduct = async (req, res) => {
  try {
    const {error, value} = productValidation(req.body)

    if(error){
      return errorHandler(error, res)
    }

    const { name, description, price_per_day, quantity, condition, image_url } =
      value;

    const newProduct = await Product.create({
      name,
      description,
      price_per_day,
      quantity,
      condition,
      image_url,
    });
    res.status(201).send({ message: "Added new Product", newProduct });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllProduct = async (req, res) => {
  try {
    const product = await Product.findAll();
    res.status(200).send({ product });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findByPk(id);
    res.status(200).send({ product });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, description, price_per_day, quantity, condition, image_url } =
      req.body;

    const product = await Product.update(
      { name, description, price_per_day, quantity, condition, image_url },
      { where: { id }, returning: true }
    );
    res.status(200).send({ product: product[1][0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.destroy({ where: { id } });
    res.status(200).send({ product });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllCardByOwnerId = async (req, res) => {
  try {
    const id = req.params.id
    const products = await Product.findAll({where: {ownerId: id}});
    res.status(200).send({ products });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addProduct,
  getAllProduct,
  getProductById,
  updateProductById,
  deleteProductById,
  getAllCardByOwnerId
};
