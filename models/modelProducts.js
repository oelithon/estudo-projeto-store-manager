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
  try {
    const products = await connection.execute('SELECT * FROM StoreManager.products');
    console.log(products);
    return products;
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  createProduct,
  getProducts,
};
