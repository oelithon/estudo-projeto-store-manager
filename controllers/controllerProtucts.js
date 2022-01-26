const serviceProduct = require('../services/serviceProduct');

const createProduct = async (req, res) => {
  const { name, quantity } = req.body;

  await serviceProduct.createProduct(name, quantity);
  res.status(201).json({ message: 'produto cadastrado' });
};

const getProducts = async () => {
  const products = await serviceProduct.getProducts();
  return products;
};

module.exports = {
  createProduct,
  getProducts,
};
