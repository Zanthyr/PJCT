const express = require('express');
const brandController = require('../controllers/brandController.js');
const authController = require('../controllers/authController.js');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(brandController.getAllBrands)
  .post(brandController.createBrand);

router
  .route('/:id')
  .get(brandController.getBrand)
  .patch(brandController.updateBrand);

router.use(authController.restrictTo('systemAdmin'));

router.route('/delete/:id').patch(brandController.softDeleteBrand);
//router.route('/:id').delete(brandController.deleteBrand);

module.exports = router;
