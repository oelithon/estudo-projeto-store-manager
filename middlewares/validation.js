const serviceProduct = require('../services/serviceProduct');

const valueRequired = (req, res, next) => {
  const { name, quantity } = req.body;

  if (!name) {
    res.status(400).json({ message: '"name" is required' });
    return;
  }
  if (!quantity && quantity !== 0) {
    res.status(400).json({ message: '"quantity" is required' });
    return;
  }
  next();
};

const inputRequirements = (req, res, next) => {
  const { name, quantity } = req.body;

  if (name.length < 5) {
    res.status(422).json({ message: '"name" length must be at least 5 characters long' });
    return;
  }

  if (typeof quantity !== 'number' || quantity < 1) {
    res.status(422).json({ message: '"quantity" must be a number larger than or equal to 1' });
    return;
  }
  next();
};

const equalValue = async (req, res, next) => {
  const { name } = req.body;
  const products = await serviceProduct.getProducts();
  const validation = products.some((product) => product.name === name);

  if (validation) {
    res.status(409).json({ message: 'Product already exists' });
    return;
  }
  next();
};

const notFoundProduct = async (req, res, next) => {
  const { id } = req.params;
  const product = await serviceProduct.getProductId(id);

  if (product.length < 1) {
    res.status(404).json({ message: 'Product not found' });
    return;
  }
  next();
};

module.exports = {
  valueRequired,
  inputRequirements,
  equalValue,
  notFoundProduct,
};
