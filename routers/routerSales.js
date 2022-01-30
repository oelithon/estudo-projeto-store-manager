const express = require('express');

const router = express.Router();

const validationSales = require('../middlewares/validationSales');
const controllerSales = require('../controllers/controllerSales');

router
  .route('/sales/:id')
  .get(
    validationSales.notFoundSales,
    controllerSales.getSaleId,
  )
  .put(
    validationSales.validateInput,
    controllerSales.updateSale,
  )
  .delete(
    validationSales.notFoundSales,
    controllerSales.deleteSale,
  );

router
  .route('/sales')
  .get(controllerSales.getSalesList)
  .post(
    validationSales.validateInput,
    validationSales.insufficientAmount,
    controllerSales.createSalesProducts,
  );

module.exports = router;
