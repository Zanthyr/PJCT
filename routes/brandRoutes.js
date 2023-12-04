const express = require('express');
const brandController = require('../controllers/brandController.js');

const router = express.Router();

router
  .route('/')
  .get(brandController.getAllBrands)
  .post(brandController.createBrand);

router
  .route('/:id')
  .get(brandController.getBrand)
  .patch(brandController.updateBrand)
  .delete(brandController.deleteBrand);

module.exports = router;
