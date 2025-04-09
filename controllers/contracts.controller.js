const Contract = require("../models/contracts.model");
const { errorHandler } = require("../helpers/error_handler");
const { contractValidation } = require("../validations/contracts.validation");
const { where } = require("sequelize");

const addContract = async (req, res) => {
  try {
    const { error, value } = contractValidation(req.body);

    if (error) {
      return errorHandler(error, res);
    }
    const {
      rent_start,
      rent_end,
      total_price,
      notes,
      clientId,
      productId,
      statusId,
      ownerId
    } = value;

    const total_days = Math.ceil(
      (rent_end - rent_start) / (1000 * 60 * 60 * 24)
    );
    console.log(total_days);
    const newContract = await Contract.create({
      rent_start,
      rent_end,
      total_days: total_days,
      total_price,
      notes,
      clientId,
      productId,
      statusId,
      ownerId
    });
    res.status(201).send({ message: "Added new ", newContract });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllContract = async (req, res) => {
  try {
    const contract = await Contract.findAll();
    res.status(200).send({ contract });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getContractById = async (req, res) => {
  try {
    const id = req.params.id;
    const contract = await Contract.findByPk(id);
    res.status(200).send({ contract });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateContractById = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      rent_start,
      rent_end,
      total_days,
      total_price,
      notes,
      clientId,
      productId,
      statusId,
    } = req.body;

    const contract = await Contract.update(
      {
        rent_start,
        rent_end,
        total_days,
        total_price,
        notes,
        clientId,
        productId,
        statusId,
      },
      { where: { id }, returning: true }
    );
    res.status(200).send({ contract: contract[1][0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteContractById = async (req, res) => {
  try {
    const id = req.params.id;
    const contract = await Contract.destroy({ where: { id } });
    res.status(200).send({ contract });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllCardByClientId = async (req, res) => {
  try {
    const id = req.params.id
    const contracts = await Contract.findAll({where: {clientId: id}});
    res.status(200).send({ contracts });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getContractByClientId = async (req, res) => {
  try {
    const clientId = req.params.id;
    const contract = await Contract.findAll({where:{clientId}});
    res.status(200).send({ contract });
  } catch (error) { 
    errorHandler(error, res);
  }
};

const getContractByClientIdAndContractId = async (req, res) => {
  try {
    const clientId = req.params.id;
    const contractId = req.params.contractId
    console.log(contractId);
    const contract = await Contract.findOne({where:{clientId, id:contractId}});
    res.status(200).send({ contract });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getContractByOwnerIdAndContractId = async (req, res) => {
  try {
    const ownerId = req.params.id;
    const contractId = req.params.contractId
    const contract = await Contract.findOne({where:{ownerId, id:contractId}});
    res.status(200).send({ contract });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getContractByOwnerId = async (req, res) => {
  try {
    const ownerId = req.params.id;
    const contract = await Contract.findAll({where:{ownerId}});
    res.status(200).send({ contract });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addContract,
  getAllContract,
  getContractById,
  updateContractById,
  deleteContractById,
  getAllCardByClientId,
  getContractByClientId,
  getContractByOwnerId,
  getContractByClientIdAndContractId,
  getContractByOwnerIdAndContractId
};
