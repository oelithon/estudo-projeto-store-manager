const sinon = require('sinon');
const { expect } = require('chai');
const modelProducts = require('../../models/modelProducts');
const serviceProduct = require('../../services/serviceProduct');

const modelSales = require('../../models/modelSales');
const serviceSales = require('../../services/serviceSales');

describe('serviceProducts', () => {
  describe('endpoint para listar os produtos', () => {
    before(() => {
      const mock = [{ "id": 1, "name": "produto", "quantity": 10 }];
      sinon.stub(modelProducts, 'getProducts').resolves(mock);
    });
    after(() => {
      modelProducts.getProducts.restore();
    });
    it('a requisição é feita corretamente', async () => {
      const products = await serviceProduct.getProducts();
      expect(products).to.be.an('array');
    });
  });
});

describe('serviceSales', () => {
  describe('endpoint para cadastrar vendas', () => {
    before(() => {
      const mock = [
        {
          "product_id": 1,
          "quantity": 2
        },
        {
          "product_id": 2,
          "quantity": 5
        }
      ];
      sinon.stub(modelSales, 'createSalesProducts').resolves(mock);
    });
    after(() => {
      modelSales.createSalesProducts.restore();
    });
    it('Quando a requisição é feita com sucesso', async () => {
      const sales = await serviceSales.createSalesProducts();
      expect(sales).to.be.an('array');
    });
  });
});
