const sinon = require('sinon');
const { expect } = require('chai');
const serviceProduct = require('../../services/serviceProduct');
const controllerProducts = require('../../controllers/controllerProtucts');

const serviceSales = require('../../services/serviceSales');
const controllerSales = require('../../controllers/controllerSales');

describe('endpoint para listar os produtos', () => {
  const response = {};
  const request = {};

  before(() => {

    response.status = sinon.stub().returns(response);
    response.json = sinon.stub().returns();

    sinon.stub(serviceProduct, 'getProducts').resolves(true);
  })

  after(() => {
    serviceProduct.getProducts.restore();
  });

  it('é chamado o status com o código 200', async () => {
    await controllerProducts.getProducts(request, response);

    expect(response.status.calledWith(200)).to.be.equal(true);
  });
});

describe('endpoint para cadastrar vendas', () => {
  const response = {};
  const request = {};

  before(() => {
    request.body = [{ product_id: 1, quantity: 10 }];

    response.status = sinon.stub().returns(response);
    response.json = sinon.stub().returns();

    sinon.stub(serviceSales, 'createSales').resolves(true);
    sinon.stub(serviceSales, 'createSalesProducts').resolves(true);
  })

  after(() => {
    serviceSales.createSales.restore();
    serviceSales.createSalesProducts.restore();
  });

  it('é chamado o status com o código 201', async () => {
    await controllerSales.createSalesProducts(request, response);

    expect(response.status.calledWith(201)).to.be.equal(true);
  });
});
