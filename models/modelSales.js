const connection = require('./connection');

const createSaleProducts = async (product) => {
  await connection.execute(
    `
    INSERT INTO StoreManager.products (name, quantity)
    `
  );
};

module.exports = {
  createSaleProducts,
};
