const express = require('express');

const router = express.Router();

const controllerProducts = require('../controllers/controllerProtucts');

router
  .route('/products')
  .post(controllerProducts.createProduct)
  .get(async (req, res) => {
    const test = await controllerProducts.getProducts();
    console.log(test);
    res.status(200).json(test);
  });

module.exports = router;
