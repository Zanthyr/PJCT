const express = require('express');
const brandController = require('../controllers/brandController.js');
const authController = require('../controllers/authController.js');

const router = express.Router();

router.use(authController.protect);

router.route('/').get(brandController.getAllBrands);

router.route('/:id').get(brandController.getBrand);

router.use(authController.restrictTo('systemAdmin', 'companyAdmin'));

router.route('/').post(brandController.createBrand);

router.use(authController.restrictTo('systemAdmin'));

router.route('/delete/:id').patch(brandController.softDeleteBrand);
router
  .route('/:id')
  .patch(brandController.updateBrand)
  .delete(brandController.deleteBrand);

module.exports = router;
