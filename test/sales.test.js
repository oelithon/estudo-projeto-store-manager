const frisby = require('frisby');
const mysql = require('mysql2/promise');
const Importer = require('mysql-import');
require('dotenv').config();
describe('Sales', () => {
  const products = [
    { name: 'Martelo de Thor', quantity: 10 },
    { name: 'Traje de encolhimento', quantity: 20 },
    { name: 'Escudo do Capitão América', quantity: 30 },
  ];
  const url = `http://localhost:${process.env.PORT}`;
  const INVALID_ID = 99999;
  let connection;

  beforeAll(async () => {
    const {
      MYSQL_USER,
      MYSQL_PASSWORD,
      MYSQL_HOST
    } = process.env;

    connection = mysql.createPool({
      host: MYSQL_HOST,
      user: MYSQL_USER,
      password: MYSQL_PASSWORD,
    });

    const importer = new Importer(
      { user: MYSQL_USER, password: MYSQL_PASSWORD, host: MYSQL_HOST }
    );

    await importer.import('./StoreManager.sql');

    importer.disconnect();
  });

  beforeEach(async () => {
    const values = products.map(({name, quantity}) => [name, quantity]);
    await connection.query(
      'INSERT INTO StoreManager.products (name, quantity) VALUES ?',
      [values],
    )
  });

  afterEach(async () => {
    await connection.execute('DELETE FROM StoreManager.products');
    await connection.execute('DELETE FROM StoreManager.sales');
    await connection.execute('DELETE FROM StoreManager.sales_products');
  });

  afterAll(async () => {
    await connection.execute('DROP DATABASE StoreManager')
    await connection.end();
  });

  function hasMessageField(body) {
    expect(Object.keys(body)).toContain("message");
  }

  function hasSaleField(sales, keys) {
    sales.forEach(sale => {
      keys
        .forEach((item) => expect(sale[item]).not.toBeUndefined())
    })
  }

  describe('5 - Crie um endpoint para cadastrar vendas', () => {
    it('Será validado que não é possível cadastrar compras sem o campo `product_id`', async () => {
      let result;
      let resultProductId;

      await frisby
        .get(`${url}/products/`)
        .expect('status', 200)
        .then((response) => {
          const { body } = response;
          result = JSON.parse(body);
          resultProductId = result[0].id;
        });

      await frisby
        .post(`${url}/sales/`, [
          {
            // product_id: resultProductId,
            quantity: -1,
          },
        ])
        .expect('status', 400)
        .then((secondResponse) => {
          const { json } = secondResponse;
          hasMessageField(json)
          expect(json.message).toBe('\"product_id\" is required');
        });
    });

    it('Será validado que não é possível cadastrar compras sem o campo `quantity`', async () => {
      let result;
      let resultProductId;

      await frisby
        .get(`${url}/products/`)
        .expect('status', 200)
        .then((response) => {
          const { body } = response;
          result = JSON.parse(body);
          resultProductId = result[0].id;
        });

      await frisby
        .post(`${url}/sales/`, [
          {
            product_id: resultProductId,
            // quantity: -1,
          },
        ])
        .expect('status', 400)
        .then((secondResponse) => {
          const { json } = secondResponse;
          hasMessageField(json)
          expect(json.message).toBe('\"quantity\" is required');
        });
    });

    it('Será validado que não é possível cadastrar compras com quantidade menor que zero', async () => {
      let result;
      let resultProductId;

      await frisby
        .get(`${url}/products/`)
        .expect('status', 200)
        .then((response) => {
          const { body } = response;
          result = JSON.parse(body);
          resultProductId = result[0].id;
        });

      await frisby
        .post(`${url}/sales/`, [
          {
            product_id: resultProductId,
            quantity: -1,
          },
        ])
        .expect('status', 422)
        .then((secondResponse) => {
          const { json } = secondResponse;
          hasMessageField(json)
          expect(json.message).toBe('"quantity" must be a number larger than or equal to 1');
        });
    });

    it('Será validado que não é possível cadastrar compras com quantidade igual a zero', async () => {
      let result;
      let resultProductId;

      await frisby
        .get(`${url}/products/`)
        .expect('status', 200)
        .then((response) => {
          const { body } = response;
          result = JSON.parse(body);
          resultProductId = result[0].id;
        });

      await frisby
        .post(`${url}/sales/`, [
          {
            product_id: resultProductId,
            quantity: 0,
          },
        ])
        .expect('status', 422)
        .then((secondResponse) => {
          const { json } = secondResponse;
          hasMessageField(json)
          expect(json.message).toBe('"quantity" must be a number larger than or equal to 1');
        });
    });

    it('Será validado que não é possível cadastrar compras com uma string no campo quantidade', async () => {
      let result;
      let resultProductId;

      await frisby
        .get(`${url}/products/`)
        .expect('status', 200)
        .then((response) => {
          const { body } = response;
          result = JSON.parse(body);
          resultProductId = result[0].id;
        });

      await frisby
        .post(`${url}/sales/`, [
          {
            product_id: resultProductId,
            quantity: 'String',
          },
        ])
        .expect('status', 422)
        .then((secondResponse) => {
          const { json } = secondResponse;
          hasMessageField(json)
          expect(json.message).toBe('"quantity" must be a number larger than or equal to 1');
        });
    });

    it('Será validado que é possível criar uma compra com sucesso', async () => {
      let result;
      let resultProductId;

      await frisby
        .get(`${url}/products/`)
        .expect('status', 200)
        .then((response) => {
          const { body } = response;
          result = JSON.parse(body);
          resultProductId = result[0].id;
        });

      await frisby
        .post(`${url}/sales/`, [
          {
            product_id: resultProductId,
            quantity: 2,
          },
        ])
        .expect('status', 201)
        .then((secondResponse) => {
          const { json } = secondResponse;
          const idFirstItenSold = json.itemsSold[0].product_id;
          const quantityFirstItenSold = json.itemsSold[0].quantity;
          expect(json).toHaveProperty('id');
          expect(idFirstItenSold).toBe(resultProductId);
          expect(quantityFirstItenSold).toBe(2);
        });
    });

    it('Será validado que é possível criar várias compras com sucesso', async () => {
      let result;
      let resultProductId;

      await frisby
        .get(`${url}/products/`)
        .expect('status', 200)
        .then((response) => {
          const { body } = response;
          result = JSON.parse(body);
          resultProductId = result[0].id;
        });

      await frisby
        .post(`${url}/sales/`, [
          {
            product_id: resultProductId,
            quantity: 2,
          },
          {
            product_id: resultProductId,
            quantity: 6,
          },
        ])
        .expect('status', 201)
        .then((secondResponse) => {
          const { json } = secondResponse;
          const idFirstItenSold = json.itemsSold[0].product_id;
          const quantityFirstItenSold = json.itemsSold[0].quantity;
          const idSecondItenSold = json.itemsSold[1].product_id;
          const quantitySecondItenSold = json.itemsSold[1].quantity;
          expect(json).toHaveProperty('id');
          expect(idFirstItenSold).toBe(resultProductId);
          expect(quantityFirstItenSold).toBe(2);
          expect(idSecondItenSold).toBe(resultProductId);
          expect(quantitySecondItenSold).toBe(6);
        });
    });
  });

  describe('6 - Crie um endpoint para listar as vendas', () => {
    it('Será validado que todas as vendas estão sendo retornadas', async () => {
      let result;
      let resultFirstSale;
      let resultSecondSale;
      let resultFirstSaleId;
      let resultSecondSaleId;
      let firstProductId;
      let secondProductId;

      await frisby
        .get(`${url}/products/`)
        .expect('status', 200)
        .then((response) => {
          const { body } = response;
          result = JSON.parse(body);
          firstProductId = result[0].id;
          secondProductId = result[1].id;
        });

      await frisby
        .post(`${url}/sales/`, [
          {
            product_id: firstProductId,
            quantity: 2,
          },
          {
            product_id: secondProductId,
            quantity: 6,
          },
        ])
        .expect('status', 201)
        .then((responseSales) => {
          const { body } = responseSales;
          resultFirstSale = JSON.parse(body);
          resultFirstSaleId = resultFirstSale.id;
        });

        await frisby
        .post(`${url}/sales/`, [
          {
            product_id: firstProductId,
            quantity: 4,
          },
          {
            product_id: secondProductId,
            quantity: 3,
          },
        ])
        .expect('status', 201)
        .then((responseSales) => {
          const { body } = responseSales;
          resultSecondSale = JSON.parse(body);
          resultSecondSaleId = resultSecondSale.id;
        });

      await frisby
        .get(`${url}/sales/`)
        .expect('status', 200)
        .then((responseAll) => {
          const { body } = responseAll;
          const resultAllSales = JSON.parse(body);
          hasSaleField(resultAllSales, ["saleId", "date", "product_id", "quantity"]);

          const firstSale = resultAllSales[0];
          const secondSale = resultAllSales[2];

          expect(resultAllSales.length).toBe(4);
          expect(firstSale.saleId).toBe(resultFirstSaleId);
          expect(resultAllSales[0]).not.toHaveProperty("id");
          expect(secondSale.saleId).toBe(resultSecondSaleId);
          expect(resultAllSales[1]).not.toHaveProperty("id");
        });
    });

    it('Será validado que é possível listar uma determinada venda', async () => {
      let result;
      let resultSales;
      let firstProductId;
      let secondProductId;

      await frisby
        .get(`${url}/products/`)
        .expect('status', 200)
        .then((response) => {
          const { body } = response;
          result = JSON.parse(body);
          firstProductId = result[0].id;
          secondProductId = result[1].id;
        });

      await frisby
        .post(`${url}/sales/`, [
          {
            product_id: firstProductId,
            quantity: 2,
          },
          {
            product_id: secondProductId,
            quantity: 6,
          },
        ])
        .expect('status', 201)
        .then((responseSales) => {
          const { body } = responseSales;
          resultSales = JSON.parse(body);
        });

      await frisby
        .get(`${url}/sales/${resultSales.id}`)
        .expect('status', 200)
        .then((responseOne) => {
          const { body } = responseOne;
          const responseAll = JSON.parse(body);
          hasSaleField(responseAll, ["date", "product_id", "quantity"]);

          const productIdFirstProduct = responseAll[0].product_id;
          const productIdSecondProduct = responseAll[1].product_id;
          expect(responseAll.length).toBe(2);
         
          expect(productIdFirstProduct).toBe(firstProductId);
          expect(productIdSecondProduct).toBe(secondProductId);
          expect(responseAll[0]).not.toHaveProperty("saleId");
          expect(responseAll[1]).not.toHaveProperty("saleId");
          expect(responseAll[0]).not.toHaveProperty("id");
          expect(responseAll[1]).not.toHaveProperty("id");
        });
    });

    it('Será validado que não é possível listar uma venda inexistente', async () => {
      await frisby
        .get(`${url}/sales/${INVALID_ID}`)
        .expect('status', 404)
        .then((responseOne) => {
          const { body } = responseOne;
          const responseError = JSON.parse(body);
          hasMessageField(responseError)
          expect(responseError.message).toEqual('Sale not found');
        });
    });
  });

  describe('7 - Crie um endpoint para atualizar uma venda', () => {
    it('Será validado que não é possível atualizar vendas sem o campo quantity', async () => {
      let result;
      let resultProductId;
      let resultSales;
      let resultSalesId;

      await frisby
        .get(`${url}/products/`)
        .expect('status', 200)
        .then((response) => {
          const { body } = response;
          result = JSON.parse(body);
          resultProductId = result[0].id;
        });

      await frisby
        .post(`${url}/sales/`, [
          {
            product_id: resultProductId,
            quantity: 2,
          },
        ])
        .expect('status', 201)
        .then((responseSales) => {
          const { body } = responseSales;
          resultSales = JSON.parse(body);
          resultSalesId = resultSales.id;
        });

      await frisby
        .put(`${url}/sales/${resultSales.id}`, [
          {
            product_id: resultProductId,
          },
        ])
        .expect('status', 400)
        .then((responseEdit) => {
          const { body } = responseEdit;
          const responseEditBody = JSON.parse(body);
          hasMessageField(responseEditBody)
          const error = responseEditBody.code;
          const { message } = responseEditBody;
          expect(message).toBe('\"quantity\" is required');
        });
    });

    it('Será validado que não é possível atualizar vendas sem o campo product_id', async () => {
      let result;
      let resultProductId;
      let resultSales;
      let resultSalesId;

      await frisby
        .get(`${url}/products/`)
        .expect('status', 200)
        .then((response) => {
          const { body } = response;
          result = JSON.parse(body);
          resultProductId = result[0].id;
        });

      await frisby
        .post(`${url}/sales/`, [
          {
            product_id: resultProductId,
            quantity: 2,
          },
        ])
        .expect('status', 201)
        .then((responseSales) => {
          const { body } = responseSales;
          resultSales = JSON.parse(body);
          resultSalesId = resultSales.id;
        });

      await frisby
        .put(`${url}/sales/${resultSales.id}`, [
          {
            quantity: 100,
          },
        ])
        .expect('status', 400)
        .then((responseEdit) => {
          const { body } = responseEdit;
          const responseEditBody = JSON.parse(body);
          hasMessageField(responseEditBody)
          const error = responseEditBody.code;
          const { message } = responseEditBody;
          expect(message).toBe('\"product_id\" is required');
        });
    });

    it('Será validado que não é possível atualizar vendas com quantidade menor que zero', async () => {
      let result;
      let resultProductId;
      let resultSales;
      let resultSalesId;

      await frisby
        .get(`${url}/products/`)
        .expect('status', 200)
        .then((response) => {
          const { body } = response;
          result = JSON.parse(body);
          resultProductId = result[0].id;
        });

      await frisby
        .post(`${url}/sales/`, [
          {
            product_id: resultProductId,
            quantity: 2,
          },
        ])
        .expect('status', 201)
        .then((responseSales) => {
          const { body } = responseSales;
          resultSales = JSON.parse(body);
          resultSalesId = resultSales.id;
        });

      await frisby
        .put(`${url}/sales/${resultSales.id}`, [
          {
            product_id: resultProductId,
            quantity: -1,
          },
        ])
        .expect('status', 422)
        .then((responseEdit) => {
          const { body } = responseEdit;
          const responseEditBody = JSON.parse(body);
          hasMessageField(responseEditBody)
          const error = responseEditBody.code;
          const { message } = responseEditBody;
          expect(message).toBe('"quantity" must be a number larger than or equal to 1');
        });
    });

    it('Será validado que não é possível atualizar vendas com quantidade igual a zero', async () => {
      let result;
      let resultProductId;
      let resultSales;
      let resultSalesId;

      await frisby
        .get(`${url}/products/`)
        .expect('status', 200)
        .then((response) => {
          const { body } = response;
          result = JSON.parse(body);
          resultProductId = result[0].id;
        });

      await frisby
        .post(`${url}/sales/`, [
          {
            product_id: resultProductId,
            quantity: 2,
          },
        ])
        .expect('status', 201)
        .then((responseSales) => {
          const { body } = responseSales;
          resultSales = JSON.parse(body);
          resultSalesId = resultSales.id;
        });

      await frisby
        .put(`${url}/sales/${resultSalesId}`, [
          {
            product_id: resultProductId,
            quantity: 0,
          },
        ])
        .expect('status', 422)
        .then((responseEdit) => {
          const { body } = responseEdit;
          const responseEditBody = JSON.parse(body);
          const error = responseEditBody.code;
          const { message } = responseEditBody;
          expect(message).toBe('"quantity" must be a number larger than or equal to 1');
        });
    });

    it('Será validado que não é possível atualizar vendas com uma string no campo quantidade', async () => {
      let result;
      let resultProductId;
      let resultSales;
      let resultSalesId;

      await frisby
        .get(`${url}/products/`)
        .expect('status', 200)
        .then((response) => {
          const { body } = response;
          result = JSON.parse(body);
          resultProductId = result[0].id;
        });

      await frisby
        .post(`${url}/sales/`, [
          {
            product_id: resultProductId,
            quantity: 2,
          },
        ])
        .expect('status', 201)
        .then((responseSales) => {
          const { body } = responseSales;
          resultSales = JSON.parse(body);
          resultSalesId = resultSales.id;
        });

      await frisby
        .put(`${url}/sales/${resultSalesId}`, [
          {
            product_id: resultProductId,
            quantity: 'String',
          },
        ])
        .expect('status', 422)
        .then((responseEdit) => {
          const { body } = responseEdit;
          const responseEditBody = JSON.parse(body);
          const error = responseEditBody.code;
          const { message } = responseEditBody;
          expect(message).toBe('"quantity" must be a number larger than or equal to 1');
        });
    });

    it('Será validado que é possível atualizar uma venda com sucesso', async () => {
      let result;
      let resultProductId;
      let resultSales;
      let resultSalesId;

      await frisby
        .get(`${url}/products/`)
        .expect('status', 200)
        .then((response) => {
          const { body } = response;
          result = JSON.parse(body);
          resultProductId = result[0].id;
        });

      await frisby
        .post(`${url}/sales/`, [
          {
            product_id: resultProductId,
            quantity: 2,
          },
        ])
        .expect('status', 201)
        .then((responseSales) => {
          const { body } = responseSales;
          resultSales = JSON.parse(body);
          resultSalesId = resultSales.id;
        });

      await frisby
        .put(`${url}/sales/${resultSalesId}`, [
          {
            product_id: resultProductId,
            quantity: 5,
          },
        ])
        .expect('status', 200)
        .then((responseEdit) => {
          const { body } = responseEdit;
          const responseEditBody = JSON.parse(body);
          const salesId = parseInt(responseEditBody.saleId);
          const idProductSales = responseEditBody.itemUpdated[0].product_id;
          const quantityProductSales = responseEditBody.itemUpdated[0].quantity;
          expect(responseEditBody).not.toHaveProperty('id');
          expect(responseEditBody).toHaveProperty('saleId');
          expect(responseEditBody).toHaveProperty('itemUpdated');
          expect(responseEditBody.itemUpdated[0]).toHaveProperty('product_id');
          expect(responseEditBody.itemUpdated[0]).toHaveProperty('quantity');
          expect(salesId).toBe(resultSalesId);
          expect(idProductSales).toBe(resultSales.itemsSold[0].product_id);
          expect(quantityProductSales).toBe(5);
        });

        await frisby
        .get(`${url}/sales/${resultSalesId}`)
        .expect('status', 200)
        .then((responseEdited) => {
          const { body } = responseEdited;
          const responseEditBody = JSON.parse(body);
          const idProductSales = responseEditBody[0].product_id;
          const quantityProductSales = responseEditBody[0].quantity;
          expect(idProductSales).toBe(resultSales.itemsSold[0].product_id);
          expect(quantityProductSales).toBe(5);
        });
        
        
    });
  });

  describe('10 - Crie um endpoint para deletar uma venda', () => {
    it('Será validado que é possível deletar uma venda com sucesso', async () => {
      let result;
      let resultSales;
      let resultProductId;
      let resultSalesId;

      await frisby
        .get(`${url}/products/`)
        .expect('status', 200)
        .then((response) => {
          const { body } = response;
          result = JSON.parse(body);
          resultProductId = result[0].id;
        });

      await frisby
        .post(`${url}/sales/`, [
          {
            product_id: resultProductId,
            quantity: 2,
          },
        ])
        .expect('status', 201)
        .then((responseSales) => {
          const { body } = responseSales;
          resultSales = JSON.parse(body);
          resultSalesId = resultSales.id;
        });

      await frisby
        .delete(`${url}/sales/${resultSalesId}`)
        .expect('status', 200)
        .then((responseDelete) => {
          const { body } = responseDelete;
          const responseDeleteBody = JSON.parse(body);
          hasSaleField(responseDeleteBody, ["date", "product_id", "quantity"]);
        });

      await frisby
        .get(`${url}/sales/${resultSalesId}`)
        .expect('status', 404)
        .expect((resultGet) => {
          const { body } = resultGet;
          const resultGetBody = JSON.parse(body);
          const error = resultGetBody.code;
          const { message } = resultGetBody;
          expect(message).toBe('Sale not found');
        });
    });

    it('Será validado que não é possível deletar uma venda que não existe', async () => {
      await frisby
        .delete(`${url}/sales/${INVALID_ID}`)
        .expect('status', 404)
        .expect((resultDelete) => {
          const { body } = resultDelete;
          const resultDeleteBody = JSON.parse(body);
          const error = resultDeleteBody.code;
          const { message } = resultDeleteBody;
          expect(message).toBe('Sale not found');
        });
    });
  });

  describe('11 - Atualize a quantidade de produtos', () => {
    it('Será validado que é possível atualizar a quantidade do produto ao fazer uma compra', async () => {
      let result;
      let responseProductId;

      await frisby
        .get(`${url}/products/`)
        .expect('status', 200)
        .then((response) => {
          const { body } = response;
          result = JSON.parse(body);
          responseProductId = result[0].id;
        });

      await frisby
        .post(`${url}/sales/`, [
          {
            product_id: responseProductId,
            quantity: 2,
          },
        ])
        .expect('status', 201);

      await frisby
        .get(`${url}/products/${responseProductId}`)
        .expect('status', 200)
        .expect((responseProducts) => {
          const { body } = responseProducts;
          const resultProducts = JSON.parse(body);
          const quantityProducts = resultProducts.quantity;
          expect(quantityProducts).toBe(8);
        });
    });

    it('Será validado que é possível atualizar a quantidade do produto ao deletar uma compra', async () => {
      let result;
      let resultSales;
      let responseProductId;
      let responseSalesId;

      await frisby
        .get(`${url}/products/`)
        .expect('status', 200)
        .then((response) => {
          const { body } = response;
          result = JSON.parse(body);
          responseProductId = result[0].id;
        });

      await frisby
        .post(`${url}/sales/`, [
          {
            product_id: responseProductId,
            quantity: 2,
          },
        ])
        .expect('status', 201)
        .then((responseSales) => {
          const { body } = responseSales;
          resultSales = JSON.parse(body);
          responseSalesId = resultSales.id;
        });

      await frisby.delete(`${url}/sales/${responseSalesId}`).expect('status', 200);

      await frisby
        .get(`${url}/products/${responseProductId}`)
        .expect('status', 200)
        .expect((responseProducts) => {
          const { body } = responseProducts;
          const resultProducts = JSON.parse(body);
          const quantityProducts = resultProducts.quantity;
          expect(quantityProducts).toBe(10);
        });
    });
  });

  describe('12 - Valide a quantidade de produtos', () => {
    it('Será validado que o estoque do produto nunca fique com a quantidade menor que zero', async () => {
      let result;
      let responseProductId;

      await frisby
        .get(`${url}/products/`)
        .expect('status', 200)
        .then((response) => {
          const { body } = response;
          result = JSON.parse(body);
          responseProductId = result[0].id;
        });

      await frisby
        .post(`${url}/sales/`, [
          {
            product_id: responseProductId,
            quantity: 100,
          },
        ])
        .expect('status', 422)
        .then((responseSales) => {
          const { json } = responseSales;
          expect(json.message).toBe('Such amount is not permitted to sell');
        });
    });
  });
})
