/* eslint-disable semi */
const { NotFound } = require('http-errors');
const { Transaction } = require('../../models');
const { Category } = require('../../models');
const { sendSuccessResponse } = require('../../utils');

const addIncomTransaction = async (req, res) => {
  const { categoryId } = req.params;
  const { day, month, year } = req.query;
  const { description, value } = req.body;

  // получаем категорию из БД
  const category = await Category.findById({ _id: categoryId });

  // если мы не получили категорию
  if (!category) {
    throw new NotFound('Category not found');
  }

  // получаем тип транзакции
  const { name, typeOfOperation, icon } = category;
  const typeTransaction = typeOfOperation === false ? 'Expenses' : 'Incomes';

  const newTransaction = {
    // ...req.body,
    date: {
      day,
      month,
      year,
    },
    description:
      description.toLowerCase().charAt(0).toUpperCase() + description.slice(1),
    value,
    owner: req.user._id,
    category: name,
    expenses: typeOfOperation,
    typeTransaction,
    icon,
  };

  const result = await Transaction.create(newTransaction);
  sendSuccessResponse(res, { result }, 201);
};

module.exports = addIncomTransaction;
