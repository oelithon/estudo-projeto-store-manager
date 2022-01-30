const modelSales = require('../models/modelSales');

const createSales = async () => {
  const salesId = await modelSales.createSales();
  return salesId;
};

const createSalesProducts = async (id, productId, quantity) => {
  const sales = await modelSales.createSalesProducts(id, productId, quantity);
  return sales;
};

const getSalesList = async () => {
  const salesList = await modelSales.getSalesList();
  return salesList;
};

const getSaleId = async (id) => {
  const onlySale = await modelSales.getSaleId(id);
  return onlySale;
};

const updateSale = async (id, productId, quantity) => {
  const sale = await modelSales.updateSale(id, productId, quantity);

  return sale;
};

const deleteSale = async (id) => {
  await modelSales.deleteSale(id);
};

module.exports = {
  createSales,
  createSalesProducts,
  getSalesList,
  getSaleId,
  updateSale,
  deleteSale,
};
