const express = require('express');

const router = express.Router();

const validation = require('../middlewares/validation');
const controllerProducts = require('../controllers/controllerProtucts');

router
  .route('/products')
  .post(
    validation.valueRequired,
    validation.inputRequirements,
    controllerProducts.createProduct,
  )
  .get(async (req, res) => {
    const products = await controllerProducts.getProducts();
    res.status(200).json(products);
  });

module.exports = router;
