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

const getSalesList = async (req, res) => {
  const salesList = await serviceSales.getSalesList();
  return res.status(200).json(salesList);
};

const getSaleId = async (req, res) => {
  const { id } = req.params;

  const onlySale = await serviceSales.getSaleId(id);
  return res.status(200).json(onlySale);
};

const updateSale = async (req, res) => {
  const { id } = req.params;
  const saleArray = req.body;
  const { product_id, quantity } = saleArray[0];

  await serviceSales.updateSale(Number(id), product_id, quantity);

  const resultSale = {
    saleId: id,
    itemUpdated: saleArray,
  };

  return res.status(200).json(resultSale);
};

module.exports = {
  createSalesProducts,
  getSalesList,
  getSaleId,
  updateSale,
};
