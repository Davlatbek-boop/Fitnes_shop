const Payment = require("../models/payments.model");
const { errorHandler } = require("../helpers/error_handler");
const { paymentValidation } = require("../validations/payments.validation");

const addPayment = async (req, res) => {
  try {
    const { error, value } = paymentValidation(req.body)
    if(error){
      return errorHandler(error, res)
    }
    const {
      amount,
      payment_method,
      is_paid,
      paid_at,
      transaction_code,
      contractId,
    } = value;

    const newPayment = await Payment.create({
      amount,
      payment_method,
      is_paid,
      paid_at,
      transaction_code,
      contractId,
    });
    res.status(201).send({ message: "Added new Payment", newPayment });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllPayment = async (req, res) => {
  try {
    const payment = await Payment.findAll();
    res.status(200).send({ payment });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getPaymentById = async (req, res) => {
  try {
    const id = req.params.id;
    const payment = await Payment.findByPk(id);
    res.status(200).send({ payment });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updatePaymentById = async (req, res) => {
  try {
    const id = req.params.id;
    const { amount, payment_method, is_paid, paid_at, transaction_code } =
      req.body;

    const payment = await Payment.update(
      { amount, payment_method, is_paid, paid_at, transaction_code },
      { where: { id }, returning: true }
    );
    res.status(200).send({ payment: payment[1][0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deletePaymentById = async (req, res) => {
  try {
    const id = req.params.id;
    const payment = await Payment.destroy({ where: { id } });
    res.status(200).send({ payment });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addPayment,
  getAllPayment,
  getPaymentById,
  updatePaymentById,
  deletePaymentById,
};
