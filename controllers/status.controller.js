const Status = require("../models/status.model");
const { errorHandler } = require("../helpers/error_handler");
const { statusValidation } = require("../validations/status.validation");

const addStatus = async (req, res) => {
  try {
    const { error, value } = statusValidation(req.body);

    if (error) {
      return errorHandler(error, res);
    }

    const { name, description } = value;

    const newStatus = await Status.create({
      name,
      description,
    });
    res.status(201).send({ message: "Added new Status", newStatus });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllStatus = async (req, res) => {
  try {
    const status = await Status.findAll();
    res.status(200).send({ status });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getStatusById = async (req, res) => {
  try {
    const id = req.params.id;
    const status = await Status.findByPk(id);
    res.status(200).send({ status });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateStatusById = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, description } = req.body;

    const status = await Status.update(
      { name, description },
      { where: { id }, returning: true }
    );
    res.status(200).send({ status: status[1][0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteStatusById = async (req, res) => {
  try {
    const id = req.params.id;
    const status = await Status.destroy({ where: { id } });
    res.status(200).send({ status });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addStatus,
  getAllStatus,
  getStatusById,
  updateStatusById,
  deleteStatusById,
};
