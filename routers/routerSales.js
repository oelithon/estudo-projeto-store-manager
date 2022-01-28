const express = require('express');

const router = express.Router();

const validationSales = require('../middlewares/validationSales');
const controllerSales = require('../controllers/controllerSales');

router
  .route('/sales')
  .post(
    validationSales.validateInput,
    controllerSales.createSalesProducts,
  );

module.exports = router;
