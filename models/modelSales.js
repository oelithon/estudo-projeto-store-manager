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

const getSalesList = async () => {
  const [salesList] = await connection.execute(
    `
    SELECT p.sale_id AS saleId, s.date, p.product_id, p.quantity FROM StoreManager.sales s
    INNER JOIN StoreManager.sales_products p
    ON s.id = p.sale_id
    `,
  );
  return salesList;
};

const getSaleId = async (id) => {
  const [onlySale] = await connection.execute(
    `
    SELECT s.date, p.product_id, p.quantity FROM StoreManager.sales s
    INNER JOIN StoreManager.sales_products p
    ON s.id = p.sale_id
    WHERE p.sale_id = ?
    `, [id],
  );
  return onlySale;
};

const updateSale = async (id, productId, quantity) => {
  const [sale] = await connection.execute(
    `
    UPDATE StoreManager.sales_products
    SET quantity = ?
    WHERE sale_id = ? AND product_id = ?
    `, [quantity, id, productId],
  );
  return sale;
};

const deleteSale = async (id) => {
  await connection.execute(
    `
    DELETE FROM StoreManager.sales_products
    WHERE sale_id = ?
    `, [id],
  );
};

module.exports = {
  createSales,
  createSalesProducts,
  getSalesList,
  getSaleId,
  updateSale,
  deleteSale,
};
