const sinon = require('sinon');
const { expect } = require('chai');
const serviceProduct = require('../../services/serviceProduct');
const controllerProducts = require('../../controllers/controllerProtucts');

const serviceSales = require('../../services/serviceSales');
const controllerSales = require('../../controllers/controllerSales');
const { equal } = require('@hapi/joi/lib/base');

describe('testes na camada controllerProducts', () => {
  describe('endpoint para listar os produtos', () => {
    const response = {};
    const request = {};

    before(() => {

      response.status = sinon.stub().returns(response);
      response.json = sinon.stub().returns();

      sinon.stub(serviceProduct, 'getProducts').resolves(true);
    });
    after(() => {
      serviceProduct.getProducts.restore();
    });

    it('será validado que todos produtos estão sendo retornados.', async () => {
      await controllerProducts.getProducts(request, response);

      expect(response.status.calledWith(200)).to.be.equal(true);
    });

    before(() => {
      request.params = [{ id: 1 }];

      response.status = sinon.stub().returns(response);
      response.json = sinon.stub().returns();

      sinon.stub(serviceProduct, 'getProductId').resolves(true);
    });
    after(() => {
      serviceProduct.getProductId.restore();
    });

    it('será validado que é possível listar um determinado produto.', async () => {
      await controllerProducts.getProductId(request, response);

      expect(response.status.calledWith(200)).to.be.equal(true);
    });
  });

  describe('endpoint para atualizar um produto', () => {
    const response = {};
    const request = {};

    before(() => {
      request.params = [{ id: 1 }];
      request.body = [{ name: 'produtoTeste', quantity: 5 }];

      response.status = sinon.stub().returns(response);
      response.json = sinon.stub().returns();

      sinon.stub(serviceProduct, 'updateProduct').resolves(true);
      sinon.stub(serviceProduct, 'getProductId').resolves(true);
    });
    after(() => {
      serviceProduct.updateProduct.restore();
      serviceProduct.getProductId.restore();
    });

    it('quando a requisição é feita corretamente, o produto deve ser alterado.', async () => {
      await controllerProducts.updateProduct(request, response);

      expect(response.status.calledWith(200)).to.be.equal(true);
    });
  });
});

describe('testes na camada controllerSales', () => {
  describe('endpoint para cadastrar vendas', () => {
    const response = {};
    const request = {};

    before(() => {
      request.body = [{ product_id: 1, quantity: 10 }];

      response.status = sinon.stub().returns(response);
      response.json = sinon.stub().returns();

      sinon.stub(serviceSales, 'createSales').resolves(true);
      sinon.stub(serviceSales, 'createSalesProducts').resolves(true);
    });
    after(() => {
      serviceSales.createSales.restore();
      serviceSales.createSalesProducts.restore();
    });

    it('é chamado o status com o código 201', async () => {
      await controllerSales.createSalesProducts(request, response);

      expect(response.status.calledWith(201)).to.be.equal(true);
    });
  });

  describe('endpoint para listar as vendas', () => {
    const response = {};
    const request = {};

    before(() => {
      response.status = sinon.stub().returns(response);
      response.json = sinon.stub().returns();

      sinon.stub(serviceSales, 'getSalesList').resolves(true);
    });
    after(() => {
      serviceSales.getSalesList.restore();
    });

    it('será validado que todas vendas estão sendo retornados.', async () => {
      await controllerSales.getSalesList(request, response);

      expect(response.status.calledWith(200)).to.be.equal(true);
    });

    before(() => {
      request.params = [{ id: 1 }];

      response.status = sinon.stub().returns(response);
      response.json = sinon.stub().returns();

      sinon.stub(serviceSales, 'getSaleId').resolves(true);
    });
    after(() => {
      serviceSales.getSaleId.restore();
    });

    it('será validado que é possível listar uma determinada venda.', async () => {
      await controllerSales.getSaleId(request, response);

      expect(response.status.calledWith(200)).to.be.equal(true);
    });
  });
});
