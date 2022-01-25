const modelProducts = require('../models/modelProducts');

const createProduct = async (name, quantity) => {
  await modelProducts.createProduct(name, quantity);
};

const getProducts = async () => {
  const products = await modelProducts.getProducts();

  return products;
};

module.exports = {
  createProduct,
  getProducts,
};
