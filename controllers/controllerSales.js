const serviceSales = require('../services/serviceSales');

const createSalesProducts = async (req, res) => {
  const salesProduct = req.body;
  const id = await serviceSales.createSales();

  const salesPromise = salesProduct.map(async (sale) => {
    const { product_id, quantity } = sale;
    const sales = await serviceSales.createSalesProducts(id, product_id, quantity);
    return sales;
  });

  await Promise.all(salesPromise);

  res.status(201).json(
    {
      id,
      itemsSold: salesProduct,
    },
  );
};

module.exports = {
  createSalesProducts,
};
