const connection = require('./connection');

const createProduct = async (name, quantity) => {
  await connection.execute(
    `
  INSERT INTO products (name, quantity)
  VALUE
    (?, ?)
  `, [name, quantity],
  );
};

module.exports = {
  createProduct,
};
