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
  );

router
  .route('/sales')
  .get(controllerSales.getSalesList)
  .post(
    validationSales.validateInput,
    controllerSales.createSalesProducts,
  );

module.exports = router;
