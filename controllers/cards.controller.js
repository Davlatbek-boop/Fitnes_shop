const Cards = require("../models/cards.model");
const { errorHandler } = require("../helpers/error_handler");
const { cardValidation } = require("../validations/cards.validation");

const addCard = async (req, res) => {
  try {
    const { error, value } = cardValidation(req.body);

    if (error) {
      return errorHandler(error, res);
    }

    const { card_number, expiration_date, cardholder_name, clientId } =
      value
    const newCard = await Cards.create({
      card_number,
      expiration_date,
      cardholder_name,
      clientId,
    });
    res.status(201).send({ message: "Added new Card", newCard });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllCards = async (req, res) => {
  try {
    const cards = await Cards.findAll();
    res.status(200).send({ cards });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getCardById = async (req, res) => {
  try {
    const id = req.params.id;
    const card = await Cards.findByPk(id);
    res.status(200).send({ card });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateCardById = async (req, res) => {
  try {
    const id = req.params.id;
    const { card_number, expiration_date, cardholder_name, clientId } =
      req.body;

    const card = await Cards.update(
      { card_number, expiration_date, cardholder_name, clientId },
      { where: { id }, returning: true }
    );
    res.status(200).send({ card: card[1][0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteCardById = async (req, res) => {
  try {
    const id = req.params.id;
    const card = await Cards.destroy({ where: { id } });
    res.status(200).send({ card });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllCardByClientId = async (req, res) => {
  try {
    const id = req.params.id
    const cards = await Cards.findAll({where: {clientId: id}});
    res.status(200).send({ cards });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addCard,
  getAllCards,
  getCardById,
  updateCardById,
  deleteCardById,
  getAllCardByClientId
};
