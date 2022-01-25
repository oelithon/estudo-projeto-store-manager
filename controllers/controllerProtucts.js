const serviceProduct = require('../services/serviceProduct');

const createProduct = async (req, res) => {
  const { name, quantity } = req.body;
  if (!name) {
    res.status(400).json({ message: '"name" is required' });
    return;
  }
  if (!quantity && quantity !== 0) {
    res.status(400).json({ message: '"quantity" is required' });
    return;
  }
  if (name.length < 5) {
    res.status(422).json({ message: '"name" length must be at least 5 characters long' });
    return;
  }
  if (typeof quantity !== Number || quantity < 1) {
    res.status(422).json({ message: '"quantity" must be a number larger than or equal to 1' });
    return;
  }
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
