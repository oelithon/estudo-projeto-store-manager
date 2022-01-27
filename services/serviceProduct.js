const modelProducts = require('../models/modelProducts');

const createProduct = async (name, quantity) => {
  await modelProducts.createProduct(name, quantity);
};

const getProducts = async () => {
  const products = await modelProducts.getProducts();

  return products;
};

const getProductId = async (id) => {
  const product = await modelProducts.getProductId(id);

  return product;
};

const updateProduct = async (id, name, quantity) => {
  await modelProducts.updateProduct(id, name, quantity);
};

const deleteProduct = async (id) => {
  await modelProducts.deleteProduct(id);
};

module.exports = {
  createProduct,
  getProducts,
  getProductId,
  updateProduct,
  deleteProduct,
};
