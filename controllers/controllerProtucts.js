const serviceProduct = require('../services/serviceProduct');
const validation = require('../middlewares/validation');

const createProduct = async (req, res, next) => {
  const { name, quantity } = req.body;

  validation.valueRequired(req, res, next);
  validation.inputRequirements(req, res, next);

  await serviceProduct.createProduct(name, quantity);
  res.status(201).json({ id: 1, name: `${name}`, quantity: `${quantity}` });
};

const getProducts = async () => {
  const products = await serviceProduct.getProducts();
  return products;
};

module.exports = {
  createProduct,
  getProducts,
};
