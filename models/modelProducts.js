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

const getProductId = async (id) => {
  const [product] = await connection.execute(
    `
    SELECT * FROM StoreManager.products
    WHERE id = ?
    `, [id],
  );
  return product;
};

module.exports = {
  createProduct,
  getProducts,
  getProductId,
};
