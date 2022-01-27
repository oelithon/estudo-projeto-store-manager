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

const updateProduct = async (id, name, quantity) => {
  await connection.execute(
    `
    UPDATE StoreManager.products
    SET name = ?, quantity = ?
    WHERE id = ?
    `, [name, quantity, id],
  );
};

const deleteProduct = async (id) => {
  await connection.execute(
    `
    DELETE FROM StoreManager.products
    WHERE id = ?
    `, [id],
  );
};

module.exports = {
  createProduct,
  getProducts,
  getProductId,
  updateProduct,
  deleteProduct,
};
