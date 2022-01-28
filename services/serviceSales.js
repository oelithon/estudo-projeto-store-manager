const modelSales = require('../models/modelSales');

const createSales = async () => {
  const salesId = await modelSales.createSales();
  return salesId;
};

const createSalesProducts = async (id, productId, quantity) => {
  const sales = await modelSales.createSalesProducts(id, productId, quantity);
  return sales;
};

module.exports = {
  createSales,
  createSalesProducts,
};
