const connection = require('./connection');

const createSales = async () => {
  const [salesId] = await connection.execute(
    `
    INSERT INTO StoreManager.sales ()
    VALUE
      ()
    `,
  );
  return salesId.insertId;
};

const createSalesProducts = async (id, productId, quantity) => {
  const [sales] = await connection.execute(
    `
    INSERT INTO StoreManager.sales_products (sale_id, product_id, quantity)
    VALUES
      (?, ?, ?)
    `, [id, productId, quantity],
  );
  return sales;
};

module.exports = {
  createSales,
  createSalesProducts,
};
