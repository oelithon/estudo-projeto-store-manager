const connection = require('./connection');

const createProduct = async (name, quantity) => {
  await connection.execute(
    `
  INSERT INTO StoreManager.products (name, quantity)
  VALUE
    (?, ?)
  `, [name, quantity],
  );
};

const getProducts = async () => {
  const [products] = await connection.execute('SELECT * FROM StoreManager.products');

  return products;
};

module.exports = {
  createProduct,
  getProducts,
};
