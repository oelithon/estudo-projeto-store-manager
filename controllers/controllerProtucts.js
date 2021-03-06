const serviceProduct = require('../services/serviceProduct');

const searchProduct = async (name) => {
  const products = await serviceProduct.getProducts();
  const productName = products.find((product) => product.name === name);

  return productName;
};

const createProduct = async (req, res) => {
  const { name, quantity } = req.body;

  await serviceProduct.createProduct(name, quantity);
  res.status(201).json(await searchProduct(name));
};

const getProducts = async (req, res) => {
  const products = await serviceProduct.getProducts();
  res.status(200).json(products);
};

const getProductId = async (req, res) => {
  const { id } = req.params;
  const product = await serviceProduct.getProductId(id);
  return res.status(200).json(product[0]);
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, quantity } = req.body;
  await serviceProduct.updateProduct(id, name, quantity);
  const product = await serviceProduct.getProductId(id);
  res.status(200).json(product[0]);
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const product = await serviceProduct.getProductId(id);
  await serviceProduct.deleteProduct(id);
  res.status(200).json(product[0]);
};

module.exports = {
  createProduct,
  getProducts,
  getProductId,
  updateProduct,
  deleteProduct,
};
