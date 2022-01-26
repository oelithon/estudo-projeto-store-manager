const serviceProduct = require('../services/serviceProduct');
const allProducts = require('../services/serviceProduct');

const searchProduct = async (name) => {
  const products = await allProducts.getProducts();
  const productName = products.find((product) => product.name === name);

  return productName;
};

const createProduct = async (req, res) => {
  const { name, quantity } = req.body;

  await serviceProduct.createProduct(name, quantity);
  res.status(201).json(await searchProduct(name));
};

const getProducts = async () => {
  const products = await serviceProduct.getProducts();
  return products;
};

module.exports = {
  createProduct,
  getProducts,
};
