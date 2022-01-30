const sinon = require('sinon');
const { expect } = require('chai');
const connection = require('../../models/connection');
const modelProducts = require('../../models/modelProducts');

describe('Products Model', () => {
  describe('Não existe produtos cadastrados no banco de dados', async () => {
    before(async () => {
      const mock = [[], [{}, {}]];
      sinon.stub(connection, 'execute').resolves(mock);
    });
    after(async () => {
      connection.execute.restore();
    });

    if ('retorna um array vazio', async () => {
      const products = await modelProducts.getProducts();
      expect(products).to.be.empty;
    });
    if ('retorna um array de objetos', () => {
      const products = await modelProducts.getProducts();
      expect(products).to.be.an('array');
    });
  });
});
