const sinon = require('sinon');
const { expect } = require('chai');
const connection = require('../../models/connection');
const modelProducts = require('../../models/modelProducts');
const modelSales = require('../../models/modelSales');

describe('modelProducts', () => {

  describe('endpoint para listar os produtos', () => {
    before(() => {
      const mock = [[{
        id: 1,
        name: "produto A",
        quantity: 10
      }], []];
      sinon.stub(connection, 'execute').resolves(mock);
    });
    after(() => {
      connection.execute.restore();
    });
    it('a requisição é feita corretamente', async () => {
      const products = await modelProducts.getProducts();
      expect(products).to.be.an('array');
    });
  });
});

describe('modelSales', () => {
  describe('endpoint para cadastrar vendas', () => {
    before(() => {
      const mock = [[
        {
          "product_id": 1,
          "quantity": 2
        },
        {
          "product_id": 2,
          "quantity": 5
        }
      ], []];
      sinon.stub(connection, 'execute').resolves(mock);
    });
    after(() => {
      connection.execute.restore();
    });

    it('a requisição é feita corretamente', async () => {
      const createSales = await modelSales.createSalesProducts();
      expect(createSales).to.be.an('array');
    });
  });
});
