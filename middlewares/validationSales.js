const serviceSales = require('../services/serviceSales');

const validateInput = (req, res, next) => {
  const salesProduct = req.body;
  const productId = salesProduct.filter((id) => id.product_id === undefined);
  const quantity = salesProduct.filter((id) => id.quantity === undefined);
  const quantityNumber = salesProduct
    .filter((id) => typeof id.quantity !== 'number' || id.quantity < 1);

  if (productId.length > 0) {
    res.status(400).json({ message: '"product_id" is required' });
    return;
  }
  if (quantity.length > 0) {
    res.status(400).json({ message: '"quantity" is required' });
    return;
  }
  if (quantityNumber.length > 0) {
    res.status(422).json({ message: '"quantity" must be a number larger than or equal to 1' });
    return;
  }
  next();
};

const notFoundSales = async (req, res, next) => {
  const { id } = req.params;
  const sale = await serviceSales.getSaleId(id);

  if (sale.length < 1) {
    res.status(404).json({ message: 'Sale not found' });
    return;
  }
  next();
};

module.exports = {
  validateInput,
  notFoundSales,
};