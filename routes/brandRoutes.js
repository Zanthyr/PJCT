const express = require('express');
const brandController = require('../controllers/brandController.js');
const authController = require('../controllers/authController.js');

const router = express.Router();

router.use(authController.protect);

router.route('/My').get(brandController.getAllMyBrands);
router.route('/My/:id').get(brandController.getMyBrand);

router
  .route('/createMy/')
  .post(
    authController.restrictTo('admin'),
    authController.restrictToCompanyType('BrandOwner'),
    brandController.createMyBrand,
  );

router
  .route('/updateMy/:id')
  .patch(authController.restrictTo('admin'), brandController.updateMyBrand);

router
  .route('/delete/:id')
  .patch(authController.restrictTo('admin'), brandController.softDeleteBrand);

router.use(authController.restrictTo('root'));

router
  .route('/')
  .get(brandController.getAllBrands)
  .post(brandController.createBrand);

router
  .route('/:id')
  .get(brandController.getBrand)
  .patch(brandController.updateBrand);

router.route('/delete/:id').patch(brandController.softDeleteBrand);

router.route('/:id').delete(brandController.deleteBrand);

module.exports = router;
